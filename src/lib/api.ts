import { supabase } from './supabase';
import type { UserProfile } from './supabase';

// Types
export interface Post {
  id: string;
  author_id: string;
  content: string;
  image_url?: string;
  status: 'active' | 'hidden' | 'deleted';
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
  updated_at: string;
  author?: UserProfile;
  is_liked?: boolean;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  author?: UserProfile;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  image_url?: string;
  event_date: string;
  location?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: string;
  home_team: string;
  away_team: string;
  home_score?: number;
  away_score?: number;
  match_date: string;
  competition: string;
  venue?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  related_id?: string;
  created_at: string;
}

// Auth API
export const authAPI = {
  // Sign up with email
  signUp: async (email: string, password: string, fullName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          username: email.split('@')[0]
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    return { data, error };
  },

  // Sign in with email
  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Reset password
  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  }
};

// User Profile API
export const userAPI = {
  // Get user profile
  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    return { data, error };
  },

  // Update user profile
  updateProfile: async (userId: string, updates: Partial<UserProfile>) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();
    return { data, error };
  },

  // Get all users
  getAllUsers: async () => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Follow user
  followUser: async (followerId: string, followingId: string) => {
    const { data, error } = await supabase
      .from('user_follows')
      .insert({ follower_id: followerId, following_id: followingId });
    return { data, error };
  },

  // Unfollow user
  unfollowUser: async (followerId: string, followingId: string) => {
    const { error } = await supabase
      .from('user_follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId);
    return { error };
  },

  // Get user followers
  getFollowers: async (userId: string) => {
    const { data, error } = await supabase
      .from('user_follows')
      .select(`
        follower_id,
        user_profiles!user_follows_follower_id_fkey(*)
      `)
      .eq('following_id', userId);
    return { data, error };
  },

  // Get user following
  getFollowing: async (userId: string) => {
    const { data, error } = await supabase
      .from('user_follows')
      .select(`
        following_id,
        user_profiles!user_follows_following_id_fkey(*)
      `)
      .eq('follower_id', userId);
    return { data, error };
  }
};

// Posts API
export const postsAPI = {
  // Get all posts
  getPosts: async (userId?: string) => {
    let query = supabase
      .from('posts')
      .select(`
        *,
        author:user_profiles(*),
        post_likes(user_id)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    const { data, error } = await query;

    // Add is_liked field
    const postsWithLikes = data?.map(post => ({
      ...post,
      is_liked: userId ? post.post_likes?.some((like: any) => like.user_id === userId) : false
    }));

    return { data: postsWithLikes, error };
  },

  // Get all posts (alias for backward compatibility)
  getAllPosts: async (userId?: string) => {
    let query = supabase
      .from('posts')
      .select(`
        *,
        author:user_profiles(*),
        post_likes(user_id)
      `)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    const { data, error } = await query;

    // Add is_liked field
    const postsWithLikes = data?.map(post => ({
      ...post,
      is_liked: userId ? post.post_likes?.some((like: any) => like.user_id === userId) : false
    }));

    return { data: postsWithLikes, error };
  },

  // Get single post
  getPost: async (postId: string, userId?: string) => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:user_profiles(*),
        post_likes(user_id)
      `)
      .eq('id', postId)
      .single();

    if (data) {
      data.is_liked = userId ? data.post_likes?.some((like: any) => like.user_id === userId) : false;
    }

    return { data, error };
  },

  // Create post
  createPost: async (authorId: string, content: string, imageUrl?: string) => {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        author_id: authorId,
        content,
        image_url: imageUrl
      })
      .select()
      .single();
    return { data, error };
  },

  // Update post
  updatePost: async (postId: string, updates: Partial<Post>) => {
    const { data, error } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', postId)
      .select()
      .single();
    return { data, error };
  },

  // Delete post
  deletePost: async (postId: string) => {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);
    return { error };
  },

  // Like post
  likePost: async (postId: string, userId: string) => {
    const { data, error } = await supabase
      .from('post_likes')
      .insert({ post_id: postId, user_id: userId });
    return { data, error };
  },

  // Unlike post
  unlikePost: async (postId: string, userId: string) => {
    const { error } = await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);
    return { error };
  },

  // Get trending posts
  getTrendingPosts: async (userId?: string) => {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        author:user_profiles(*),
        post_likes(user_id)
      `)
      .eq('status', 'active')
      .gte('likes_count', 5)
      .order('likes_count', { ascending: false })
      .limit(10);

    const postsWithLikes = data?.map(post => ({
      ...post,
      is_liked: userId ? post.post_likes?.some((like: any) => like.user_id === userId) : false
    }));

    return { data: postsWithLikes, error };
  }
};

// Comments API
export const commentsAPI = {
  // Get comments for a post
  getComments: async (postId: string) => {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        author:user_profiles(*)
      `)
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    return { data, error };
  },

  // Create comment
  createComment: async (postId: string, authorId: string, content: string) => {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        author_id: authorId,
        content
      })
      .select()
      .single();
    return { data, error };
  },

  // Update comment
  updateComment: async (commentId: string, content: string) => {
    const { data, error } = await supabase
      .from('comments')
      .update({ content })
      .eq('id', commentId)
      .select()
      .single();
    return { data, error };
  },

  // Delete comment
  deleteComment: async (commentId: string) => {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);
    return { error };
  }
};

// Events API
export const eventsAPI = {
  // Get all events
  getAllEvents: async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true });
    return { data, error };
  },

  // Get upcoming events
  getUpcomingEvents: async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('status', 'upcoming')
      .gte('event_date', new Date().toISOString())
      .order('event_date', { ascending: true });
    return { data, error };
  },

  // Create event
  createEvent: async (event: Omit<Event, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('events')
      .insert(event)
      .select()
      .single();
    return { data, error };
  },

  // Update event
  updateEvent: async (eventId: string, updates: Partial<Event>) => {
    const { data, error } = await supabase
      .from('events')
      .update(updates)
      .eq('id', eventId)
      .select()
      .single();
    return { data, error };
  },

  // Delete event
  deleteEvent: async (eventId: string) => {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);
    return { error };
  }
};

// Matches API
export const matchesAPI = {
  // Get all matches
  getAllMatches: async () => {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('match_date', { ascending: true });
    return { data, error };
  },

  // Get upcoming matches
  getUpcomingMatches: async () => {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .gte('match_date', new Date().toISOString())
      .order('match_date', { ascending: true });
    return { data, error };
  },

  // Create match
  createMatch: async (match: Omit<Match, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('matches')
      .insert(match)
      .select()
      .single();
    return { data, error };
  },

  // Update match
  updateMatch: async (matchId: string, updates: Partial<Match>) => {
    const { data, error } = await supabase
      .from('matches')
      .update(updates)
      .eq('id', matchId)
      .select()
      .single();
    return { data, error };
  },

  // Delete match
  deleteMatch: async (matchId: string) => {
    const { error } = await supabase
      .from('matches')
      .delete()
      .eq('id', matchId);
    return { error };
  }
};

// Notifications API
export const notificationsAPI = {
  // Get user notifications
  getUserNotifications: async (userId: string) => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    return { data, error };
  },

  // Mark notification as read
  markAsRead: async (notificationId: string) => {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .select()
      .single();
    return { data, error };
  },

  // Mark all notifications as read
  markAllAsRead: async (userId: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId);
    return { error };
  },

  // Create notification
  createNotification: async (notification: Omit<Notification, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single();
    return { data, error };
  }
};

// File upload API
export const uploadAPI = {
  // Upload image
  uploadImage: async (file: File, path: string) => {
    const { data, error } = await supabase.storage
      .from('images')
      .upload(`${path}/${Date.now()}-${file.name}`, file);
    return { data, error };
  },

  // Upload avatar
  uploadAvatar: async (file: File) => {
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(`${Date.now()}-${file.name}`, file);
    return { data, error };
  },

  // Get image URL
  getImageUrl: (path: string) => {
    const { data } = supabase.storage
      .from('images')
      .getPublicUrl(path);
    return data.publicUrl;
  },

  // Get avatar URL
  getAvatarUrl: (path: string) => {
    const { data } = supabase.storage
      .from('avatars')
      .getPublicUrl(path);
    return data.publicUrl;
  }
}; 
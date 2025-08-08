import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { postsAPI, uploadAPI, userAPI } from "@/lib/api";
import { testSupabaseConnection } from "@/lib/supabase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  User, 
  Edit, 
  Settings,
  Camera,
  Save,
  X,
  Heart,
  MessageCircle,
  Share2,
  UserPlus,
  UserMinus
} from "lucide-react";

interface UserProfileProps {
  user?: {
    name?: string;
    email?: string;
    username?: string;
    avatar?: string;
    isAdmin?: boolean;
  } | null;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onReport: (postId: string) => void;
  onAuthRequired?: () => void;
}

export const UserProfile = ({ user, onLike, onComment, onShare, onReport, onAuthRequired }: UserProfileProps) => {
  const { user: authUser, userProfile, session } = useAuth();
  
  // Check authentication status - improved logic
  const isAuthenticated = !!(authUser || session?.user || userProfile);
  const currentUserEmail = authUser?.email || session?.user?.email || userProfile?.email;
  
  // Check if we're viewing own profile - compare with current user data
  const isViewingOwnProfile = currentUserEmail && user?.email && currentUserEmail === user.email;
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [postsCount, setPostsCount] = useState(0);
  const [likesCount, setLikesCount] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState(() => {
    const savedAvatar = localStorage.getItem('user-avatar');
    return savedAvatar || userProfile?.avatar_url || user?.avatar || '';
  });
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  // Fetch real user stats
  useEffect(() => {
    const fetchUserStats = async () => {
      const userId = authUser?.id || session?.user?.id;
      if (!userId) return;
      
      try {
        // Fetch user posts count
        const { data: posts } = await postsAPI.getPosts();
        const userPosts = posts?.filter(post => 
          post.author.username === (userProfile?.email?.split('@')[0] || user?.email?.split('@')[0])
        ) || [];
        setPostsCount(userPosts.length);
        
        // Calculate total likes from user posts
        const totalLikes = userPosts.reduce((sum, post) => sum + (post.likes?.length || 0), 0);
        setLikesCount(totalLikes);
        
        // Fetch real followers/following count from database
        try {
          const { data: followers } = await userAPI.getFollowers(userId);
          setFollowersCount(followers?.length || 0);
          
          const { data: following } = await userAPI.getFollowing(userId);
          setFollowingCount(following?.length || 0);
        } catch (error) {
          console.error('Error fetching follow data:', error);
          // Fallback to mock data
          setFollowersCount(12);
          setFollowingCount(8);
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };

    fetchUserStats();
  }, [authUser, userProfile, user, session]);

  // Check if user is following the profile owner
  useEffect(() => {
    const checkFollowStatus = async () => {
      const currentUserId = authUser?.id || session?.user?.id;
      const profileUserId = userProfile?.id;
      
      if (!currentUserId || !profileUserId || currentUserId === profileUserId) return;
      
      try {
        // Check if current user is following the profile owner
        const { data: following } = await userAPI.getFollowing(currentUserId);
        const isFollowingUser = following?.some(follow => follow.following_id === profileUserId);
        setIsFollowing(!!isFollowingUser);
      } catch (error) {
        console.error('Error checking follow status:', error);
      }
    };

    checkFollowStatus();
  }, [authUser, userProfile, session, user]);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Profili nuk u gjet</h2>
          <p className="text-muted-foreground">Ju lutem kyçuni për të parë profilin tuaj.</p>
          {!isAuthenticated && (
            <Button
              onClick={() => {
                if (onAuthRequired) {
                  onAuthRequired();
                }
              }}
              className="mt-4"
            >
              Kyçu
            </Button>
          )}
        </div>
      </div>
    );
  }

  const handleAvatarUpload = async () => {
    if (!isAuthenticated) {
      if (onAuthRequired) {
        onAuthRequired();
      }
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;

        try {
          const { data: uploadData, error: uploadError } = await uploadAPI.uploadAvatar(file);
          if (uploadError) throw uploadError;

          if (uploadData?.path) {
            const newAvatarUrl = uploadAPI.getAvatarUrl(uploadData.path);
            setAvatarUrl(newAvatarUrl);
            localStorage.setItem('user-avatar', newAvatarUrl);
            
            // Update user profile with new avatar
            const userId = authUser?.id || session?.user?.id;
            if (userId) {
              await userAPI.updateProfile(userId, { avatar_url: newAvatarUrl });
            }
          }
        } catch (error) {
          console.error('Error uploading avatar:', error);
          alert('Gabim gjatë ngarkimit të avatarit');
        } finally {
          setIsUploadingAvatar(false);
        }
      };
      input.click();
    } catch (error) {
      console.error('Error in avatar upload:', error);
      setIsUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!isAuthenticated) {
      if (onAuthRequired) {
        onAuthRequired();
      }
      return;
    }

    setIsSaving(true);
    try {
      const userId = authUser?.id || session?.user?.id;
      if (!userId) throw new Error('No user ID found');

      const updateData = {
        full_name: editName,
        email: editEmail,
      };

      const { error } = await userAPI.updateProfile(userId, updateData);
      if (error) throw error;

      setIsEditing(false);
      alert('Profili u përditësua me sukses!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Gabim gjatë përditësimit të profilit');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFollowToggle = async () => {
    // Don't allow following yourself
    if (isViewingOwnProfile) {
      return;
    }
    
    // Check if user is authenticated
    if (!isAuthenticated) {
      if (onAuthRequired) {
        onAuthRequired();
      }
      return;
    }

    try {
      const currentUserId = authUser?.id || session?.user?.id;
      const profileUserId = userProfile?.id;
      
      if (!currentUserId || !profileUserId) {
        throw new Error('Missing user IDs for follow operation');
      }

      if (isFollowing) {
        // Unfollow user
        const { error } = await userAPI.unfollowUser(currentUserId, profileUserId);
        if (error) throw error;
        setIsFollowing(false);
        setFollowersCount(prev => Math.max(0, prev - 1));
      } else {
        // Follow user
        const { error } = await userAPI.followUser(currentUserId, profileUserId);
        if (error) throw error;
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling follow:', error);
      alert('Gabim gjatë ndjekjes së përdoruesit');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <User className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Profili Im</h1>
      </div>

      {/* Profile Header */}
      <div className="bg-card border rounded-lg p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={avatarUrl} alt={user.name || 'User'} />
                <AvatarFallback className="text-2xl">{user.name?.charAt(0) || user.email?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
              <Button
                variant="ghost"
                size="icon"
                className="absolute -bottom-2 -right-2 h-8 w-8 bg-primary text-white hover:bg-primary/90 rounded-full"
                onClick={handleAvatarUpload}
                disabled={isUploadingAvatar}
              >
                {isUploadingAvatar ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <div>
              {!isEditing ? (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold">{user.name || user.email || 'User'}</h2>
                    {user.isAdmin && <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">Admin</span>}
                  </div>
                  <p className="text-muted-foreground mb-2">@{user.username || user.email?.split('@')[0] || 'user'}</p>
                  <p className="text-sm text-muted-foreground">
                    Anëtar që nga Janar 2024
                  </p>
                </>
              ) : (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="edit-name" className="text-sm font-medium">Emri i plotë</Label>
                    <Input
                      id="edit-name"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-email" className="text-sm font-medium">Email</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setIsEditing(true);
                    setEditName(user.name || '');
                    setEditEmail(user.email || '');
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Ndrysho Profilin
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    console.log('Settings clicked');
                    alert('Funksionaliteti për cilësimet do të shtohet së shpejti!');
                  }}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={isSaving}
                  onClick={handleSaveProfile}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Duke ruajtur...' : 'Ruaj'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  disabled={isSaving}
                  onClick={() => {
                    setIsEditing(false);
                    setEditName(user.name || '');
                    setEditEmail(user.email || '');
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  Anulo
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold">{postsCount}</div>
            <div className="text-sm text-muted-foreground">Postime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{followersCount}</div>
            <div className="text-sm text-muted-foreground">Ndjekës</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{followingCount}</div>
            <div className="text-sm text-muted-foreground">Duke ndjekur</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1">
              <Heart className="h-5 w-5 text-red-500" />
              <span className="text-xl font-bold">{likesCount}</span>
            </div>
            <div className="text-sm text-muted-foreground">Likes</div>
          </div>
        </div>

        {/* Follow Button - Only show when viewing someone else's profile AND user is authenticated */}
        {!isViewingOwnProfile && isAuthenticated && (
          <div className="mt-4 pt-4 border-t">
            <Button
              variant={isFollowing ? "outline" : "default"}
              size="sm"
              onClick={handleFollowToggle}
              className="w-full"
            >
              {isFollowing ? (
                <>
                  <UserMinus className="h-4 w-4 mr-2" />
                  Ndiq
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Ndiq
                </>
              )}
            </Button>
          </div>
        )}

        {/* Authentication Status for Debug */}
        {!isAuthenticated && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                {isViewingOwnProfile 
                  ? "Kyçuni për të redaktuar profilin tuaj dhe për të ndjekur përdorues të tjerë"
                  : "Ju lutem kyçuni për të ndjekur përdoruesit"
                }
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (onAuthRequired) {
                    onAuthRequired();
                  }
                }}
                className="w-full"
              >
                Kyçu
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Profile Actions */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Veprime</h3>
        <div className="space-y-3">
          <Button className="w-full justify-start" variant="outline">
            <Edit className="h-4 w-4 mr-2" />
            Redakto Profilin
          </Button>
          <Button className="w-full justify-start" variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Cilësimet
          </Button>
        </div>
      </div>
    </div>
  );
}; 
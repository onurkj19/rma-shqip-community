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
  
  console.log("UserProfile component rendered with user:", user);
  console.log("authUser:", authUser);
  console.log("session user:", session?.user);
  console.log("userProfile:", userProfile);
  
  // Check authentication status
  const isAuthenticated = authUser || session?.user || userProfile;
  console.log("Is user authenticated:", isAuthenticated);
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
        
        // TODO: Implement real followers/following count from database
        setFollowersCount(12); // Mock data for now
        setFollowingCount(8); // Mock data for now
      } catch (error) {
        console.error('Error fetching user stats:', error);
      }
    };

    fetchUserStats();
  }, [authUser, userProfile, user, session]);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Profili nuk u gjet</h2>
          <p className="text-muted-foreground">Ju lutem kyçuni për të parë profilin tuaj.</p>
          <p className="text-sm text-muted-foreground mt-2">
            Debug: user={JSON.stringify(user)}
          </p>
        </div>
      </div>
    );
  }

  // Update user data from session if available
  useEffect(() => {
    if (session?.user) {
      if (!user.name || user.name === 'Përdorues') {
        user.name = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Përdorues';
      }
      if (!user.email || user.email === 'user@example.com') {
        user.email = session.user.email || user.email;
      }
      if (!user.username || user.username === 'user') {
        user.username = session.user.email?.split('@')[0] || user.username;
      }
      if (!user.avatar) {
        user.avatar = session.user.user_metadata?.avatar_url || user.avatar;
      }
    }
  }, [session, user]);

  // Update user data from userProfile if available
  useEffect(() => {
    if (userProfile) {
      if (!user.name || user.name === 'Përdorues') {
        user.name = userProfile.full_name || user.name;
      }
      if (!user.email || user.email === 'user@example.com') {
        user.email = userProfile.email || user.email;
      }
      if (!user.username || user.username === 'user') {
        user.username = userProfile.email?.split('@')[0] || user.username;
      }
      if (!user.avatar) {
        user.avatar = userProfile.avatar_url || user.avatar;
      }
    }
  }, [userProfile, user]);

  // Update avatarUrl state with user.avatar
  useEffect(() => {
    if (user.avatar) {
      setAvatarUrl(user.avatar);
    }
  }, [user.avatar]);

  // Update editName and editEmail state with user data
  useEffect(() => {
    if (user.name) {
      setEditName(user.name);
    }
    if (user.email) {
      setEditEmail(user.email);
    }
  }, [user.name, user.email]);

  const handleAvatarUpload = async () => {
    const userId = authUser?.id || session?.user?.id;
    console.log('handleAvatarUpload - userId:', userId);
    console.log('authUser:', authUser);
    console.log('session:', session);
    
    if (!userId) {
      alert('Ju lutem kyçuni për të ngarkuar një foto profili.');
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && userId) {
        setIsUploadingAvatar(true);
        try {
          // Upload to Supabase storage
          const { data: uploadData, error: uploadError } = await uploadAPI.uploadImage(
            file,
            `avatars/${userId}`
          );

          if (uploadError) {
            throw uploadError;
          }

          // Get the public URL
          const imageUrl = uploadAPI.getImageUrl(uploadData.path);

          // Update user profile in database
          const { error: updateError } = await userAPI.updateProfile(userId, {
            avatar_url: imageUrl
          });

          if (updateError) {
            throw updateError;
          }

          // Update local state
          setAvatarUrl(imageUrl);
          localStorage.setItem('user-avatar', imageUrl);

          // Update user object
          if (user) {
            user.avatar = imageUrl;
          }

          setIsUploadingAvatar(false);
          alert('Fotoja e profilit u ngarkua me sukses!');
        } catch (error) {
          console.error('Error uploading avatar:', error);
          setIsUploadingAvatar(false);
          alert('Gabim gjatë ngarkimit të fotos. Provoni përsëri.');
        }
      }
    };
    input.click();
  };

  const handleSaveProfile = async () => {
    const userId = authUser?.id || session?.user?.id;
    console.log('handleSaveProfile - userId:', userId);
    if (!userId) {
      alert('Ju lutem kyçuni për të përditësuar profilin.');
      return;
    }
    
    setIsSaving(true);
    try {
      // Update user profile in database
      const { error } = await userAPI.updateProfile(userId, {
        full_name: editName,
        email: editEmail
      });

      if (error) {
        throw error;
      }

      // Update local state
      if (user) {
        user.name = editName;
        user.email = editEmail;
      }

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
    const userId = authUser?.id || session?.user?.id;
    console.log('handleFollowToggle - userId:', userId);
    console.log('authUser:', authUser);
    console.log('session:', session);
    console.log('userProfile:', userProfile);
    console.log('onAuthRequired callback:', onAuthRequired);
    
    // Check if user is actually authenticated
    const isAuthenticated = authUser || session?.user || userProfile;
    console.log('Is authenticated:', isAuthenticated);
    
    if (!isAuthenticated) {
      // Trigger auth modal instead of showing alert
      if (onAuthRequired) {
        console.log('Calling onAuthRequired callback');
        onAuthRequired();
      } else {
        console.log('User not authenticated, should show auth modal');
      }
      return;
    }

    try {
      // TODO: Implement real follow/unfollow API call
      setIsFollowing(!isFollowing);
      if (isFollowing) {
        setFollowersCount(prev => Math.max(0, prev - 1));
      } else {
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

        {/* Follow Button - Only show when viewing someone else's profile */}
        {(authUser?.email !== user?.email && session?.user?.email !== user?.email && userProfile?.email !== user?.email) && (
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
        
                 {/* Test buttons */}
         <div className="mt-4 pt-4 border-t space-y-2">
           <Button
             variant="outline"
             size="sm"
             onClick={() => {
               console.log('=== AUTH STATUS DEBUG ===');
               console.log('authUser:', authUser);
               console.log('session:', session);
               console.log('userProfile:', userProfile);
               console.log('user:', user);
               console.log('Is authenticated:', authUser || session?.user || userProfile);
               console.log('========================');
             }}
             className="w-full"
           >
             Debug Auth Status
           </Button>
           <Button
             variant="outline"
             size="sm"
             onClick={async () => {
               console.log('Testing Supabase connection...');
               const result = await testSupabaseConnection();
               console.log('Supabase test result:', result);
             }}
             className="w-full"
           >
             Test Supabase Connection
           </Button>
           <Button
             variant="outline"
             size="sm"
             onClick={() => {
               console.log('Test button clicked');
               if (onAuthRequired) {
                 onAuthRequired();
               }
             }}
             className="w-full"
           >
             Test Auth Modal
           </Button>
         </div>
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
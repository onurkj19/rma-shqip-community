import { useState } from "react";
import React from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { CreatePost } from "@/components/CreatePost";
import { PostCard } from "@/components/PostCard";
import { TrendingPosts } from "@/components/TrendingPosts";
import { MembersList } from "@/components/MembersList";
import { EventsList } from "@/components/EventsList";
import { MatchSchedule } from "@/components/MatchSchedule";
import { UserProfile } from "@/components/UserProfile";
import { SettingsPage } from "@/components/SettingsPage";
import { AuthModal } from "@/components/auth/AuthModal";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";



// Mock data for demonstration
const mockUser = {
  name: "Ermal Hoxha",
  avatar: "/placeholder.svg",
  username: "ermali",
  isAdmin: false
};

// We'll fetch real posts from database instead of using mock data
const mockPosts: any[] = [];

const IndexWithSupabase = () => {
  const { user, userProfile, session, loading, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState("home");
  const [posts, setPosts] = useState<any[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [postsLoading, setPostsLoading] = useState(false);

  // Auto-navigate to home after successful login
  React.useEffect(() => {
    if (user && !loading) {
      setActiveSection("home");
    }
  }, [user, loading]);

  // Load posts from localStorage and database
  React.useEffect(() => {
    const loadPosts = async () => {
      if (!user) return;
      
      setPostsLoading(true);
      try {
        // Load posts from localStorage first
        const savedPosts = localStorage.getItem('rma-posts');
        if (savedPosts) {
          const parsedPosts = JSON.parse(savedPosts);
          setPosts(parsedPosts);
        } else {
          // TODO: Implement real posts loading from database
          setPosts([]);
        }
      } catch (error) {
        console.error('Error loading posts:', error);
        setPosts([]);
      } finally {
        setPostsLoading(false);
      }
    };

    if (user && !loading) {
      loadPosts();
    }
  }, [user, loading]);

  console.log("IndexWithSupabase rendered"); // Added for debugging
  console.log("Auth modal state:", authModalOpen);
  console.log("User state:", user);
  console.log("User profile:", userProfile);
  console.log("Loading state:", loading); // Added for debugging

  const handleCreatePost = (content: string, media?: File) => {
    console.log("Creating post:", content, "with media:", media);
    
         // Use the actual logged-in user's data
     const savedAvatar = localStorage.getItem('user-avatar');
     const currentUser = userProfile ? {
       name: userProfile.full_name,
       avatar: savedAvatar || userProfile.avatar_url,
       username: userProfile.email?.split('@')[0]
     } : user ? {
       name: user.user_metadata?.full_name || user.email?.split('@')[0],
       avatar: savedAvatar || user.user_metadata?.avatar_url,
       username: user.email?.split('@')[0]
     } : mockUser;

    // Create media URL if file exists
    let mediaUrl: string | undefined;
    if (media) {
      // Convert file to base64 for localStorage storage
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Data = e.target?.result as string;
        
        const newPost = {
          id: Date.now().toString(),
          author: currentUser,
          content,
          image: media?.type.startsWith('image/') ? base64Data : undefined,
          video: media?.type.startsWith('video/') ? base64Data : undefined,
          timestamp: "Tani",
          likes: 0,
          comments: 0,
          shares: 0,
          isLiked: false
        };
        
        const updatedPosts = [newPost, ...posts];
        setPosts(updatedPosts);
        
        // Save to localStorage
        try {
          localStorage.setItem('rma-posts', JSON.stringify(updatedPosts));
        } catch (error) {
          console.error('Error saving posts to localStorage:', error);
        }
      };
      reader.readAsDataURL(media);
      return; // Exit early, the post will be created in the onload callback
    }

    const newPost = {
      id: Date.now().toString(),
      author: currentUser,
      content,
      image: undefined,
      video: undefined,
      timestamp: "Tani",
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false
    };
    
    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    
    // Save to localStorage
    try {
      localStorage.setItem('rma-posts', JSON.stringify(updatedPosts));
    } catch (error) {
      console.error('Error saving posts to localStorage:', error);
    }
  };

  const handleLike = (postId: string) => {
    const updatedPosts = posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    );
    setPosts(updatedPosts);
    
    // Save to localStorage
    try {
      localStorage.setItem('rma-posts', JSON.stringify(updatedPosts));
    } catch (error) {
      console.error('Error saving posts to localStorage:', error);
    }
  };

  const handleComment = (postId: string) => {
    console.log("Comment on post:", postId);
  };

  const handleShare = (postId: string) => {
    console.log("Share post:", postId);
  };

  const handleReport = (postId: string) => {
    console.log("Report post:", postId);
  };

  const handleDelete = (postId: string) => {
    console.log("Delete post:", postId);
    const updatedPosts = posts.filter(post => post.id !== postId);
    setPosts(updatedPosts);
    
    // Save to localStorage
    try {
      localStorage.setItem('rma-posts', JSON.stringify(updatedPosts));
    } catch (error) {
      console.error('Error saving posts to localStorage:', error);
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return (
          <div className="max-w-4xl mx-auto px-4 py-6">
                         {/* Hero Section */}
                           <div className="relative mb-8 rounded-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-700">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700"></div>
                <div className="relative z-10 p-8 md:p-12 pb-12 md:pb-12">
                  <div className="flex flex-col md:flex-row items-center justify-between">
                                         {/* Real Madrid Official Logo - Left */}
                     <div className="flex items-center space-x-4 mb-6 md:mb-0">
                       <div className="relative">
                         <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center shadow-2xl border-4 border-yellow-400 animate-in zoom-in duration-700 delay-300 hover:scale-110 transition-transform">
                           <div className="text-center">
                                                           <img 
                                src="/Rma logo.png" 
                                alt="Real Madrid Logo" 
                                className="w-12 h-12 md:w-14 md:h-14 object-contain"
                              />
                           </div>
                         </div>
                         <div className="absolute -top-2 -right-2 w-6 h-6 md:w-7 md:h-7 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center animate-in zoom-in duration-700 delay-500">
                           <div className="text-blue-900 text-xs font-bold">⚽</div>
                         </div>
                       </div>
                       <div className="hidden md:block">
                         <div className="w-1 h-16 bg-gradient-to-b from-yellow-400 to-transparent rounded-full"></div>
                       </div>
                     </div>
                    
                    {/* Center Text */}
                    <div className="text-center flex-1">
                      <h1 className="text-4xl md:text-6xl lg:text-7xl font-black mb-4 text-white animate-in slide-in-from-bottom-4 duration-700 delay-300">
                        RMA Shqip
                      </h1>
                      <p className="text-lg md:text-xl font-light text-white opacity-90 mb-2 animate-in slide-in-from-bottom-4 duration-700 delay-400">
                        Komuniteti shqiptar i Real Madrid
                      </p>
                      <div className="flex items-center justify-center space-x-2 animate-in fade-in duration-1000 delay-500">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                        <span className="text-sm text-white opacity-75 font-medium">Hala Madrid!</span>
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                      </div>
                    </div>
                    
                                         {/* Albanian Official Flag - Right */}
                     <div className="flex items-center space-x-4 mb-6 md:mb-0">
                       <div className="hidden md:block">
                         <div className="w-1 h-16 bg-gradient-to-b from-red-500 to-transparent rounded-full"></div>
                       </div>
                       <div className="relative mt-6 md:mt-0">
                         <div className="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-b from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-red-400 animate-in zoom-in duration-700 delay-300 hover:scale-110 transition-transform">
                           <div className="text-center">
                                                           <img 
                                src="/Albanian-flag.png" 
                                alt="Albanian Flag" 
                                className="w-12 h-12 md:w-14 md:h-14 object-contain"
                              />
                           </div>
                         </div>
                         <div className="absolute -top-2 -right-2 w-6 h-6 md:w-7 md:h-7 bg-gradient-to-br from-red-400 to-red-500 rounded-full flex items-center justify-center animate-in zoom-in duration-700 delay-500">
                           <div className="text-white text-xs font-bold">★</div>
                         </div>
                       </div>
                     </div>
                  </div>
                </div>
              </div>

                         <div className="animate-in slide-in-from-bottom-4 duration-600 delay-200">
               <CreatePost 
                 user={userProfile ? {
                   name: userProfile.full_name,
                   avatar: userProfile.avatar_url,
                   username: userProfile.email?.split('@')[0]
                 } : user ? {
                   name: user.user_metadata?.full_name || user.email?.split('@')[0],
                   avatar: user.user_metadata?.avatar_url,
                   username: user.email?.split('@')[0]
                 } : mockUser} 
                 onSubmit={handleCreatePost} 
               />
             </div>
            
                         <div className="space-y-6">
               {postsLoading ? (
                 <div className="text-center py-12">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                   <p className="text-muted-foreground">Duke ngarkuar postimet...</p>
                 </div>
               ) : posts.length > 0 ? (
                 posts.map((post, index) => (
                   <div 
                     key={post.id}
                     className="animate-in slide-in-from-bottom-4 duration-500"
                     style={{ animationDelay: `${index * 100}ms` }}
                   >
                                           <PostCard
                        post={post}
                        onLike={handleLike}
                        onComment={handleComment}
                        onShare={handleShare}
                        onReport={handleReport}
                        onDelete={handleDelete}
                        currentUserId={userProfile?.email?.split('@')[0] || user?.email?.split('@')[0]}
                      />
                   </div>
                 ))
               ) : (
                 <div className="text-center py-12">
                   <div className="max-w-md mx-auto">
                     <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                       <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03 8-9 8s9 3.582 9 8z" />
                       </svg>
                     </div>
                     <h3 className="text-lg font-semibold mb-2">Asnjë postim ende</h3>
                     <p className="text-muted-foreground mb-4">Bëni postimin tuaj të parë për të filluar komunitetin!</p>
                     <Button 
                       onClick={() => setActiveSection("home")}
                       className="bg-primary hover:bg-primary/90"
                     >
                       Bëj postimin të parë
                     </Button>
                   </div>
                 </div>
               )}
             </div>
          </div>
        );
      case "trending":
        return (
          <TrendingPosts
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
            onReport={handleReport}
          />
        );
      case "members":
        return <MembersList />;
      case "events":
        return <EventsList />;
      case "matches":
        return <MatchSchedule />;
                   case "profile":
        console.log("Profile section clicked");
        console.log("userProfile:", userProfile);
        console.log("user:", user);
        console.log("session:", session);
        console.log("loading:", loading);
        console.log("session?.user:", session?.user);
        console.log("session?.user?.id:", session?.user?.id);
        
        // Llogarit numrin e postimeve të përdoruesit aktual
        const userPostsCount = posts.filter(post => 
          post.author.username === (userProfile?.email?.split('@')[0] || user?.email?.split('@')[0] || session?.user?.email?.split('@')[0])
        ).length;
        
        // Create a fallback user object if both userProfile and user are null
        const profileUser = userProfile ? {
          name: userProfile.full_name,
          email: userProfile.email,
          username: userProfile.email?.split('@')[0],
          avatar: userProfile.avatar_url,
          isAdmin: userProfile.role === 'admin'
        } : user ? {
          name: user.user_metadata?.full_name || user.email?.split('@')[0],
          email: user.email,
          username: user.email?.split('@')[0],
          avatar: user.user_metadata?.avatar_url,
          isAdmin: false
        } : session?.user ? {
          name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Përdorues',
          email: session.user.email || '',
          username: session.user.email?.split('@')[0] || 'user',
          avatar: session.user.user_metadata?.avatar_url || '',
          isAdmin: false
        } : null;
        
        console.log("profileUser:", profileUser);
        console.log("profileUser.name:", profileUser?.name);
        console.log("profileUser.email:", profileUser?.email);
        
        // If session exists but profileUser is null, create a basic profile
        if (!profileUser && session?.user) {
          const basicProfile = {
            name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Përdorues',
            email: session.user.email || '',
            username: session.user.email?.split('@')[0] || 'user',
            avatar: session.user.user_metadata?.avatar_url || '',
            isAdmin: false
          };
          console.log("Created basic profile from session:", basicProfile);
          return (
            <UserProfile
              user={basicProfile}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
              onReport={handleReport}
              onAuthRequired={() => setAuthModalOpen(true)}
            />
          );
        }
        
        // If everything is null, create a fallback profile
        if (!profileUser && !session?.user) {
          const fallbackProfile = {
            name: 'Përdorues',
            email: 'user@example.com',
            username: 'user',
            avatar: '',
            isAdmin: false
          };
          console.log("Created fallback profile:", fallbackProfile);
          return (
            <UserProfile
              user={fallbackProfile}
              onLike={handleLike}
              onComment={handleComment}
              onShare={handleShare}
              onReport={handleReport}
              onAuthRequired={() => setAuthModalOpen(true)}
            />
          );
        }
        
        if (!profileUser) {
          return (
            <div className="max-w-4xl mx-auto px-4 py-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">Profili nuk u gjet</h2>
                <p className="text-muted-foreground mb-4">Ju lutem kyçuni për të parë profilin tuaj.</p>
                <p className="text-sm text-muted-foreground mb-4">
                  Debug: userProfile={userProfile ? 'exists' : 'null'}, user={user ? 'exists' : 'null'}, session={session ? 'exists' : 'null'}
                </p>
                <div className="space-y-2">
                  <Button onClick={() => setAuthModalOpen(true)}>
                    Kyçu
                  </Button>
                  <Button variant="outline" onClick={() => window.location.reload()}>
                    Rifresko faqen
                  </Button>
                </div>
              </div>
            </div>
          );
        }
         
         console.log("Rendering UserProfile with user:", profileUser);
         
         try {
           return <UserProfile 
             user={profileUser}
             onLike={handleLike}
             onComment={handleComment}
             onShare={handleShare}
             onReport={handleReport}
             onAuthRequired={() => setAuthModalOpen(true)}
           />;
         } catch (error) {
           console.error("Error rendering UserProfile:", error);
           return (
             <div className="max-w-4xl mx-auto px-4 py-6">
               <div className="text-center">
                 <h2 className="text-2xl font-bold mb-4">Gabim në ngarkimin e profilit</h2>
                 <p className="text-muted-foreground mb-4">Ju lutem provoni përsëri.</p>
                 <Button onClick={() => window.location.reload()}>
                   Rifresko faqen
                 </Button>
               </div>
             </div>
           );
         }
      case "settings":
        return <SettingsPage />;
      case "admin":
        return <AdminPanel />;
      default:
        return (
          <div className="max-w-4xl mx-auto px-4 py-6">
            <h2 className="text-2xl font-bold mb-4">Mirë se vini në RMA Shqip!</h2>
            <p>Zgjidhni një seksion nga menuja për të vazhduar.</p>
          </div>
        );
    }
  };

     if (loading) {
     return (
       <div className="min-h-screen bg-gradient-surface flex items-center justify-center">
         <div className="text-center animate-in fade-in duration-500">
           <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
           <p className="text-lg text-muted-foreground mb-4">Duke ngarkuar...</p>
           <div className="flex items-center justify-center space-x-2">
             <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
             <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
             <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
           </div>
           <button 
             onClick={() => window.location.reload()} 
             className="mt-6 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition-colors"
           >
             Rifresko faqen
           </button>
         </div>
       </div>
     );
   }

     return (
     <div className="min-h-screen bg-gradient-surface">
              <div className="animate-in slide-in-from-top-4 duration-500">
                                 <Header 
                   user={userProfile ? {
                     name: userProfile.full_name,
                     email: userProfile.email,
                     avatar: userProfile.avatar_url,
                     isAdmin: userProfile.role === 'admin'
                   } : user ? {
                     name: user.user_metadata?.full_name || user.email?.split('@')[0],
                     email: user.email,
                     avatar: user.user_metadata?.avatar_url,
                     isAdmin: false
                   } : null}
                   onMenuClick={() => setMobileMenuOpen(true)}
                   onAuthClick={() => setAuthModalOpen(true)}
                   onProfileClick={() => setActiveSection("profile")}
                 />
              </div>
       
       <div className="flex">
                  <div className="animate-in slide-in-from-left-4 duration-500 delay-200">
                    <Sidebar 
                      activeSection={activeSection}
                      onSectionChange={setActiveSection}
                      user={userProfile ? {
                        name: userProfile.full_name,
                        email: userProfile.email,
                        avatar: userProfile.avatar_url,
                        isAdmin: userProfile.role === 'admin'
                      } : user ? {
                        name: user.user_metadata?.full_name || user.email?.split('@')[0],
                        email: user.email,
                        avatar: user.user_metadata?.avatar_url,
                        isAdmin: false
                      } : null}
                      onLogout={signOut}
                    />
                  </div>
        
                 <main className="flex-1 min-h-screen animate-in fade-in duration-500 delay-300">
           {renderContent()}
         </main>
      </div>

      {/* Mobile Sidebar - Fixed overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Sidebar */}
          <div className="fixed left-0 top-0 h-full w-72 bg-background shadow-lg border-r">
            <div className="p-4">
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Menu</h2>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-accent rounded"
                >
                  ✕
                </button>
              </div>
              
              {/* Menu Items */}
              <div className="space-y-2">
                <button 
                  className={`w-full text-left p-3 rounded font-medium ${
                    activeSection === 'home' 
                      ? 'bg-secondary text-secondary-foreground' 
                      : 'hover:bg-accent'
                  }`}
                  onClick={() => {
                    setActiveSection('home');
                    setMobileMenuOpen(false);
                  }}
                >
                  Ballina
                </button>
                
                <button 
                  className={`w-full text-left p-3 rounded font-medium ${
                    activeSection === 'trending' 
                      ? 'bg-secondary text-secondary-foreground' 
                      : 'hover:bg-accent'
                  }`}
                  onClick={() => {
                    setActiveSection('trending');
                    setMobileMenuOpen(false);
                  }}
                >
                  Tendenca
                </button>
                
                <button 
                  className={`w-full text-left p-3 rounded font-medium ${
                    activeSection === 'members' 
                      ? 'bg-secondary text-secondary-foreground' 
                      : 'hover:bg-accent'
                  }`}
                  onClick={() => {
                    setActiveSection('members');
                    setMobileMenuOpen(false);
                  }}
                >
                  Anëtarët
                </button>
                
                <button 
                  className={`w-full text-left p-3 rounded font-medium ${
                    activeSection === 'events' 
                      ? 'bg-secondary text-secondary-foreground' 
                      : 'hover:bg-accent'
                  }`}
                  onClick={() => {
                    setActiveSection('events');
                    setMobileMenuOpen(false);
                  }}
                >
                  Ngjarjet
                </button>
                
                <button 
                  className={`w-full text-left p-3 rounded font-medium ${
                    activeSection === 'matches' 
                      ? 'bg-secondary text-secondary-foreground' 
                      : 'hover:bg-accent'
                  }`}
                  onClick={() => {
                    setActiveSection('matches');
                    setMobileMenuOpen(false);
                  }}
                >
                  Ndeshjet
                </button>
                
                <button 
                  className={`w-full text-left p-3 rounded font-medium ${
                    activeSection === 'profile' 
                      ? 'bg-secondary text-secondary-foreground' 
                      : 'hover:bg-accent'
                  }`}
                  onClick={() => {
                    setActiveSection('profile');
                    setMobileMenuOpen(false);
                  }}
                >
                  Profili Im
                </button>
                
                <button 
                  className={`w-full text-left p-3 rounded font-medium ${
                    activeSection === 'settings' 
                      ? 'bg-secondary text-secondary-foreground' 
                      : 'hover:bg-accent'
                  }`}
                  onClick={() => {
                    setActiveSection('settings');
                    setMobileMenuOpen(false);
                  }}
                >
                  Cilësimet
                </button>
              </div>
              
              {/* User Profile Section */}
              {userProfile && (
                <div className="mt-6 pt-4 border-t">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                      <span className="text-secondary-foreground font-semibold">
                        {userProfile.full_name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-sm">{userProfile.full_name}</p>
                      <p className="text-xs text-muted-foreground">Anëtar aktiv</p>
                    </div>
                  </div>
                  <button 
                    onClick={signOut}
                    className="w-full text-left p-3 text-destructive hover:bg-destructive/10 rounded text-sm"
                  >
                    Dil
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

             {/* Auth Modal */}
       <div className="animate-in fade-in duration-300">
         <AuthModal 
           open={authModalOpen}
           onOpenChange={setAuthModalOpen}
         />
       </div>
    </div>
  );
};

export default IndexWithSupabase; 
import { useState } from "react";
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
import { InstagramHeader } from "@/components/InstagramHeader";
import { InstagramFeed } from "@/components/InstagramFeed";
import { InstagramSidebar } from "@/components/InstagramSidebar";

import heroImage from "@/assets/hero-banner.jpg";

// Mock data for Instagram-like interface
const mockStories = [
  { id: "1", username: "real_madrid", avatar: "/placeholder.svg", hasStory: true },
  { id: "2", username: "benzema", avatar: "/placeholder.svg", hasStory: true },
  { id: "3", username: "modric", avatar: "/placeholder.svg", hasStory: false },
  { id: "4", username: "vinicius", avatar: "/placeholder.svg", hasStory: true },
  { id: "5", username: "courtois", avatar: "/placeholder.svg", hasStory: true },
  { id: "6", username: "kroos", avatar: "/placeholder.svg", hasStory: false },
];

const mockPosts = [
  {
    id: "1",
    author: {
      name: "Real Madrid",
      avatar: "/placeholder.svg",
      username: "real_madrid"
    },
    content: "Hala Madrid! 🏆⚽ #ChampionsLeague #RealMadrid",
    image: "/placeholder.svg",
    timestamp: "2 orë më parë",
    likes: 15420,
    comments: 892,
    shares: 234,
    isLiked: true,
    isSaved: false
  },
  {
    id: "2", 
    author: {
      name: "Karim Benzema",
      avatar: "/placeholder.svg",
      username: "benzema"
    },
    content: "Grateful for another amazing season with this incredible team! 🙏⚽ #RealMadrid #Benzema",
    image: "/placeholder.svg",
    timestamp: "4 orë më parë",
    likes: 89234,
    comments: 1234,
    shares: 567,
    isLiked: false,
    isSaved: true
  },
  {
    id: "3",
    author: {
      name: "Luka Modric",
      avatar: "/placeholder.svg",
      username: "modric"
    },
    content: "Training hard for the next match! 💪⚽ #Modric #RealMadrid",
    image: "/placeholder.svg",
    timestamp: "1 ditë më parë", 
    likes: 45678,
    comments: 789,
    shares: 123,
    isLiked: true,
    isSaved: false
  }
];

const mockSuggestions = [
  { id: "1", username: "vinicius", avatar: "/placeholder.svg", isFollowing: false },
  { id: "2", username: "courtois", avatar: "/placeholder.svg", isFollowing: true },
  { id: "3", username: "kroos", avatar: "/placeholder.svg", isFollowing: false },
  { id: "4", username: "valverde", avatar: "/placeholder.svg", isFollowing: true },
  { id: "5", username: "camavinga", avatar: "/placeholder.svg", isFollowing: false },
];

const Index = () => {
  const { user, userProfile, loading, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState("home");
  const [posts, setPosts] = useState(mockPosts);
  const [stories, setStories] = useState(mockStories);
  const [suggestions, setSuggestions] = useState(mockSuggestions);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Create user object for components
  const currentUser = userProfile ? {
    name: userProfile.full_name || userProfile.email,
    email: userProfile.email,
    avatar: userProfile.avatar_url || "/placeholder.svg",
    username: userProfile.email.split('@')[0],
    isAdmin: userProfile.role === 'admin'
  } : user ? {
    name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
    email: user.email,
    avatar: user.user_metadata?.avatar_url || "/placeholder.svg",
    username: user.email?.split('@')[0] || 'user',
    isAdmin: userProfile?.role === 'admin' || false
  } : null;

  const handleCreatePost = (content: string, media?: File) => {
    const newPost = {
      id: Date.now().toString(),
      author: currentUser || mockUser,
      content,
      image: media ? URL.createObjectURL(media) : undefined,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false,
      isSaved: false
    };
    setPosts([newPost, ...posts]);
  };

  const handleEditPost = (postId: string) => {
    // TODO: Implement post editing
    console.log('Edit post:', postId);
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
        : post
    ));
  };

  const handleComment = (postId: string) => {
    // TODO: Implement comment functionality
    console.log('Comment on post:', postId);
  };

  const handleShare = (postId: string) => {
    // TODO: Implement share functionality
    console.log('Share post:', postId);
  };

  const handleReport = (postId: string) => {
    alert('Postimi u raportua!');
    // TODO: Implement automatic ban system for reported posts
  };

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return (
          <div className="flex flex-col lg:flex-row">
            {/* Main Feed */}
            <div className="flex-1 max-w-2xl mx-auto">
              <InstagramFeed 
                posts={posts}
                stories={stories}
                currentUser={currentUser}
                onLike={handleLike}
                onComment={handleComment}
                onShare={handleShare}
                onReport={handleReport}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
              />
            </div>
            
            {/* Sidebar */}
            <div className="hidden lg:block lg:w-80 lg:ml-8">
              <InstagramSidebar 
                currentUser={currentUser}
                suggestions={suggestions}
                onLogout={signOut}
              />
            </div>
          </div>
        );
      
      case "profile":
        return (
          <UserProfile 
            user={currentUser}
            onAuthRequired={() => setAuthModalOpen(true)}
          />
        );
      
      case "settings":
        return <SettingsPage />;
      
      case "admin":
        return currentUser?.isAdmin ? <AdminPanel /> : <div>Access denied</div>;
      
      default:
        return (
          <div className="flex flex-col lg:flex-row">
            <div className="flex-1 max-w-2xl mx-auto">
              <InstagramFeed 
                posts={posts}
                stories={stories}
                currentUser={currentUser}
                onLike={handleLike}
                onComment={handleComment}
                onShare={handleShare}
                onReport={handleReport}
                onEdit={handleEditPost}
                onDelete={handleDeletePost}
              />
            </div>
            
            <div className="hidden lg:block lg:w-80 lg:ml-8">
              <InstagramSidebar 
                currentUser={currentUser}
                suggestions={suggestions}
                onLogout={signOut}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <InstagramHeader 
        currentUser={currentUser}
        onAuthClick={() => setAuthModalOpen(true)}
        onMenuClick={() => setMobileMenuOpen(true)}
      />
      
      {/* Mobile Layout */}
      <div className="block lg:hidden">
        {renderContent()}
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block pt-16">
        <div className="max-w-6xl mx-auto px-4">
          {renderContent()}
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed left-0 top-0 h-full w-72 bg-white shadow-lg">
            <InstagramSidebar 
              currentUser={currentUser}
              suggestions={suggestions}
              onLogout={signOut}
              mobile={true}
            />
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal 
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
      />
    </div>
  );
};

export default Index;

import { useState } from "react";
import { InstagramHeader } from "@/components/InstagramHeader";
import { RMAFeed } from "@/components/InstagramFeed";
import { RMASidebar } from "@/components/InstagramSidebar";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/Sidebar";
import { CreatePost } from "@/components/CreatePost";

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
      author: currentUser || { name: "User", avatar: "/placeholder.svg", username: "user" },
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

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.isLiked ? post.likes - 1 : post.likes + 1, isLiked: !post.isLiked }
        : post
    ));
  };

  const handleComment = (postId: string) => {
    console.log('Comment on post:', postId);
  };

  const handleShare = (postId: string) => {
    console.log('Share post:', postId);
  };

  const handleReport = (postId: string) => {
    alert('Postimi u raportua!');
  };

  const handleEditPost = (postId: string) => {
    console.log('Edit post:', postId);
  };

  const handleDeletePost = (postId: string) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return (
          <div className="space-y-6">
            {/* Hero Banner */}
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-2xl">👑</span>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold">RMA Shqip</h1>
                    <p className="text-lg opacity-90">Komuniteti shqiptar i Real Madrid</p>
                    <p className="text-sm opacity-75">• Hala Madrid! •</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">🦅</span>
                  </div>
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">⭐</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Create Post */}
            {currentUser && (
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <CreatePost 
                  user={currentUser} 
                  onSubmit={handleCreatePost}
                />
              </div>
            )}

            {/* Instagram Feed */}
            <RMAFeed 
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
        );
      
      case "profile":
        return (
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Profili Im</h2>
            {/* Profile content */}
          </div>
        );
      
      case "settings":
        return (
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Cilësimet</h2>
            {/* Settings content */}
          </div>
        );
      
      case "admin":
        return currentUser?.isAdmin ? (
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>
            {/* Admin content */}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          </div>
        );
      
      default:
        return (
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Seksion i panjohur</h2>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left - Logo */}
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-lg">👑</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">RMA Shqip</h1>
                <p className="text-sm text-gray-500">Madridista Community</p>
              </div>
            </div>

            {/* Center - Search */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Kërko postime, përdorues, ngjarje..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Right - User */}
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <Sidebar
            user={currentUser}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            onLogout={signOut}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {renderContent()}
          </div>
        </div>

        {/* Right Sidebar - Instagram Style */}
        <div className="hidden xl:block w-80 bg-white border-l border-gray-200 p-4">
          <RMASidebar 
            currentUser={currentUser}
            suggestions={suggestions}
            onLogout={signOut}
          />
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
            <Sidebar
              user={currentUser}
              activeSection={activeSection}
              onSectionChange={setActiveSection}
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

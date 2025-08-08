import { useState } from "react";
import { RMAFeed } from "@/components/InstagramFeed";
import { RMASidebar } from "@/components/InstagramSidebar";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { Sidebar } from "@/components/Sidebar";
import { CreatePost } from "@/components/CreatePost";
import { Bell, Search, User, Settings, LogOut, Crown, Trophy, Users, Calendar, Home, TrendingUp } from "lucide-react";

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
            {/* Professional Hero Banner */}
            <div className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 rounded-2xl p-8 text-white overflow-hidden">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="relative">
                      <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-2xl">
                        <Crown className="w-10 h-10 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-bold">R</span>
                      </div>
                    </div>
                    <div>
                      <h1 className="text-4xl font-bold mb-2">RMA Shqip</h1>
                      <p className="text-xl opacity-90 mb-1">Komuniteti shqiptar i Real Madrid</p>
                      <p className="text-sm opacity-75 font-medium">• Hala Madrid y Nada Más •</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center shadow-lg">
                        <Trophy className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-xs mt-2 opacity-90">14 UCL</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white text-lg font-bold">⚽</span>
                      </div>
                      <p className="text-xs mt-1 opacity-90">La Liga</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Create Post */}
            {currentUser && (
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
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
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Profili Im</h2>
            {/* Profile content */}
          </div>
        );
      
      case "settings":
        return (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Cilësimet</h2>
            {/* Settings content */}
          </div>
        );
      
      case "admin":
        return currentUser?.isAdmin ? (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Admin Panel</h2>
            {/* Admin content */}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Access Denied</h2>
          </div>
        );
      
      default:
        return (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-200">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">Seksion i panjohur</h2>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Professional Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left - Logo */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">R</span>
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">RMA Shqip</h1>
                <p className="text-sm text-gray-500 font-medium">Madridista Community</p>
              </div>
            </div>

            {/* Center - Search */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Kërko postime, përdorues, ngjarje..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-xl border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Right - User Actions */}
            <div className="flex items-center space-x-4">
              <button className="p-3 hover:bg-gray-100 rounded-xl transition-colors">
                <Bell className="h-6 w-6 text-gray-600" />
              </button>
              <button className="p-3 hover:bg-gray-100 rounded-xl transition-colors">
                <User className="h-6 w-6 text-gray-600" />
              </button>
              <button className="p-3 hover:bg-gray-100 rounded-xl transition-colors">
                <Settings className="h-6 w-6 text-gray-600" />
              </button>
              {currentUser && (
                <button 
                  onClick={signOut}
                  className="p-3 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <LogOut className="h-6 w-6 text-red-600" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen shadow-sm">
          <Sidebar
            user={currentUser}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            onLogout={signOut}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            {renderContent()}
          </div>
        </div>

        {/* Right Sidebar - Instagram Style */}
        <div className="hidden xl:block w-80 bg-white border-l border-gray-200 p-6 shadow-sm">
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

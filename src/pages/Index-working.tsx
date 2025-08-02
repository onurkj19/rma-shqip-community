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
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import heroImage from "@/assets/hero-banner.jpg";

// Mock data for demonstration
const mockUser = {
  name: "Ermal Hoxha",
  avatar: "/placeholder.svg",
  username: "ermali",
  isAdmin: false
};

const mockPosts = [
  {
    id: "1",
    author: {
      name: "Driton Krasniqi",
      avatar: "/placeholder.svg",
      username: "dritonk"
    },
    content: "Çfarë ndeshje fantastike nga Real Madrid sonte! Benzema ishte i shkëlqyer! 🤍⚽ #HalaMadrid #RealMadrid",
    timestamp: "2 orë më parë",
    likes: 45,
    comments: 12,
    shares: 8,
    isLiked: true
  },
  {
    id: "2", 
    author: {
      name: "Albana Murati",
      avatar: "/placeholder.svg",
      username: "albanam"
    },
    content: "Kur mendoj se Real Madrid ka fituar 14 Champions League... Pa dyshim klubi më i madh në botë! Hala Madrid y nada más! 👑",
    image: "/placeholder.svg",
    timestamp: "4 orë më parë",
    likes: 78,
    comments: 23,
    shares: 15,
    isLiked: false
  },
  {
    id: "3",
    author: {
      name: "Andi Rexhepi", 
      avatar: "/placeholder.svg",
      username: "andirex"
    },
    content: "Modric në moshën 38 vjeç akoma luan si 25-vjeçar! Legjendë e vërtetë e futbollit! 🐐⚪",
    timestamp: "1 ditë më parë", 
    likes: 92,
    comments: 31,
    shares: 19,
    isLiked: true
  }
];

const IndexWorking = () => {
  // Mock auth state instead of using useAuth
  const user = null; // Not logged in initially
  const userProfile = null;
  const loading = false;
  const signOut = () => console.log("Sign out");
  
  const [activeSection, setActiveSection] = useState("home");
  const [posts, setPosts] = useState(mockPosts);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleCreatePost = (content: string, media?: File) => {
    const newPost = {
      id: Date.now().toString(),
      author: mockUser,
      content,
      timestamp: "Tani",
      likes: 0,
      comments: 0,
      shares: 0,
      isLiked: false
    };
    setPosts([newPost, ...posts]);
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
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

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return (
          <div className="max-w-4xl mx-auto px-4 py-6">
            {/* Hero Section */}
            <div className="relative mb-8 rounded-2xl overflow-hidden">
              <img 
                src={heroImage} 
                alt="RMA Shqip Hero" 
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-hero/70 flex items-center justify-center">
                <div className="text-center text-white">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4">RMA Shqip</h1>
                  <p className="text-lg md:text-xl">Komuniteti shqiptar i Real Madrid</p>
                </div>
              </div>
            </div>

            <CreatePost user={mockUser} onSubmit={handleCreatePost} />
            
            <div className="space-y-6">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onLike={handleLike}
                  onComment={handleComment}
                  onShare={handleShare}
                  onReport={handleReport}
                />
              ))}
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
        return <UserProfile 
          user={mockUser} 
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
          onReport={handleReport}
          onAuthRequired={() => setAuthModalOpen(true)}
        />;
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
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Duke ngarkuar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-surface">
      <Header 
        user={user}
        onSignOut={signOut}
        onOpenAuth={() => setAuthModalOpen(true)}
      />
      
      <div className="flex">
        <Sidebar 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          user={user}
          isAdmin={userProfile?.role === 'admin'}
        />
        
        <main className="flex-1 min-h-screen">
          {renderContent()}
        </main>
      </div>

      {/* Mobile Menu */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-80">
          <Sidebar 
            activeSection={activeSection}
            onSectionChange={(section) => {
              setActiveSection(section);
              setMobileMenuOpen(false);
            }}
            user={user}
            isAdmin={userProfile?.role === 'admin'}
          />
        </SheetContent>
      </Sheet>

      {/* Auth Modal */}
      <AuthModal 
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
};

export default IndexWorking; 
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

const Index = () => {
  const { user, userProfile, loading, signOut } = useAuth();
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
        return (
          <UserProfile
            user={mockUser}
            onLike={handleLike}
            onComment={handleComment}
            onShare={handleShare}
            onReport={handleReport}
          />
        );
      case "settings":
        return <SettingsPage />;
      case "admin":
        return <AdminPanel />;
      default:
        return (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Seksion i panjohur</h2>
              <p className="text-muted-foreground">Kjo faqe nuk ekziston.</p>
            </div>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-surface flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Duke ngarkuar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-surface">
      <Header 
        user={userProfile ? {
          name: userProfile.full_name || userProfile.email,
          avatar: userProfile.avatar_url || "/placeholder.svg",
          username: userProfile.email.split('@')[0],
          isAdmin: userProfile.role === 'admin'
        } : null} 
        onMenuClick={() => setMobileMenuOpen(true)}
        onAuthClick={() => setAuthModalOpen(true)}
      />
      
      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar
        user={userProfile ? {
          name: userProfile.full_name || userProfile.email,
          avatar: userProfile.avatar_url || "/placeholder.svg",
          isAdmin: userProfile.role === 'admin'
        } : null}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            onLogout={signOut}
          />
        </div>

        {/* Mobile Sidebar */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="p-0 w-64">
            <Sidebar
            user={userProfile ? {
              name: userProfile.full_name || userProfile.email,
              avatar: userProfile.avatar_url || "/placeholder.svg",
              isAdmin: userProfile.role === 'admin'
            } : null}
              activeSection={activeSection}
              onSectionChange={(section) => {
                setActiveSection(section);
                setMobileMenuOpen(false);
              }}
              onLogout={signOut}
            />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          {renderContent()}
        </main>
      </div>

      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </div>
  );
};

export default Index;

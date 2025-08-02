import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, Search, Bell, Menu } from "lucide-react";

interface HeaderProps {
  user?: {
    name?: string;
    email?: string;
    avatar?: string;
    username?: string;
    isAdmin?: boolean;
  } | null;
  onMenuClick: () => void;
  onAuthClick?: () => void;
  onProfileClick?: () => void;
}

export const Header = ({ user, onMenuClick, onAuthClick, onProfileClick }: HeaderProps) => {
  // Kontrollo localStorage për avatar të ruajtur
  const savedAvatar = localStorage.getItem('user-avatar');
  const displayAvatar = savedAvatar || user?.avatar;
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden mr-2"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        {/* Logo and Title */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center shadow-md border-2 border-madrid-gold">
            <img 
              src="/Rma logo.png" 
              alt="Real Madrid Logo" 
              className="w-10 h-10 md:w-10 md:h-10 object-contain"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg md:text-xl font-bold bg-gradient-hero bg-clip-text text-transparent leading-tight">
              RMA Shqip
            </h1>
            <p className="text-xs text-muted-foreground font-medium hidden sm:block">
              Madridista Community
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex-1 flex justify-center px-4">
          <div className="relative max-w-md w-full hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Kërko postime, përdorues, ngjarje..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            />
          </div>
          <div className="relative w-full md:hidden">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Kërko..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2 md:space-x-3">
          {/* Notification Bell - Hidden on mobile */}
          <Button variant="ghost" size="icon" className="hidden sm:flex">
            <Bell className="h-5 w-5" />
          </Button>
          
          {user ? (
            <Button 
              variant="ghost" 
              size="icon" 
              className="p-0 h-8 w-8 rounded-full hover:bg-accent"
              onClick={() => {
                console.log("Profile clicked");
                onProfileClick?.();
              }}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={displayAvatar} />
                <AvatarFallback className="bg-gradient-primary text-white">
                  {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          ) : (
            <div className="flex items-center space-x-2">
              {/* Login/Register Buttons */}
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => {
                  console.log("Login button clicked");
                  onAuthClick?.();
                }}>
                  Hyr
                </Button>
                <Button variant="gold" size="sm" onClick={() => {
                  console.log("Register button clicked");
                  onAuthClick?.();
                }}>
                  Regjistrohu
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
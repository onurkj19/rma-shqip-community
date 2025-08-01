import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, Search, Bell, Menu } from "lucide-react";

interface HeaderProps {
  user?: {
    name: string;
    avatar?: string;
    username?: string;
    isAdmin?: boolean;
  };
  onMenuClick: () => void;
  onAuthClick?: () => void;
}

export const Header = ({ user, onMenuClick, onAuthClick }: HeaderProps) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden mr-2"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-hero rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">RM</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            RMA Shqip
          </h1>
        </div>

        <div className="flex-1 max-w-sm mx-4 hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              placeholder="Kërko..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-input bg-background rounded-md focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          
          {user ? (
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-gradient-primary text-white">
                {user.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
          ) : (
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={onAuthClick}>
                Hyr
              </Button>
              <Button variant="gold" size="sm" onClick={onAuthClick}>
                Regjistrohu
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
import { Search, Home, PlusSquare, Heart, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InstagramHeaderProps {
  currentUser?: {
    name: string;
    avatar?: string;
    username?: string;
  } | null;
  onAuthClick: () => void;
  onMenuClick: () => void;
}

export const InstagramHeader = ({ currentUser, onAuthClick, onMenuClick }: InstagramHeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900">Instagram</h1>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Kërko..."
                className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-4">
            {currentUser ? (
              <>
                <Button variant="ghost" size="sm" className="p-2">
                  <Home className="h-6 w-6" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <PlusSquare className="h-6 w-6" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <Heart className="h-6 w-6" />
                </Button>
                <Button variant="ghost" size="sm" className="p-2">
                  <User className="h-6 w-6" />
                </Button>
              </>
            ) : (
              <Button onClick={onAuthClick} variant="default" size="sm">
                Kyçu
              </Button>
            )}
            
            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 lg:hidden"
              onClick={onMenuClick}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}; 
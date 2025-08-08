import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { LogOut, Settings, User } from "lucide-react";

interface Suggestion {
  id: string;
  username: string;
  avatar: string;
  isFollowing: boolean;
}

interface InstagramSidebarProps {
  currentUser?: {
    name: string;
    avatar?: string;
    username?: string;
  } | null;
  suggestions: Suggestion[];
  onLogout: () => void;
  mobile?: boolean;
}

export const InstagramSidebar = ({ 
  currentUser, 
  suggestions, 
  onLogout, 
  mobile = false 
}: InstagramSidebarProps) => {
  return (
    <div className={`${mobile ? 'w-full' : 'w-80'} bg-white border-l border-gray-200 p-4`}>
      {/* User Profile */}
      {currentUser && (
        <div className="flex items-center space-x-3 mb-6">
          <Avatar className="h-12 w-12">
            <img 
              src={currentUser.avatar || "/placeholder.svg"} 
              alt={currentUser.name}
              className="h-12 w-12 rounded-full object-cover"
            />
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-semibold">{currentUser.username}</p>
            <p className="text-xs text-gray-500">{currentUser.name}</p>
          </div>
          <Button variant="ghost" size="sm" className="text-blue-500 font-semibold">
            Ndrysho
          </Button>
        </div>
      )}

      {/* Suggestions */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-500">Përdorues të tjerë</p>
          <Button variant="ghost" size="sm" className="text-xs font-semibold">
            Shiko të gjitha
          </Button>
        </div>
        
        <div className="space-y-3">
          {suggestions.map((suggestion) => (
            <div key={suggestion.id} className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <img 
                  src={suggestion.avatar} 
                  alt={suggestion.username}
                  className="h-8 w-8 rounded-full object-cover"
                />
              </Avatar>
              <div className="flex-1">
                <p className="text-sm font-semibold">{suggestion.username}</p>
                <p className="text-xs text-gray-500">Përdorues i ri</p>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`text-xs font-semibold ${suggestion.isFollowing ? 'text-gray-500' : 'text-blue-500'}`}
              >
                {suggestion.isFollowing ? 'Ndiqet' : 'Ndiq'}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Links */}
      <div className="text-xs text-gray-400 space-y-2">
        <div className="flex flex-wrap gap-2">
          <span>Rreth</span>
          <span>Ndihmë</span>
          <span>Presa</span>
          <span>API</span>
          <span>Punë</span>
          <span>Privatësia</span>
          <span>Kushtet</span>
          <span>Vendet</span>
          <span>Gjuha</span>
        </div>
        <p>© 2024 INSTAGRAM FROM META</p>
      </div>

      {/* Mobile Menu Actions */}
      {mobile && currentUser && (
        <div className="mt-6 space-y-2">
          <Button variant="ghost" className="w-full justify-start">
            <User className="h-4 w-4 mr-2" />
            Profili
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="h-4 w-4 mr-2" />
            Cilësimet
          </Button>
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-600"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Dil
          </Button>
        </div>
      )}
    </div>
  );
}; 
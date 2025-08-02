import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Home, 
  TrendingUp, 
  Users, 
  Calendar, 
  Trophy, 
  Settings, 
  User,
  LogOut,
  Shield
} from "lucide-react";

interface SidebarProps {
  user?: {
    name: string;
    avatar?: string;
    username?: string;
    isAdmin?: boolean;
  };
  activeSection: string;
  onSectionChange: (section: string) => void;
  onLogout?: () => void;
  mobile?: boolean; // If true, render for mobile/hamburger menu
}

export const Sidebar = ({ user, activeSection, onSectionChange, onLogout, mobile }: SidebarProps) => {
  // Only one menuItems declaration
  const menuItems = [
    { id: 'home', label: 'Ballina', icon: Home },
    { id: 'trending', label: 'Tendenca', icon: TrendingUp },
    { id: 'members', label: 'Anëtarët', icon: Users },
    { id: 'events', label: 'Ngjarjet', icon: Calendar },
    { id: 'matches', label: 'Ndeshjet', icon: Trophy },
    { id: 'profile', label: 'Profili Im', icon: User },
    { id: 'settings', label: 'Cilësimet', icon: Settings },
  ];

  // Responsive: show sidebar only on desktop, vertical menu on mobile/hamburger
  return (
    <aside className={
      mobile
        ? "w-full bg-gradient-surface h-screen flex flex-col"
        : "hidden lg:flex w-64 bg-gradient-surface border-r h-screen flex-col"
    }>
      {/* Navigation Menu */}
      {mobile ? (
        <div className="flex-1 px-3 pt-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "secondary" : "ghost"}
              className="w-full justify-start text-base"
              onClick={() => onSectionChange(item.id)}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.label}
            </Button>
          ))}
          {user?.isAdmin && (
            <Button
              variant={activeSection === 'admin' ? "secondary" : "ghost"}
              className="w-full justify-start text-accent text-base"
              onClick={() => onSectionChange('admin')}
            >
              <Shield className="h-5 w-5 mr-3" />
              Admin Panel
            </Button>
          )}
        </div>
      ) : (
        <ScrollArea className="flex-1 px-3 pt-6">
          <div className="space-y-1 md:space-y-2">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "secondary" : "ghost"}
                className="w-full justify-start text-sm md:text-base"
                onClick={() => onSectionChange(item.id)}
              >
                <item.icon className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3" />
                {item.label}
              </Button>
            ))}
            {user?.isAdmin && (
              <Button
                variant={activeSection === 'admin' ? "secondary" : "ghost"}
                className="w-full justify-start text-accent text-sm md:text-base"
                onClick={() => onSectionChange('admin')}
              >
                <Shield className="h-4 w-4 md:h-5 md:w-5 mr-2 md:mr-3" />
                Admin Panel
              </Button>
            )}
          </div>
        </ScrollArea>
      )}

      {/* User Profile Section */}
      {user && (
        <div className="p-3 md:p-4 border-t">
          <div className="flex items-center space-x-2 md:space-x-3 mb-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {user.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground">Anëtar aktiv</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-start text-destructive hover:text-destructive text-sm"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Dil
          </Button>
        </div>
      )}
    </aside>
  );
}
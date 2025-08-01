import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
}

export const Sidebar = ({ user, activeSection, onSectionChange, onLogout }: SidebarProps) => {
  const menuItems = [
    { id: 'home', label: 'Ballina', icon: Home },
    { id: 'trending', label: 'Tendenca', icon: TrendingUp },
    { id: 'members', label: 'Anëtarët', icon: Users },
    { id: 'events', label: 'Ngjarjet', icon: Calendar },
    { id: 'matches', label: 'Ndeshjet', icon: Trophy },
  ];

  const userMenuItems = [
    { id: 'profile', label: 'Profili Im', icon: User },
    { id: 'settings', label: 'Cilësimet', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-gradient-surface border-r h-screen flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-hero rounded-full flex items-center justify-center">
            <span className="text-white font-bold">RM</span>
          </div>
          <div>
            <h2 className="text-lg font-bold bg-gradient-hero bg-clip-text text-transparent">
              RMA Shqip
            </h2>
            <p className="text-xs text-muted-foreground">Madridista Community</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-3">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Button
              key={item.id}
              variant={activeSection === item.id ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => onSectionChange(item.id)}
            >
              <item.icon className="h-4 w-4 mr-3" />
              {item.label}
            </Button>
          ))}
        </div>

        <Separator className="my-4" />

        {user && (
          <div className="space-y-2">
            <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Llogaria
            </p>
            {userMenuItems.map((item) => (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => onSectionChange(item.id)}
              >
                <item.icon className="h-4 w-4 mr-3" />
                {item.label}
              </Button>
            ))}

            {user.isAdmin && (
              <Button
                variant={activeSection === 'admin' ? "secondary" : "ghost"}
                className="w-full justify-start text-accent"
                onClick={() => onSectionChange('admin')}
              >
                <Shield className="h-4 w-4 mr-3" />
                Admin Panel
              </Button>
            )}
          </div>
        )}
      </ScrollArea>

      {user && (
        <div className="p-4 border-t">
          <div className="flex items-center space-x-3 mb-3">
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
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Dil
          </Button>
        </div>
      )}
    </aside>
  );
};
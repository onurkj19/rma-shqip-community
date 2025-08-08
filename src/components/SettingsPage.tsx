import { useState, useEffect } from "react";
import { Settings, Bell, Lock, Palette, Globe, Shield, Save, Trash2, Download } from "lucide-react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export const SettingsPage = () => {
  const { user, userProfile, signOut } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      newPosts: true,
      comments: true,
      likes: false,
      matches: true
    },
    privacy: {
      profilePublic: true,
      showEmail: false
    },
    appearance: {
      theme: 'light',
      language: 'sq'
    }
  });

  // Load settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('user-settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  // Save settings to localStorage
  const saveSettings = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem('user-settings', JSON.stringify(settings));
      
      // Apply theme
      if (settings.appearance.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      toast({
        title: "Cilësimet u ruajtën",
        description: "Ndryshimet u aplikuan me sukses"
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Gabim",
        description: "Nuk u ruajtën cilësimet"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleThemeChange = (theme: string) => {
    setSettings(prev => ({
      ...prev,
      appearance: { ...prev.appearance, theme }
    }));
  };

  const handleLanguageChange = (language: string) => {
    setSettings(prev => ({
      ...prev,
      appearance: { ...prev.appearance, language }
    }));
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: { ...prev.notifications, [key]: value }
    }));
  };

  const handlePrivacyChange = (key: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      privacy: { ...prev.privacy, [key]: value }
    }));
  };

  const handleChangePassword = () => {
    // TODO: Implement password change
    toast({
      title: "Ndryshimi i fjalëkalimit",
      description: "Funksionaliteti do të shtohet së shpejti"
    });
  };

  const handleDownloadData = () => {
    const userData = {
      user: user,
      userProfile: userProfile,
      settings: settings,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(userData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rma-shqip-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Të dhënat u shkarkuan",
      description: "Skedari u ruajt në kompjuterin tuaj"
    });
  };

  const handleDeleteAccount = () => {
    if (confirm('A jeni të sigurt që dëshironi të fshini llogarinë? Kjo veprim nuk mund të kthehet mbrapsht.')) {
      // TODO: Implement account deletion
      toast({
        title: "Fshirja e llogarisë",
        description: "Funksionaliteti do të shtohet së shpejti"
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Settings className="h-6 w-6 text-primary" />
          <h1 className="text-2xl font-bold">Cilësimet</h1>
        </div>
        <Button onClick={saveSettings} disabled={isSaving}>
          <Save className="h-4 w-4 mr-2" />
          {isSaving ? 'Duke ruajtur...' : 'Ruaj'}
        </Button>
      </div>

      <div className="space-y-6">
        {/* Notifications */}
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Njoftimet</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="new-posts">Postime të reja</Label>
                <p className="text-sm text-muted-foreground">Merr njoftim për postime të reja</p>
              </div>
              <Switch 
                id="new-posts" 
                checked={settings.notifications.newPosts}
                onCheckedChange={(checked) => handleNotificationChange('newPosts', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="comments">Komente</Label>
                <p className="text-sm text-muted-foreground">Njoftim për komente në postimet tuaja</p>
              </div>
              <Switch 
                id="comments" 
                checked={settings.notifications.comments}
                onCheckedChange={(checked) => handleNotificationChange('comments', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="likes">Pëlqime</Label>
                <p className="text-sm text-muted-foreground">Njoftim kur dikush pëlqen postimin tuaj</p>
              </div>
              <Switch 
                id="likes" 
                checked={settings.notifications.likes}
                onCheckedChange={(checked) => handleNotificationChange('likes', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="matches">Ndeshje</Label>
                <p className="text-sm text-muted-foreground">Njoftim para ndeshjes së Real Madrid</p>
              </div>
              <Switch 
                id="matches" 
                checked={settings.notifications.matches}
                onCheckedChange={(checked) => handleNotificationChange('matches', checked)}
              />
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Privatësia</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="profile-public">Profil publik</Label>
                <p className="text-sm text-muted-foreground">A mund ta shohin të tjerët profilin tuaj</p>
              </div>
              <Switch 
                id="profile-public" 
                checked={settings.privacy.profilePublic}
                onCheckedChange={(checked) => handlePrivacyChange('profilePublic', checked)}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="show-email">Shfaq email</Label>
                <p className="text-sm text-muted-foreground">Shfaq adresën email në profil</p>
              </div>
              <Switch 
                id="show-email" 
                checked={settings.privacy.showEmail}
                onCheckedChange={(checked) => handlePrivacyChange('showEmail', checked)}
              />
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Pamja</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="theme">Tema</Label>
              <Select value={settings.appearance.theme} onValueChange={handleThemeChange}>
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder="Zgjidhni temën" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">E çelë</SelectItem>
                  <SelectItem value="dark">E errët</SelectItem>
                  <SelectItem value="system">Sistemi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="language">Gjuha</Label>
              <Select value={settings.appearance.language} onValueChange={handleLanguageChange}>
                <SelectTrigger className="w-full mt-2">
                  <SelectValue placeholder="Zgjidhni gjuhën" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sq">Shqip</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Account */}
        <div className="bg-card border rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Llogaria</h2>
          </div>
          
          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-start" onClick={handleChangePassword}>
              Ndrysho fjalëkalimin
            </Button>
            
            <Button variant="outline" className="w-full justify-start" onClick={handleDownloadData}>
              <Download className="h-4 w-4 mr-2" />
              Shkarko të dhënat e mia
            </Button>
            
            <Button variant="destructive" className="w-full justify-start" onClick={handleDeleteAccount}>
              <Trash2 className="h-4 w-4 mr-2" />
              Fshij llogarinë
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
import { Settings, Bell, Lock, Palette, Globe, Shield } from "lucide-react";
import { Button } from "./ui/button";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export const SettingsPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Cilësimet</h1>
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
              <Switch id="new-posts" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="comments">Komente</Label>
                <p className="text-sm text-muted-foreground">Njoftim për komente në postimet tuaja</p>
              </div>
              <Switch id="comments" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="likes">Pëlqime</Label>
                <p className="text-sm text-muted-foreground">Njoftim kur dikush pëlqen postimin tuaj</p>
              </div>
              <Switch id="likes" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="matches">Ndeshje</Label>
                <p className="text-sm text-muted-foreground">Njoftim para ndeshjes së Real Madrid</p>
              </div>
              <Switch id="matches" defaultChecked />
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
              <Switch id="profile-public" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="show-email">Shfaq email</Label>
                <p className="text-sm text-muted-foreground">Shfaq adresën email në profil</p>
              </div>
              <Switch id="show-email" />
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
              <Select defaultValue="light">
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
              <Select defaultValue="sq">
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
            <Button variant="outline" className="w-full justify-start">
              Ndrysho fjalëkalimin
            </Button>
            
            <Button variant="outline" className="w-full justify-start">
              Shkarko të dhënat e mia
            </Button>
            
            <Button variant="destructive" className="w-full justify-start">
              Fshij llogarinë
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
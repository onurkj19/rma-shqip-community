import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase, UserProfile, UserRole } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Shield, Ban, Crown, Users, AlertTriangle } from 'lucide-react';

export const AdminPanel = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        variant: "destructive",
        title: "Gabim",
        description: "Nuk u arritën të ngarkohen përdoruesit"
      });
    } finally {
      setLoading(false);
    }
  };

  const banUser = async (userId: string, shouldBan: boolean) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_banned: shouldBan })
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.map(user => 
        user.id === userId ? { ...user, is_banned: shouldBan } : user
      ));

      toast({
        title: shouldBan ? "Përdoruesi u përjashtua" : "Përjashtimi u hoq",
        description: shouldBan ? "Përdoruesi nuk mund të postojë më" : "Përdoruesi mund të postojë përsëri"
      });
    } catch (error) {
      console.error('Error banning user:', error);
      toast({
        variant: "destructive",
        title: "Gabim",
        description: "Nuk u arrit të ndryshohet statusi i përdoruesit"
      });
    }
  };

  const changeUserRole = async (userId: string, newRole: UserRole) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));

      toast({
        title: "Roli u ndryshua",
        description: `Përdoruesi tani është ${newRole}`
      });
    } catch (error) {
      console.error('Error changing user role:', error);
      toast({
        variant: "destructive",
        title: "Gabim",
        description: "Nuk u arrit të ndryshohet roli i përdoruesit"
      });
    }
  };

  if (!isAdmin()) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Qasje e kufizuar</h2>
              <p className="text-muted-foreground">
                Nuk keni autorizim për të hyrë në panelin e administratorit.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Users className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Duke ngarkuar përdoruesit...</p>
          </div>
        </div>
      </div>
    );
  }

  const getRoleBadgeVariant = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'destructive';
      case 'moderator':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-4 w-4" />;
      case 'moderator':
        return <Shield className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Paneli i Administratorit</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Menaxhimi i Përdoruesve</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className={`flex items-center justify-between p-4 border rounded-lg ${
                  user.is_banned ? 'bg-destructive/10 border-destructive/20' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar_url} alt={user.full_name} />
                    <AvatarFallback>
                      {user.full_name?.charAt(0) || user.email.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{user.full_name || user.email}</h3>
                      {getRoleIcon(user.role)}
                      {user.is_banned && (
                        <Ban className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {user.role}
                      </Badge>
                      {user.is_banned && (
                        <Badge variant="destructive">
                          I përjashtuar
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Select
                    value={user.role}
                    onValueChange={(value: UserRole) => changeUserRole(user.id, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="moderator">Moderator</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant={user.is_banned ? "outline" : "destructive"}
                        size="sm"
                      >
                        {user.is_banned ? "Hiq banin" : "Ban"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {user.is_banned ? "Hiq banin" : "Përjashtoje përdoruesin"}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          {user.is_banned
                            ? "A jeni të sigurt që doni ta lejoni përsëri këtë përdorues?"
                            : "A jeni të sigurt që doni ta përjashtoni këtë përdorues? Ai nuk do të mund të postojë më."
                          }
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Anullo</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => banUser(user.id, !user.is_banned)}
                        >
                          {user.is_banned ? "Hiq banin" : "Përjashtoje"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
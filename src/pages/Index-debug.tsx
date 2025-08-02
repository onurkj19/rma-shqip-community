import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { checkSessionPersistence } from '@/lib/supabase';

const IndexDebug = () => {
  const { user, userProfile, session, loading, signOut, signInWithEmail } = useAuth();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [sessionPersistence, setSessionPersistence] = React.useState(false);

  React.useEffect(() => {
    setSessionPersistence(checkSessionPersistence());
  }, [user]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await signInWithEmail(email, password);
  };
  
  return (
    <div className="min-h-screen bg-gradient-surface p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center mb-8">Authentication Debug</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Authentication State</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <strong>Loading:</strong> {loading ? 'Yes' : 'No'}
            </div>
            <div>
              <strong>User:</strong> {user ? 'Logged in' : 'Not logged in'}
            </div>
            <div>
              <strong>User ID:</strong> {user?.id || 'N/A'}
            </div>
            <div>
              <strong>User Email:</strong> {user?.email || 'N/A'}
            </div>
            <div>
              <strong>Session:</strong> {session ? 'Active' : 'No session'}
            </div>
            <div>
              <strong>User Profile:</strong> {userProfile ? 'Loaded' : 'Not loaded'}
            </div>
            <div>
              <strong>Profile Name:</strong> {userProfile?.full_name || 'N/A'}
            </div>
            <div>
              <strong>Profile Role:</strong> {userProfile?.role || 'N/A'}
            </div>
            <div>
              <strong>Session Persistence:</strong> {sessionPersistence ? 'Working' : 'Not working'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Session Details</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify({ user, session, userProfile }, null, 2)}
            </pre>
          </CardContent>
        </Card>

        {!user ? (
          <Card>
            <CardHeader>
              <CardTitle>Test Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email:</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Password:</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
        </div>
                <Button type="submit">Test Login</Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={signOut} variant="destructive">
                Sign Out
              </Button>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Local Storage Check</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <strong>supabase.auth.token:</strong> {localStorage.getItem('sb-mgimmfdoiehoabpkdygx-auth-token') ? 'Present' : 'Not found'}
              </div>
              <div>
                <strong>All localStorage keys:</strong>
                <ul className="mt-2 ml-4">
                  {Object.keys(localStorage).map(key => (
                    <li key={key} className="text-sm">{key}</li>
                  ))}
                </ul>
        </div>
        </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IndexDebug; 
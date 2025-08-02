import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import React from 'react';


interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AuthModal = ({ open, onOpenChange }: AuthModalProps) => {
  console.log("AuthModal rendered, open:", open);
  console.log("AuthModal props:", { open, onOpenChange });
  const { signInWithEmail, signUpWithEmail, user, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  // Close modal when user is authenticated
  React.useEffect(() => {
    if (user && !loading) {
      console.log('User authenticated, closing modal');
      onOpenChange(false);
    }
  }, [user, loading, onOpenChange]);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('AuthModal: handleEmailSignIn called'); // Added for debugging
    console.log('AuthModal: email:', email, 'password length:', password.length); // Added for debugging
    
    // Add loading state
    const submitButton = e.currentTarget.querySelector('button[type="submit"]') as HTMLButtonElement;
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Duke kyçur...';
    
    try {
      await signInWithEmail(email, password);
      console.log('AuthModal: signInWithEmail completed'); // Added for debugging
      
      // Add success animation
      submitButton.textContent = '✓ U kyç!';
      submitButton.className = 'w-full bg-green-500 hover:bg-green-600 text-white';
      
      // Close modal after animation
      setTimeout(() => {
        onOpenChange(false);
        console.log('AuthModal: modal closed'); // Added for debugging
      }, 1000);
    } catch (error) {
      console.error('AuthModal: signIn error:', error);
      submitButton.disabled = false;
      submitButton.textContent = originalText;
      submitButton.className = 'w-full';
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('AuthModal: handleEmailSignUp called');
    
    // Add loading state
    const submitButton = e.currentTarget.querySelector('button[type="submit"]') as HTMLButtonElement;
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Duke regjistruar...';
    
    try {
      await signUpWithEmail(email, password, fullName);
      console.log('AuthModal: signUpWithEmail completed');
      
      // Add success animation
      submitButton.textContent = '✓ U regjistrua!';
      submitButton.className = 'w-full bg-green-500 hover:bg-green-600 text-white';
      
      // Close modal after animation
      setTimeout(() => {
        onOpenChange(false);
      }, 1000);
    } catch (error) {
      console.error('AuthModal: signUp error:', error);
      submitButton.disabled = false;
      submitButton.textContent = originalText;
      submitButton.className = 'w-full';
    }
  };



           return (
           <Dialog open={open} onOpenChange={onOpenChange}>
             <DialogContent className="sm:max-w-md animate-in slide-in-from-bottom-4 duration-300">
        <DialogHeader>
          <DialogTitle>Kyçuni ose Regjistrohuni</DialogTitle>
          <DialogDescription>
            Kyçuni në llogarinë tuaj ose krijoni një llogari të re
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">

          {/* Email/Password Forms */}
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Kyçu</TabsTrigger>
              <TabsTrigger value="signup">Regjistrohu</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Fjalëkalimi</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Kyçu
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleEmailSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Emri i plotë</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Fjalëkalimi</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Regjistrohu
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
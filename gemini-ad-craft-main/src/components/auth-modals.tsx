import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Mail, Lock, User, Chrome } from "lucide-react"

interface AuthModalsProps {
  isSignInOpen: boolean
  setIsSignInOpen: (open: boolean) => void
  isSignUpOpen: boolean
  setIsSignUpOpen: (open: boolean) => void
}

export function AuthModals({ 
  isSignInOpen, 
  setIsSignInOpen, 
  isSignUpOpen, 
  setIsSignUpOpen 
}: AuthModalsProps) {
  const [signInData, setSignInData] = useState({ email: "", password: "" })
  const [signUpData, setSignUpData] = useState({ name: "", email: "", password: "" })

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock sign in
    console.log("Sign in:", signInData)
    setIsSignInOpen(false)
  }

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock sign up
    console.log("Sign up:", signUpData)
    setIsSignUpOpen(false)
  }

  return (
    <>
      {/* Sign In Modal */}
      <Dialog open={isSignInOpen} onOpenChange={setIsSignInOpen}>
        <DialogContent className="sm:max-w-md glass">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">Welcome Back</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signin-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10 glass-input"
                  value={signInData.email}
                  onChange={(e) => setSignInData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signin-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="signin-password"
                  type="password"
                  placeholder="Enter your password"
                  className="pl-10 glass-input"
                  value={signInData.password}
                  onChange={(e) => setSignInData(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full btn-premium">
              Sign In
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <button
                type="button"
                className="underline hover:text-primary"
                onClick={() => {
                  setIsSignInOpen(false)
                  setIsSignUpOpen(true)
                }}
              >
                Don't have an account? Sign up
              </button>
            </div>

            <Separator />

            <Button
              type="button"
              variant="outline"
              className="w-full glass"
              onClick={() => console.log("Google sign in")}
            >
              <Chrome className="w-4 h-4 mr-2" />
              Continue with Google
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Sign Up Modal */}
      <Dialog open={isSignUpOpen} onOpenChange={setIsSignUpOpen}>
        <DialogContent className="sm:max-w-md glass">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold">Create Account</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSignUp} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="signup-name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="signup-name"
                  type="text"
                  placeholder="Enter your full name"
                  className="pl-10 glass-input"
                  value={signUpData.name}
                  onChange={(e) => setSignUpData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="Enter your email"
                  className="pl-10 glass-input"
                  value={signUpData.email}
                  onChange={(e) => setSignUpData(prev => ({ ...prev, email: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="signup-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Create a password"
                  className="pl-10 glass-input"
                  value={signUpData.password}
                  onChange={(e) => setSignUpData(prev => ({ ...prev, password: e.target.value }))}
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full btn-premium">
              Create Account
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              <button
                type="button"
                className="underline hover:text-primary"
                onClick={() => {
                  setIsSignUpOpen(false)
                  setIsSignInOpen(true)
                }}
              >
                Already have an account? Sign in
              </button>
            </div>

            <Separator />

            <Button
              type="button"
              variant="outline"
              className="w-full glass"
              onClick={() => console.log("Google sign up")}
            >
              <Chrome className="w-4 h-4 mr-2" />
              Continue with Google
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
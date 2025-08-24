// src/components/SignInDialog.tsx
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store"
import { selectAuth, logout, login, register, forgotPasswordAction, resetPasswordAction } from "@/features/auth/authSlice"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "./ui/dialog"
import {
  Tabs, TabsList, TabsTrigger, TabsContent
} from "./ui/tabs"
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card"
import { Button } from "./ui/Button"
import { Label } from "./ui/label"
import { Input } from "./ui/input"

export default function SignInDialog() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setName] = useState("")
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>()
  const auth = useSelector(selectAuth)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await dispatch(login({ email, password }))
      setOpen(false)
    } catch (err) {
      console.error(err)
      alert("Login failed")
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await dispatch(register({ username, email, password }))
      setOpen(false)
    } catch (err) {
      console.error(err)
      alert("Signup failed")
    }
  }
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await dispatch(forgotPasswordAction({ email: forgotEmail })).unwrap()
      alert("Password reset email sent. Check your inbox.")
      setForgotPasswordOpen(false)
      setResetPasswordOpen(true) // open reset dialog after sending email
    } catch (err: any) {
      alert(err || "Failed to send reset email")
    }
  }
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = window.location.search.split("token=")[1] || "" // or from API if you store it
    try {
      await dispatch(resetPasswordAction({ token, newPassword })).unwrap()
      alert("Password reset successful. Please log in.")
      setResetPasswordOpen(false)
    } catch (err: any) {
      alert(err || "Failed to reset password")
    }
  }
  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            {auth.user ? "Account" : "Sign In"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              {auth.user ? "Welcome Back" : "Sign in or Register"}
            </DialogTitle>
          </DialogHeader>

          {!auth.user ? (
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <Card>
                  <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input value={email} onChange={e => setEmail(e.target.value)} type="email" required />
                      </div>
                      <div className="space-y-2">
                        <Label>Password</Label>
                        <Input value={password} onChange={e => setPassword(e.target.value)} type="password" required />
                      </div>
                      <div className="flex items-center justify-between">
                        <button
                          type="button"
                          className="text-sm text-blue-600 hover:underline"
                          onClick={() => setForgotPasswordOpen(true)}
                        >
                          Forgot password?
                        </button>
                        <button
                          type="button"
                          className="text-sm text-gray-500 hover:underline"
                          onClick={() => {setResetPasswordOpen(true)
                          }}
                        >
                          Reset
                        </button>
                      </div>
                      <Button type="submit" className="w-full">Login</Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="signup">
                <Card>
                  <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input value={username} onChange={e => setName(e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input value={email} onChange={e => setEmail(e.target.value)} type="email" required />
                      </div>
                      <div className="space-y-2">
                        <Label>Password</Label>
                        <Input value={password} onChange={e => setPassword(e.target.value)} type="password" required />
                      </div>
                      <Button type="submit" className="w-full">Register</Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center space-y-4">
              <p>Welcome {auth.user.username}</p>
              <Button onClick={() => dispatch(logout())} >Logout</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Forgot Password Dialog */}
      <Dialog open={forgotPasswordOpen} onOpenChange={setForgotPasswordOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Reset Your Password</DialogTitle>
            <DialogDescription>
              Enter your email to receive a password reset link.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleForgotPassword} className="space-y-4 bg-background">
            <div className="space-y-2">
              <Label htmlFor="forgot-email">Email</Label>
              <Input
                id="forgot-email"
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                Send Reset Link
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={resetPasswordOpen} onOpenChange={setResetPasswordOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Set New Password</DialogTitle>
            <DialogDescription>
              Enter your new password below to reset your account password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleResetPassword} className="space-y-4 bg-background">
            <div className="space-y-2">
              <Label htmlFor="reset-password">New Password</Label>
              <Input
                id="reset-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                Reset Password
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

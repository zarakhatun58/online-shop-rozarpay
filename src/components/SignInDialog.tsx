// src/components/SignInDialog.tsx
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/store"
import { Eye, EyeOff } from "lucide-react"
import { selectAuth, logout, login, register, forgotPasswordAction, resetPasswordAction, verifyOtpAction } from "@/features/auth/authSlice"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "./ui/dialog"
import {
  Tabs, TabsList, TabsTrigger, TabsContent
} from "./ui/tabs"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/Button"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import { useSocket } from "@/lib/SocketProvider"
import { API_URL } from "@/lib/api"
import { useNavigate } from "react-router-dom"
import { clearCart } from "@/features/cart/cartSlice"


export default function SignInDialog() {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showRegPassword, setShowRegPassword] = useState(false)

  const [username, setName] = useState("")
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetPasswordOpen, setResetPasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const dispatch = useDispatch<AppDispatch>()
  const auth = useSelector(selectAuth)
  const [loginErrors, setLoginErrors] = useState<{ email?: string; password?: string }>({})
  const [registerErrors, setRegisterErrors] = useState<{ username?: string; email?: string; password?: string }>({})

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const { connectSocket } = useSocket();
  const navigate = useNavigate()


const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  const errors: typeof loginErrors = {};
  if (!email) errors.email = "Email is required";
  if (!password) errors.password = "Password is required";
  setLoginErrors(errors);
  if (Object.keys(errors).length > 0) return;

  try {
    console.log("🔍 Dispatching login thunk...");
    const result = await dispatch(login({ email, password })).unwrap();
    console.log("✅ Login thunk result:", result);

    const { user, token } = result;
    if (!user?._id) throw new Error("User ID missing");

    console.log("💾 Saving token & user to localStorage...");
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    const userId = user._id;
    console.log("🔌 Connecting socket for user:", userId);
    await new Promise<void>((resolve) => connectSocket(userId, () => resolve()));

    console.log("📨 Sending login notification...");
    await fetch(`${API_URL}/api/notification/notify-now`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        title: "Login Successful",
        message: `Welcome back, ${user.username || user.email}!`,
        type: "login",
      }),
    });

    console.log("🎉 Login complete, clearing cart & redirecting...");
    alert("✅ Login successful! 🎉");
    dispatch(clearCart());
    setOpen(false);
    navigate(user.role === "admin" ? "/dashboard" : "/");
  } catch (err: any) {
    console.error("Login error:", err);
    setLoginErrors({ password: err?.message || "Invalid credentials" });
  }
};


const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();

  const errors: typeof registerErrors = {};
  if (!username) errors.username = "Username is required";
  if (!email) errors.email = "Email is required";
  if (!password) errors.password = "Password is required";

  setRegisterErrors(errors);
  if (Object.keys(errors).length > 0) return;

  try {
    console.log("🔍 Dispatching register thunk...");
    const result = await dispatch(register({ username, email, password })).unwrap();
    console.log("✅ Register thunk result:", result);

    const { user, token } = result;
    if (!user?._id) throw new Error("User ID missing after signup");

    console.log("💾 Saving token & user to localStorage...");
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    console.log("🎉 Signup complete, clearing cart & connecting socket...");
    alert("Signup successful! 🎉");
    dispatch(clearCart());

    const userId = user._id;
    console.log("🔌 Connecting socket for user:", userId);
    connectSocket(userId);

    setOpen(false);
  } catch (err: any) {
    console.error("Register error:", err);
    setRegisterErrors({ email: err?.message || "Signup failed, try another email" });
  }
};


  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(forgotPasswordAction({ email })).unwrap();
      alert("OTP sent to your email. Enter OTP to continue.");
      setOtpSent(true);
    } catch (err: any) {
      alert(err || "Failed to send OTP");
    }
  };

  const handleVerifyOtp = async (): Promise<boolean> => {
    try {
      await dispatch(verifyOtpAction({ email, otp })).unwrap()
      alert("OTP verified successfully. You can now reset your password.")
      return true
    } catch (err: any) {
      alert(err || "Invalid OTP. Please try again.")
      return false
    }
  }


  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await dispatch(resetPasswordAction({ email, newPassword })).unwrap();
      alert("Password reset successful. Please log in.");
      setOtpSent(false);
      setOtpVerified(false);
      setResetPasswordOpen(false);
      setNewPassword("")
    } catch (err: any) {
      alert(err || "Failed to reset password");
    }
  };
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
                        {loginErrors.email && <p className="text-red-500 text-sm mt-1">{loginErrors.email}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>Password</Label>
                        <div className="relative w-full">
                          <Input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} required className={`w-full border rounded px-3 py-2 pr-10 ${loginErrors.password ? "border-red-500" : ""
                            }`} />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        {loginErrors.password && <p className="text-red-500 text-sm mt-1">{loginErrors.password}</p>}
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
                          onClick={() => {
                            setResetPasswordOpen(true)
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
                        {registerErrors.username && <p className="text-red-500 text-sm mt-1">{registerErrors.username}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <Input value={email} onChange={e => setEmail(e.target.value)} type="email" required />
                        {registerErrors.email && <p className="text-red-500 text-sm mt-1">{registerErrors.email}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label>Password</Label>
                        <div className="relative w-full">
                          <Input value={password} onChange={e => setPassword(e.target.value)} type={showRegPassword ? "text" : "password"} required className={`w-full border rounded px-3 py-2 pr-10 ${registerErrors.password ? "border-red-500" : ""
                            }`} />  <button
                              type="button"
                              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                              onClick={() => setShowRegPassword(!showRegPassword)}
                            >
                            {showRegPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        {registerErrors.password && <p className="text-red-500 text-sm mt-1">{registerErrors.password}</p>}
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
              {otpSent && !otpVerified
                ? "Enter the OTP sent to your email."
                : "Enter your email number to receive an OTP."}
            </DialogDescription>
          </DialogHeader>

          {/* Step 1: Enter email */}
          {!otpSent && (
            <form onSubmit={handleForgotPassword} className="space-y-4 bg-background">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full">
                  Send OTP
                </Button>
              </DialogFooter>
            </form>
          )}

          {/* Step 2: Verify OTP */}
          {otpSent && !otpVerified && (
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                const success = await handleVerifyOtp() // ✅ call your verify function
                if (success) {
                  setOtpVerified(true)
                  setForgotPasswordOpen(false) // close current
                  setResetPasswordOpen(true)   // open reset password dialog
                }
              }}
              className="space-y-4 bg-background"
            >
              <div className="space-y-2">
                <Label htmlFor="otp">Enter OTP</Label>
                <Input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <DialogFooter>
                <Button type="submit" className="w-full">
                  Verify OTP
                </Button>
              </DialogFooter>
            </form>
          )}
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

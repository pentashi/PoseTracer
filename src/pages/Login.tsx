import { useState } from "react";
import { auth, db } from "../firebaseConfig";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle email/password login
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // ✅ Check onboarding status
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const onboardingComplete = userDoc.data()?.onboardingComplete;

    toast.success(`Welcome back, ${user.email}! 🎉`);

    setTimeout(() => {
      if (onboardingComplete) {
        navigate("/dashboard"); // already onboarded
      } else {
        navigate("/onboarding"); // first time, complete onboarding
      }
    }, 1000);
  } catch (err: any) {
    let message = "Login failed";
    if (err.code === "auth/user-not-found") message = "No account found with this email.";
    if (err.code === "auth/wrong-password") message = "Incorrect password.";
    if (err.code === "auth/invalid-email") message = "Invalid email format.";
    toast.error(message);
  } finally {
    setLoading(false);
  }
};


  // Handle Google login
  const handleGoogleLogin = async () => {
  const provider = new GoogleAuthProvider();
  setLoading(true);

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if Firestore doc exists
    const userDoc = await getDoc(doc(db, "users", user.uid));
    if (!userDoc.exists()) {
      // First-time user
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: Date.now(),
        onboardingComplete: false,
      });
      navigate("/onboarding"); // new user
    } else {
      // Existing user
      const onboardingComplete = userDoc.data()?.onboardingComplete;
      navigate(onboardingComplete ? "/dashboard" : "/onboarding");
    }

    toast.success(`Welcome, ${user.displayName || user.email}! 🚀`);
  } catch (err: any) {
    toast.error(err.message || "Google login failed ❌");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cyber-darker to-background p-4">
      <form
        onSubmit={handleLogin}
        className="bg-cyber-light/80 backdrop-blur-md p-6 rounded-2xl shadow-neon flex flex-col gap-4 w-full max-w-sm"
      >
        <h2 className="text-3xl font-bold text-neon-purple text-center mb-4 glow">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-cyber-dark border-neon-blue/50 text-white p-2 rounded placeholder:text-gray-400"
          required
          autoComplete="email"
        />

        {/* Password with toggle */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-cyber-dark border-neon-blue/50 text-white p-2 rounded placeholder:text-gray-400"
            required
            autoComplete="current-password"
          />
          <button
            type="button"
            className="absolute right-2 top-2 text-gray-400"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Email login button */}
        <button
          disabled={loading || !email || !password}
          className="bg-neon-blue hover:bg-neon-purple text-black font-bold p-2 rounded glow flex items-center justify-center"
        >
          {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Login"}
        </button>

        {/* OR separator */}
        <div className="flex items-center my-2">
          <hr className="flex-grow border-neon-blue/30" />
          <span className="px-2 text-gray-400 text-xs">OR</span>
          <hr className="flex-grow border-neon-blue/30" />
        </div>

        {/* Google login button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="flex items-center justify-center gap-2 bg-white text-black font-semibold p-2 rounded hover:bg-gray-200 transition"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        <p className="text-sm text-center text-white">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-neon-green hover:underline glow">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}

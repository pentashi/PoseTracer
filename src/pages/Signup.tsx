import { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState<"weak" | "medium" | "strong" | "">("");
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (auth.currentUser) {
      navigate("/dashboard");
    }
  }, [navigate]);

  // Password strength checker
  const checkStrength = (pwd: string) => {
    if (pwd.length < 6) return "weak";
    if (/[A-Z]/.test(pwd) && /\d/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) return "strong";
    return "medium";
  };

  // Email/password signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      toast.error("Passwords do not match ❌");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        createdAt: Date.now(),
        onboardingComplete: false,
      });

      toast.success("Signup successful! Redirecting to onboarding... 🚀");
      setTimeout(() => navigate("/onboarding"), 1200);
    } catch (err: any) {
      let message = "Signup failed";
      if (err.code === "auth/email-already-in-use") message = "This email is already registered.";
      if (err.code === "auth/invalid-email") message = "Invalid email format.";
      if (err.code === "auth/weak-password") message = "Password is too weak.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // Google signup
  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // check if user doc exists
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          createdAt: Date.now(),
          onboardingComplete: false,
        });
      }

      toast.success("Signed in with Google 🚀");
      navigate("/onboarding");
    } catch (err: any) {
      console.error(err);
      toast.error("Google sign-in failed ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cyber-darker to-background p-4">
      <form
        onSubmit={handleSignup}
        className="bg-cyber-light/80 backdrop-blur-md p-6 rounded-2xl shadow-neon flex flex-col gap-4 w-full max-w-sm"
      >
        <h2 className="text-3xl font-bold text-neon-purple text-center mb-4 glow">Sign Up</h2>

        {error && <p className="text-neon-pink text-sm text-center">{error}</p>}

        {/* Email */}
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
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordStrength(checkStrength(e.target.value));
            }}
            className="w-full bg-cyber-dark border-neon-blue/50 text-white p-2 rounded placeholder:text-gray-400"
            required
            autoComplete="new-password"
          />
          <button
            type="button"
            className="absolute right-2 top-2 text-gray-400"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Strength indicator */}
        {password && (
          <p
            className={`text-xs text-center ${
              passwordStrength === "weak"
                ? "text-red-400"
                : passwordStrength === "medium"
                ? "text-yellow-400"
                : "text-green-400"
            }`}
          >
            Password strength: {passwordStrength}
          </p>
        )}

        {/* Confirm password */}
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="bg-cyber-dark border-neon-blue/50 text-white p-2 rounded placeholder:text-gray-400"
          required
        />

        {/* Submit */}
        <button
          disabled={loading || !email || !password || !confirmPassword}
          className="bg-neon-blue hover:bg-neon-purple text-black font-bold p-2 rounded glow flex items-center justify-center"
        >
          {loading ? (
            <span className="animate-spin border-2 border-black border-t-transparent rounded-full w-4 h-4"></span>
          ) : (
            "Sign Up"
          )}
        </button>

        {/* OR divider */}
        <div className="flex items-center my-2">
          <div className="flex-grow h-px bg-gray-500" />
          <span className="mx-2 text-gray-300 text-sm">OR</span>
          <div className="flex-grow h-px bg-gray-500" />
        </div>

        {/* Google Sign-in button */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          className="flex items-center justify-center gap-2 bg-white text-black font-medium p-2 rounded hover:bg-gray-200 transition"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        <p className="text-sm text-center text-white">
          Already have an account?{" "}
          <Link to="/login" className="text-neon-green hover:underline glow">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

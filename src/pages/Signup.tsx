import { useState, useEffect } from "react";
import { auth, db } from "../firebaseConfig";
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext"; // Make sure this is correctly exported

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState<"weak" | "medium" | "strong" | "">("");
  const navigate = useNavigate();
  const { setIsDemo } = useAuth();

  // Demo onboarding state
  const [demoProfile, setDemoProfile] = useState({ name: "", age: "", weight: "", goal: "" });
  const [showDemoModal, setShowDemoModal] = useState(false);

  useEffect(() => {
    if (auth.currentUser) navigate("/dashboard");
  }, [navigate]);

  const checkStrength = (pwd: string) => {
    if (pwd.length < 6) return "weak";
    if (/[A-Z]/.test(pwd) && /\d/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) return "strong";
    return "medium";
  };

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

  const handleGoogleSignup = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

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

  // DEMO MODE
  const handleDemo = () => setShowDemoModal(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-cyber-darker to-background p-4 relative">
      {/* DEMO MODE BUTTON */}
      <button
        type="button"
        onClick={handleDemo}
        className="fixed top-6 right-6 z-50 bg-red-600 text-white font-bold py-3 px-6 rounded-2xl text-lg hover:bg-red-700 transition-all shadow-xl glow animate-pulse"
      >
        DEMO MODE
      </button>

      {/* DEMO ONBOARDING MODAL */}
      {showDemoModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-cyber-light p-6 rounded-2xl shadow-neon flex flex-col gap-4 w-full max-w-sm">
            <h3 className="text-xl font-bold text-neon-purple text-center mb-2 glow">Demo Onboarding</h3>

            <input
              type="text"
              placeholder="Name"
              value={demoProfile.name}
              onChange={(e) => setDemoProfile({ ...demoProfile, name: e.target.value })}
              className="bg-cyber-dark text-white p-2 rounded"
            />
            <input
              type="number"
              placeholder="Age"
              value={demoProfile.age}
              onChange={(e) => setDemoProfile({ ...demoProfile, age: e.target.value })}
              className="bg-cyber-dark text-white p-2 rounded"
            />
            <input
              type="number"
              placeholder="Weight (kg)"
              value={demoProfile.weight}
              onChange={(e) => setDemoProfile({ ...demoProfile, weight: e.target.value })}
              className="bg-cyber-dark text-white p-2 rounded"
            />
            <select
              value={demoProfile.goal}
              onChange={(e) => setDemoProfile({ ...demoProfile, goal: e.target.value })}
              className="bg-cyber-dark text-white p-2 rounded"
            >
              <option value="">Select goal</option>
              <option value="strength">Strength</option>
              <option value="fat-loss">Fat Loss</option>
              <option value="endurance">Endurance</option>
            </select>

            <button
              onClick={() => {
                setIsDemo(true);
                localStorage.setItem("demoProfile", JSON.stringify(demoProfile));
                toast.success("🚀 Demo Mode Activated!");
                navigate("/dashboard");
              }}
              className="bg-neon-blue text-black font-bold p-2 rounded glow"
            >
              Start Demo
            </button>
          </div>
        </div>
      )}

      {/* REGULAR SIGNUP FORM */}
      <form
        onSubmit={handleSignup}
        className="bg-cyber-light/80 backdrop-blur-md p-6 rounded-2xl shadow-neon flex flex-col gap-4 w-full max-w-sm"
      >
        <h2 className="text-3xl font-bold text-neon-purple text-center mb-4 glow">Sign Up</h2>
        {error && <p className="text-neon-pink text-sm text-center">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-cyber-dark border-neon-blue/50 text-white p-2 rounded placeholder:text-gray-400"
          required
          autoComplete="email"
        />

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

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="bg-cyber-dark border-neon-blue/50 text-white p-2 rounded placeholder:text-gray-400"
          required
        />

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

        <div className="flex items-center my-2">
          <div className="flex-grow h-px bg-gray-500" />
          <span className="mx-2 text-gray-300 text-sm">OR</span>
          <div className="flex-grow h-px bg-gray-500" />
        </div>

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

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface User {
  email: string;
  id?: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem("adminUser");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("adminUser");
      }
    }
    setLoading(false);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isLogin) {
        // Call backend login API
        const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Login failed");
        }

        const data = await response.json();
        const userData: User = { email: formData.email, id: data.userId };
        
        localStorage.setItem("adminUser", JSON.stringify(userData));
        localStorage.setItem("authToken", data.token);
        setUser(userData);

        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
      } else {
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: "Error",
            description: "Passwords do not match.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }

        // Call backend register API
        const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || "Registration failed");
        }

        const data = await response.json();
        const userData: User = { email: formData.email, id: data.userId };
        
        localStorage.setItem("adminUser", JSON.stringify(userData));
        localStorage.setItem("authToken", data.token);
        setUser(userData);

        toast({
          title: "Account created!",
          description: "You have successfully registered.",
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("adminUser");
    localStorage.removeItem("authToken");
    setUser(null);
    setFormData({ email: "", password: "", confirmPassword: "" });
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If logged in, show admin dashboard
  if (user) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border">
          <div className="container-luxury py-4 flex items-center justify-between">
            <h1 className="font-serif text-xl tracking-[0.1em]">MAISON LUXE</h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{user.email}</span>
              <button
                onClick={handleLogout}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="container-luxury py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="heading-section mb-8">Admin Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                { label: "Total Products", value: "24" },
                { label: "Categories", value: "6" },
                { label: "Collections", value: "4" },
                { label: "Inquiries", value: "12" },
              ].map((stat) => (
                <div key={stat.label} className="bg-card border border-border p-6">
                  <p className="text-caption mb-2">{stat.label}</p>
                  <p className="font-serif text-3xl">{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Quick Actions */}
              <div className="bg-card border border-border p-8">
                <h3 className="heading-card mb-6">Quick Actions</h3>
                <div className="space-y-4">
                  <button className="w-full btn-luxury text-left justify-start">
                    Add New Product
                  </button>
                  <button className="w-full btn-outline-luxury text-left justify-start">
                    Manage Categories
                  </button>
                  <button className="w-full btn-outline-luxury text-left justify-start">
                    View Inquiries
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-card border border-border p-8">
                <h3 className="heading-card mb-6">Recent Activity</h3>
                <div className="space-y-4">
                  <p className="text-body text-sm">
                    No recent activity to display.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground text-sm mt-8">
              Note: Full admin functionality (CRUD operations) will be available after setting up admin roles in the database.
            </p>
          </motion.div>
        </main>
      </div>
    );
  }

  // Login/Signup form
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-12">
          <h1 className="font-serif text-2xl tracking-[0.1em] mb-2">MAISON LUXE</h1>
          <p className="text-muted-foreground text-sm">Admin Portal</p>
        </div>

        <div className="bg-card border border-border p-8">
          <h2 className="heading-card text-center mb-8">
            {isLogin ? "Sign In" : "Create Account"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="text-caption mb-2 block">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-border bg-transparent focus:outline-none focus:border-foreground transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="text-caption mb-2 block">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-border bg-transparent focus:outline-none focus:border-foreground transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="text-caption mb-2 block">
                  Confirm Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-border bg-transparent focus:outline-none focus:border-foreground transition-colors"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-luxury w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                "Loading..."
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  {isLogin ? "Sign In" : "Create Account"}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          <a href="/" className="hover:text-foreground transition-colors">
            ← Back to website
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default Admin;

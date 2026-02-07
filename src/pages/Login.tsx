import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useLanguage } from "@/contexts/useLanguageHook";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }

      const data = await response.json();
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });

      // Redirect to account page
      window.location.href = "/account";
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <SEO
        title="Sign In | Manaku"
        description="Log in to your Manaku account to access your orders and favorites."
        url="https://lux-furniture-demo.netlify.app/login"
      />

      <section className="pt-28 pb-12 bg-background min-h-screen flex items-center justify-center">
        <div className="container-luxury px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-md mx-auto"
          >
            <div className="text-center mb-12">
              <h1 className="font-serif text-3xl tracking-[0.1em] mb-2">
                SIGN IN
              </h1>
              <p className="text-muted-foreground">
                Welcome back to your account
              </p>
            </div>

            <div className="bg-card border border-border p-8">
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
                  <label
                    htmlFor="password"
                    className="text-caption mb-2 block"
                  >
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
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-luxury w-full disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    "Signing in..."
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <a href="/signup" className="text-foreground hover:underline">
                    Sign up
                  </a>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}

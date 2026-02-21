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
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/login`,
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
        throw new Error(error.message || t("login.loginFailedErr"));
      }

      const data = await response.json();
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast({
        title: t("login.welcomeBackTitle"),
        description: t("login.welcomeBackDesc"),
        duration: 4000,
      });

      // Redirect to account page
      window.location.href = "/account";
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      toast({
        title: t("login.errorTitle"),
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <SEO
        title={t("login.title")}
        description="Log in to your Manaku account to access your orders and favorites."
        url="https://lux-furniture-demo.netlify.app/login"
      />

      <section className="pt-28 pb-12 bg-background min-h-screen flex items-center justify-center">
        <div className="container-luxury px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="auth-container"
          >
            <div className="text-center mb-12">
              <h1 className="font-serif text-3xl tracking-[0.1em] mb-2">
                {t("login.heading").toUpperCase()}
              </h1>
              <p className="text-muted-foreground">
                {t("login.subtitle")}
              </p>
            </div>

            <div className="auth-card">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="text-caption mb-2 block">
                    {t("login.email")}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="text-caption mb-2 block"
                  >
                    {t("login.password")}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="form-input form-input--with-icon"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="password-toggle"
                    >
                      {showPassword ? (
                        <EyeOff className="icon-eye" />
                      ) : (
                        <Eye className="icon-eye" />
                      )}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-luxury auth-submit"
                >
                  {isSubmitting ? (
                    t("login.signingIn")
                  ) : (
                    <>
                      <LogIn className="w-4 h-4 mr-2" />
                      {t("login.signIn")}
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  {t("login.dontHaveAccount")}{" "}
                  <a href="/signup" className="text-foreground hover:underline">
                    {t("login.signupLink")}
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

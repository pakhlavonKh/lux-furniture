import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { motion } from "framer-motion";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import { useLanguage } from "@/contexts/useLanguageHook";
import { useToast } from "@/hooks/use-toast";

export default function Signup() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: t("signup.errorTitle"),
        description: t("signup.passwordsMismatch"),
        variant: "destructive",
        duration: 5000,
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000"}/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || t("signup.registrationFailed"));
      }

      const data = await response.json();
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast({
        title: t("signup.accountCreatedTitle"),
        description: t("signup.accountCreatedDesc"),
        duration: 4000,
      });

      // Redirect to account page
      window.location.href = "/account";
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      toast({
        title: t("signup.errorTitle"),
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title={t("signup.seo.title") || "Signup | Manaku"}
        description={t("signup.seo.description") || "Create your Manaku account."}
        url="https://lux-furniture-demo.netlify.app/signup"
      />
      <Layout>
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
                  {t("signup.heading").toUpperCase()}
                </h1>
                <p className="text-muted-foreground">{t("signup.subtitle")}</p>
              </div>

              <div className="auth-card">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="text-body mb-2 block">
                      {t("signup.name") || "Full Name"}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="form-input"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="text-body mb-2 block">
                      {t("signup.email")}
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
                    <label htmlFor="password" className="text-body mb-2 block">
                      {t("signup.password")}
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

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="text-body mb-2 block"
                    >
                      {t("signup.confirmPassword")}
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        required
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="form-input form-input--with-icon"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="password-toggle"
                      >
                        {showConfirmPassword ? (
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
                      t("signup.creatingAccount")
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4 mr-2" />
                        {t("signup.createAccount")}
                      </>
                    )}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <p className="text-sm">
                    <span className="text-muted-foreground">
                      {t("signup.haveAccount")}{" "}
                    </span>
                    <a
                      href="/login"
                      className="text-[#3091B1]"
                    >
                      {t("signup.signinLink")}
                    </a>
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </Layout>
    </>
  );
}

import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { motion } from "framer-motion";
import { LogOut, User, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/useLanguageHook";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface UserData {
  email: string;
  id?: string;
}

export default function Account() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const authToken = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");

    if (!authToken || !userData) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(userData));
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
    navigate("/login");
  };

  if (loading) {
    return (
      <Layout>
        <section className="pt-28 pb-12 bg-background min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title="My Account | Manaku"
        description="Manage your Manaku account and orders."
        url="https://lux-furniture-demo.netlify.app/account"
      />

      <section className="pt-28 pb-12 bg-background min-h-screen">
        <div className="container-luxury">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="heading-section mb-12">My Account</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Account Overview */}
              <div className="lg:col-span-1">
                <div className="bg-card border border-border p-8 sticky top-32">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-foreground/10 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-foreground" />
                    </div>
                    <div>
                      <p className="text-caption text-muted-foreground">
                        AccountEmail
                      </p>
                      <p className="font-semibold">{user?.email}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full btn-outline-luxury flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Order History */}
                <div className="bg-card border border-border p-8 mb-8">
                  <h2 className="heading-card mb-6">Order History</h2>
                  <p className="text-muted-foreground text-sm">
                    No orders yet. Start shopping to see your orders here.
                  </p>
                  <a href="/" className="btn-luxury mt-6 inline-block">
                    Start Shopping
                  </a>
                </div>

                {/* Account Settings */}
                <div className="bg-card border border-border p-8">
                  <h2 className="heading-card mb-6">Account Settings</h2>

                  <div className="space-y-6">
                    {/* Email */}
                    <div>
                      <p className="text-caption mb-2 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </p>
                      <p className="text-foreground">{user?.email}</p>
                    </div>

                    {/* Member Since */}
                    <div>
                      <p className="text-caption mb-2">Member Since</p>
                      <p className="text-foreground">
                        {new Date().toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <button className="btn-luxury mt-8 w-full">
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}

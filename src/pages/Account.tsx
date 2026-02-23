import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { motion } from "framer-motion";
import { LogOut, Mail, Phone, MapPin, ShoppingBag, Trash2 } from "lucide-react";
import { useLanguage } from "@/contexts/useLanguageHook";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface UserData {
  email: string;
  id?: string;
  name?: string;
}

interface UserProfile {
  phone: string;
  street: string;
  city: string;
  house: string;
  postalCode: string;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export default function Account() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [user, setUser] = useState<UserData | null>(null);
  const [profile, setProfile] = useState<UserProfile>({
    phone: "",
    street: "",
    city: "",
    house: "",
    postalCode: "",
  });
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile>({
    phone: "",
    street: "",
    city: "",
    house: "",
    postalCode: "",
  });

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");
    const savedProfile = localStorage.getItem("userProfile");
    const savedCart = localStorage.getItem("cart");

    if (!authToken || !userData) {
      navigate("/login");
      return;
    }

    setUser(JSON.parse(userData));

    if (savedProfile) {
      const parsedProfile = JSON.parse(savedProfile);
      setProfile(parsedProfile);
      setProfileData(parsedProfile);
    }

    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }

    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    toast({
      title: t("account.logoutTitle") || "Logged out",
      description: t("account.logoutDesc") || "You have been logged out successfully.",
    });
    navigate("/login");
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = () => {
    if (
      !profileData.phone ||
      !profileData.street ||
      !profileData.city ||
      !profileData.house ||
      !profileData.postalCode
    ) {
      toast({
        title: t("account.validationError") || "Validation Error",
        description: t("account.allFieldsRequired") || "Please fill in all fields",
        variant: "destructive",
        duration: 5000,
      });
      return;
    }

    localStorage.setItem("userProfile", JSON.stringify(profileData));
    setProfile(profileData);
    setIsEditingProfile(false);
    toast({
      title: t("account.profileUpdated") || "Profile Updated",
      description: t("account.profileSaved") || "Your profile has been saved successfully.",
      duration: 4000,
    });
  };

  const handleRemoveFromCart = (itemId: string) => {
    const updatedCart = cartItems.filter((item) => item.id !== itemId);
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    toast({
      title: t("account.itemRemoved") || "Item Removed",
      description: t("account.itemRemovedFromCart") || "Item has been removed from cart.",
      duration: 4000,
    });
  };

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

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
    <>
      <SEO
        title={t("account.seo.title") || "Account | Manaku"}
        description={t("account.seo.description") || "Your Manaku account details."}
        url="https://lux-furniture-demo.netlify.app/account"
      />
      <Layout>
        <section className="pt-28 pb-12 bg-background min-h-screen">
          <div className="container-luxury">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="heading-section mb-12">
                {t("account.myAccount") || "My Account"}
              </h1>

              <div className="space-y-8 max-w-4xl">
                {/* Profile */}
                <div className="bg-card border border-border p-8">
                  <h2 className="heading-card mb-8">
                    {t("account.profileSettings") || "Profile & Settings"}
                  </h2>

                  {!isEditingProfile ? (
                    <div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-border">
                        <div>
                          <p className="text-caption mb-2 flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            {t("account.email") || "Email Address"}
                          </p>
                          <p className="text-foreground font-semibold">
                            {user?.email}
                          </p>
                        </div>

                        <div>
                          <p className="text-caption mb-2 flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            {t("account.phone") || "Phone Number"}
                          </p>
                          <p className="text-foreground font-semibold">
                            {profile.phone ||
                              t("account.notProvided") ||
                              "Not provided"}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={() => setIsEditingProfile(true)}
                          className="btn-luxury flex-1"
                        >
                          {t("account.editProfile") || "Edit Profile"}
                        </button>
                        <button
                          onClick={handleLogout}
                          className="btn-outline-luxury flex-1 flex items-center justify-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          {t("account.logout") || "Logout"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="space-y-6 mb-8">
                        {/* Phone */}
                        <div>
                          <label className="text-caption mb-2 block">
                            {t("account.phone") || "Phone Number"} *
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={profileData.phone}
                            onChange={handleProfileChange}
                            className="form-input"
                          />
                        </div>

                        {/* Street */}
                        <div>
                          <label className="text-caption mb-2 block">
                            {t("account.street") || "Street"} *
                          </label>
                          <input
                            type="text"
                            name="street"
                            value={profileData.street}
                            onChange={handleProfileChange}
                            className="form-input"
                          />
                        </div>

                        {/* City */}
                        <div>
                          <label className="text-caption mb-2 block">
                            {t("account.city") || "City"} *
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={profileData.city}
                            onChange={handleProfileChange}
                            className="form-input"
                          />
                        </div>

                        {/* House */}
                        <div>
                          <label className="text-caption mb-2 block">
                            {t("account.house") || "House"} *
                          </label>
                          <input
                            type="text"
                            name="house"
                            value={profileData.house}
                            onChange={handleProfileChange}
                            className="form-input"
                          />
                        </div>

                        {/* Postal Code */}
                        <div>
                          <label className="text-caption mb-2 block">
                            {t("account.postalCode") || "Postal Code"} *
                          </label>
                          <input
                            type="text"
                            name="postalCode"
                            value={profileData.postalCode}
                            onChange={handleProfileChange}
                            className="form-input"
                          />
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <button
                          onClick={handleSaveProfile}
                          className="btn-luxury flex-1"
                        >
                          {t("account.save") || "Save Changes"}
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingProfile(false);
                            setProfileData(profile);
                          }}
                          className="btn-outline-luxury flex-1"
                        >
                          {t("account.cancel") || "Cancel"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </Layout>
    </>
  );
}
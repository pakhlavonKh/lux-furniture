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
  const [profile, setProfile] = useState<UserProfile>({ phone: "", street: "", city: "", postalCode: "" });
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile>({ phone: "", street: "", city: "", postalCode: "" });

  useEffect(() => {
    // Check if user is logged in
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
    if (!profileData.phone || !profileData.street || !profileData.city || !profileData.postalCode) {
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

  const cartTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
            <h1 className="heading-section mb-12">{t("account.myAccount") || "My Account"}</h1>

            <div className="space-y-8 max-w-4xl">
              {/* Account Profile & Settings */}
              <div className="bg-card border border-border p-8">
                <h2 className="heading-card mb-8">{t("account.profileSettings") || "Profile & Settings"}</h2>

                {!isEditingProfile ? (
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-border">
                      {/* Email */}
                      <div>
                        <p className="text-caption mb-2 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {t("account.email") || "Email Address"}
                        </p>
                        <p className="text-foreground font-semibold">{user?.email}</p>
                      </div>

                      {/* Phone */}
                      <div>
                        <p className="text-caption mb-2 flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {t("account.phone") || "Phone Number"}
                        </p>
                        <p className="text-foreground font-semibold">
                          {profile.phone || t("account.notProvided") || "Not provided"}
                        </p>
                      </div>

                      {/* Address */}
                      <div className="md:col-span-2">
                        <p className="text-caption mb-2 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {t("account.address") || "Delivery Address"}
                        </p>
                        <div className="space-y-2">
                          <p className="text-foreground font-semibold">
                            {profile.street || (t("account.notProvided") || "Not provided")}
                          </p>
                          {profile.city && (
                            <p className="text-foreground font-semibold">{profile.city}</p>
                          )}
                          {profile.postalCode && (
                            <p className="text-foreground font-semibold">{profile.postalCode}</p>
                          )}
                        </div>
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
                      {/* Email Display (Read-only) */}
                      <div>
                        <p className="text-caption mb-2 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {t("account.email") || "Email Address"}
                        </p>
                        <p className="text-foreground font-semibold">{user?.email}</p>
                      </div>

                      {/* Phone Input */}
                      <div>
                        <label htmlFor="phone" className="text-caption mb-2 block flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {t("account.phone") || "Phone Number"} *
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleProfileChange}
                          placeholder={t("account.phonePlaceholder") || "+1 (555) 000-0000"}
                          className="form-input"
                          required
                        />
                      </div>

                      {/* Address Input */}
                      <div>
                        <label htmlFor="address" className="text-caption mb-2 block flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {t("account.address") || "Delivery Address"} * ({t("account.required") || "Required"})
                        </label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={profileData.address}
                          onChange={handleProfileChange}
                          placeholder={t("account.addressPlaceholder") || "Street address, city, postal code"}
                          className="form-input"
                          required
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

              {/* Shopping Basket */}
              <div className="bg-card border border-border p-8">
                <div className="flex items-center gap-2 mb-6">
                  <ShoppingBag className="w-5 h-5" />
                  <h2 className="heading-card">{t("account.basket") || "Shopping Basket"}</h2>
                </div>

                {cartItems.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground text-sm mb-4">
                      {t("account.basketEmpty") || "Your basket is empty"}
                    </p>
                    <a href="/" className="btn-luxury">
                      {t("account.continueShopping") || "Continue Shopping"}
                    </a>
                  </div>
                ) : (
                  <>
                    <div className="space-y-4 mb-6">
                      {cartItems.map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-4 border border-border rounded">
                          <div className="flex-1">
                            <p className="font-semibold">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {t("account.quantity") || "Qty"}: {item.quantity} × €{item.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <p className="font-semibold">€{(item.price * item.quantity).toFixed(2)}</p>
                            <button
                              onClick={() => handleRemoveFromCart(item.id)}
                              className="text-destructive hover:text-destructive/80 transition"
                              aria-label={t("account.remove") || "Remove"}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-border pt-6">
                      <div className="flex justify-between items-center mb-6">
                        <p className="text-lg font-semibold">{t("account.total") || "Total"}:</p>
                        <p className="text-2xl font-semibold">€{cartTotal.toFixed(2)}</p>
                      </div>
                      <button className="w-full btn-luxury">
                        {t("account.checkout") || "Proceed to Checkout"}
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Order History */}
              <div className="bg-card border border-border p-8">
                <h2 className="heading-card mb-6">{t("account.orderHistory") || "Order History"}</h2>
                <p className="text-muted-foreground text-sm mb-6">
                  {t("account.noOrders") || "No orders yet. Start shopping to see your orders here."}
                </p>
                <a href="/" className="btn-luxury inline-block">
                  {t("account.startShopping") || "Start Shopping"}
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}

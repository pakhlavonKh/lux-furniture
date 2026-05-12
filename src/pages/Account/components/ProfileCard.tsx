// src/pages/Account/components/ProfileCard.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/useLanguageHook";
import "../account.css";

interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

interface Props {
  user?: User;
}

export default function ProfileCard({ user }: Props) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (user) {
      setEmail(user.email || "");
      setName(user.name || "");
      setPhone(user.phone || "");
      setAddress(user.address || "");
    }
  }, [user]);

  const mutation = useMutation({
    mutationFn: async () => {
      return apiFetch("/api/users/me", {
        method: "PUT",
        body: JSON.stringify({ email, name, phone, address }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });

      toast({
        title: t("account.profileUpdated"),
        description: t("account.profileUpdateMessage"),
      });
    },
    onError: (error: any) => {
      toast({
        title: t("account.updateFailed"),
        description: error?.message || t("account.somethingWentWrong"),
        variant: "destructive",
      });
    },
  });

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    toast({
      title: t("account.logoutTitle"),
      description: t("account.logoutDesc"),
    });
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="profile-section">
      {/* Form Card */}
      <div className="profile-form-card">
        <div className="profile-form-header">
          <h3 className="profile-form-title">{t("account.profileDetails")}</h3>
          <p className="profile-form-subtitle">{t("account.keepUpdated")}</p>
        </div>

        <div className="profile-form-fields">
          {/* Email Field */}
          <div className="profile-form-field">
            <label className="profile-form-label">{t("account.email")}</label>
            <input
              className="profile-form-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Name Field */}
          <div className="profile-form-field">
            <label className="profile-form-label">{t("account.fullName")}</label>
            <input
              className="profile-form-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("account.fullNamePlaceholder")}
            />
          </div>

          {/* Phone Field */}
          <div className="profile-form-field">
            <label className="profile-form-label">{t("account.phone")}</label>
            <input
              className="profile-form-input"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t("account.phonePlaceholder")}
            />
          </div>



          {/* Address Field */}
          <div className="profile-form-field">
            <label className="profile-form-label">{t("account.address")}</label>
            <textarea
              className="profile-form-input profile-form-textarea"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={t("account.addressPlaceholder")}
            />
          </div>

          {/* Save Button */}
          <div className="profile-form-button-wrapper">
            <button
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
              className={`profile-form-button ${mutation.isPending ? "loading" : ""}`}
            >
              {mutation.isPending ? (
                <span className="profile-form-button-loading">
                  <span className="profile-form-button-spinner" />
                  {t("account.saving")}
                </span>
              ) : (
                t("account.saveChanges")
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <div className="profile-logout-section">
        <button
          onClick={handleLogout}
          className="profile-logout-button"
        >
          <LogOut className="profile-logout-icon" />
          {t("account.logout")}
        </button>
      </div>
    </div>
  );
}
import { useLanguage } from "@/contexts/useLanguageHook"
import "../account.css"

interface User {
  name: string
  email: string
}

interface Props {
  user: User
}

export default function AccountHero({ user }: Props) {
  const { t } = useLanguage()
  const welcomeText = t("account.welcomeBack").replace("{name}", user.name || "")

  return (
    <div className="account-hero">
      <div className="account-hero-background" />
      <div className="account-hero-blur-1" />
      <div className="account-hero-blur-2" />
      
      <div className="account-hero-content">
        <div>
          <div className="account-hero-badge">
            <span className="account-hero-badge-dot" />
            <p>{t("account.accountSettings")}</p>
          </div>
          
          <h1 className="account-hero-title">
            {welcomeText}
          </h1>

          <p className="account-hero-subtitle">
            {t("account.manageProfile")}
          </p>
        </div>
      </div>
    </div>
  )
}
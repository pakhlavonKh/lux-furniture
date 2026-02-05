import { useEffect } from "react";
import { useLanguage } from "@/contexts/useLanguageHook";

interface SEOProps {
  title: string;
  description: string;
  url: string;
  image?: string;
}

export function SEO({ title, description, url, image = "/src/assets/og.png" }: SEOProps) {
  const { language } = useLanguage();

  useEffect(() => {
    // Update title
    document.title = title;

    // Update meta description
    const descriptionMeta = document.querySelector('meta[name="description"]');
    if (descriptionMeta) {
      descriptionMeta.setAttribute("content", description);
    }

    // Update HTML lang attribute
    document.documentElement.lang = language;

    // Update OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", title);

    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute("content", description);

    const ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) ogUrl.setAttribute("content", url);

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute("content", image);

    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) twitterTitle.setAttribute("content", title);

    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) twitterDescription.setAttribute("content", description);

    // Update hreflang tags for language variants
    updateHrefLangTags(url, language);
  }, [title, description, url, image, language]);

  return null;
}

function updateHrefLangTags(baseUrl: string, currentLanguage: string) {
  // Remove existing hreflang tags
  document.querySelectorAll('link[rel="alternate"]').forEach((tag) => tag.remove());

  // Add hreflang tags for all language versions
  const languages: string[] = ["en", "ru", "uz"];
  const baseUrlWithoutLang = baseUrl.replace(/\/(en|ru|uz)(\/|$)/, "/");

  languages.forEach((lang) => {
    const link = document.createElement("link");
    link.rel = "alternate";
    link.setAttribute("hreflang", lang === "en" ? "en-US" : lang);
    
    // Construct the language-specific URL
    const langUrl = baseUrlWithoutLang === "/" 
      ? lang === "en" ? "/" : `/${lang}`
      : lang === "en" 
        ? baseUrlWithoutLang 
        : `/${lang}${baseUrlWithoutLang}`;
    
    link.href = langUrl;
    document.head.appendChild(link);
  });

  // Add x-default hreflang
  const xDefaultLink = document.createElement("link");
  xDefaultLink.rel = "alternate";
  xDefaultLink.setAttribute("hreflang", "x-default");
  xDefaultLink.href = baseUrlWithoutLang === "/" ? "/" : baseUrlWithoutLang;
  document.head.appendChild(xDefaultLink);
}

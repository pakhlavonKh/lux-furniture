import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/useLanguageHook";
import { SEO } from "@/components/SEO";

const Contact = () => {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast({
      title: t("contact.messageSent"),
      description: t("contact.messageDescription"),
    });

    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    });
    setIsSubmitting(false);
  };

  const maps = [
    {
      key: "mainOffice",
      src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.6839821754866!2d69.24919456623628!3d41.33009894409881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38ae8b465578663d%3A0x961a3862d2597d5e!2z0JbQsNC90LPQvtGFIDIsINCi0L5zaGtlbnQsIFRvc2hrZW50LCDQo9C30LHQtdC60LjRgdGC0LDQvQ!5e0!3m2!1sru!2s!4v1772044388923!5m2!1sru!2s",
    },
    {
      key: "showroomLabel",
      src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11991.469956761875!2d69.27962399670983!3d41.289988327885276!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38aef58d981ac3c3%3A0x9f4399f43b40792d!2sAlfraganus!5e0!3m2!1sru!2s!4v1771668852532!5m2!1sru!2s",
    },
  ];

  const [mapIndex, setMapIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setMapIndex((prev) => (prev + 1) % maps.length);
    }, 7000);

    return () => clearInterval(id);
  }, []);

  return (
    <>
      <SEO
        title={t("contact.seo.title") || "Contact | Manaku"}
        description={
          t("contact.seo.description") || "Contact Manaku luxury furniture."
        }
        url="https://lux-furniture-demo.netlify.app/contact"
      />
      <Layout>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-secondary/30">
          <div className="container-luxury">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-2xl mx-auto"
            >
              <p className="text-caption mb-4">{t("contact.subtitle")}</p>
              <h1 className="heading-display mb-6">{t("contact.title")}</h1>
              <p className="text-body text-lg">{t("contact.description")}</p>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="section-padding">
          <div className="container-luxury">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-16">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h2 className="heading-card mb-8">
                  {t("contact.showroomInfo")}
                </h2>

                <div className="space-y-8">
                  {/* Address */}

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary flex items-center justify-center flex-shrink-0 rounded-full">
                      <MapPin className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">
                        {t("contact.mainOffice")}
                      </h3>
                      <p className="text-body">
                        {t("contact.mainOfficeAddress")}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary flex items-center justify-center flex-shrink-0 rounded-full">
                      <MapPin className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">
                        {t("contact.showroomLabel")}
                      </h3>
                      <p className="text-body">
                        {t("contact.addressLine1")}
                        <br />
                        {t("contact.addressLine2")}
                      </p>
                    </div>
                  </div>
                  {/* <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary flex items-center justify-center flex-shrink-0 rounded-full">
                      <MapPin className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">
                        {t("contact.showroomName")}
                      </h3>
                      <p className="text-body">
                        {t("contact.addressLine1")}
                        <br />
                        {t("contact.addressLine2")}
                      </p>
                    </div>
                  </div> */}

                  {/* Phone */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary flex items-center justify-center flex-shrink-0 rounded-full">
                      <Phone className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">
                        {t("contact.phoneTitle")}
                      </h3>
                      <p className="text-body">
                        <a
                          href="tel:+998955215050"
                          className="hover:text-foreground transition-colors"
                        >
                          +998 95 521 50 50
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary flex items-center justify-center flex-shrink-0 rounded-full">
                      <Mail className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">
                        {t("contact.emailTitle")}
                      </h3>
                      <p className="text-body">
                        <a
                          href="mailto:info@manaku.com"
                          className="hover:text-foreground transition-colors"
                        >
                          info@manaku.com
                        </a>
                      </p>
                    </div>
                  </div>

                  {/* Hours */}
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-primary flex items-center justify-center flex-shrink-0 rounded-full">
                      <Clock className="w-6 h-7 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">
                        {t("contact.hoursTitle")}
                      </h3>
                      <div className="text-body space-y-1">
                        <p>{t("contact.hoursWeekdays")}</p>
                        <p>{t("contact.hoursSaturday")}</p>
                        <p>{t("contact.hoursSunday")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Map Placeholder */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                {/* Title */}
                <div className="map-title-wrapper">
                  <AnimatePresence mode="wait">
                    <motion.h3
                      key={maps[mapIndex].key}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.6 }}
                      className="map-title"
                    >
                      {t(`contact.${maps[mapIndex].key}`)}
                    </motion.h3>
                  </AnimatePresence>
                </div>

                {/* Map slider */}
                <div
                  className="map-wrapper"
                  style={{ position: "relative", height: 450 }}
                >
                  {maps.map((map, i) => (
                    <motion.div
                      key={map.src}
                      initial={false}
                      animate={{
                        opacity: i === mapIndex ? 1 : 0,
                        x: i === mapIndex ? 0 : -40,
                        pointerEvents: i === mapIndex ? "auto" : "none",
                      }}
                      transition={{ duration: 0.6 }}
                      style={{
                        position: "absolute",
                        inset: 0,
                      }}
                    >
                      <iframe
                        src={map.src}
                        width="600"
                        height="450"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="eager"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="heading-card mb-8 text-center">
                {t("contact.formTitle")}
              </h2>
              <form
                onSubmit={handleSubmit}
                className="space-y-6 w-full max-w-2xl mx-auto"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="text-body mb-2 block">
                      {t("contact.name")}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="contact-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="text-body mb-2 block">
                      {t("contact.email")}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="contact-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="text-body mb-2 block">
                      {t("contact.phone")}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="contact-input"
                    />
                  </div>
                  <div>
                    <label htmlFor="subject" className="text-body mb-2 block">
                      {t("contact.subject")} *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="contact-input text-body"
                    >
                      <option value="">
                        {t("contact.subjectOptions.selectSubject")}
                      </option>
                      <option value="product-inquiry">
                        {t("contact.subjectOptions.productInquiry")}
                      </option>
                      <option value="showroom-visit">
                        {t("contact.subjectOptions.showroomVisit")}
                      </option>
                      <option value="design-consultation">
                        {t("contact.subjectOptions.designConsultation")}
                      </option>
                      <option value="order-status">
                        {t("contact.subjectOptions.orderStatus")}
                      </option>
                      <option value="other">
                        {t("contact.subjectOptions.other")}
                      </option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="text-body mb-2 block">
                    {t("contact.message")} *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="contact-input contact-textarea"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-luxury w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed mx-auto block"
                >
                  {isSubmitting ? t("contact.sending") : t("contact.send")}
                </button>
              </form>
            </motion.div>
          </div>
        </section>
      </Layout>
    </>
  );
};

export default Contact;

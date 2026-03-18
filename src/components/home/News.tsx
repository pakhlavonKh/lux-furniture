import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { News as NewsType } from "@/lib/api";
import { useLanguage } from "@/contexts/useLanguageHook";
import { InfiniteCarousel, CarouselItem } from "@/components/ui/InfiniteCarousel";

const MOCK_NEWS: NewsType[] = [
  {
    _id: "1",
    title: { en: "New Spring Collection Launched", ru: "Запущена новая весенняя коллекция", uz: "Yangi bahor kolleksiyasi ishga tushdi" },
    description: { en: "Introducing our stunning spring collection", ru: "Представляем нашу потрясающую весеннюю коллекцию", uz: "Zamonaviy bahor kolleksiyasini taqdim etamiz" },
    content: { en: "This season brings fresh designs and sustainable materials.", ru: "Этот сезон приносит свежие дизайны и устойчивые материалы.", uz: "Bu fasl yangi dizaynlarni va barqaror materiallarni keltiradi." },
    isActive: true,
    order: 1,
    image: { url: "https://res.cloudinary.com/demo/image/upload/v1/spring.jpg", public_id: "spring", alt: "Spring Collection" },
  },
  {
    _id: "2",
    title: { en: "Interior Design Workshop Series", ru: "Серия мастер-классов по дизайну интерьера", uz: "Ichki dizayn seminar seriyasi" },
    description: { en: "Join our expert designers for exclusive workshops", ru: "Присоединитесь к нашим экспертным дизайнерам", uz: "Bizning mutaxassis dizaynerlariga qo'shiling" },
    content: { en: "Learn space planning and color theory from industry experts.", ru: "Изучите планирование пространства и теорию цвета.", uz: "Joyni rejalashtirishni va rang nazariasini o'rganing." },
    isActive: true,
    order: 2,
  },
  {
    _id: "3",
    title: { en: "Sustainable Craftsmanship", ru: "Устойчивое мастерство", uz: "Barqaror hunarmandlik" },
    description: { en: "Our commitment to sustainable furniture", ru: "Наша приверженность устойчивой мебели", uz: "Barqaror mebelga bizning intilish" },
    content: { en: "Every piece is crafted with passion and responsibility.", ru: "Каждое изделие создано с страстью и ответственностью.", uz: "Har bir narsalar ishtiyoq va mas'uliyat bilan yaratilgan." },
    isActive: true,
    order: 3,
  },
];

export function News() {
  const { language, t } = useLanguage();
  const [news, setNews] = useState<NewsType[]>(MOCK_NEWS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // No need to fetch - using mock data for development
    setNews(MOCK_NEWS);
    setError(null);
  }, []);

  if (loading) {
    return (
      <section className="news-section">
        <div className="container text-center">
          <div className="loader" />
        </div>
      </section>
    );
  }

  if (error || news.length === 0) {
    return null;
  }

  return (
    <section className="news-section">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="section-title">
            {t("news.title") || "Latest News"}
          </h2>

          <InfiniteCarousel
            opts={{ loop: true, align: "start" }}
            showDots={true}
            showArrows={true}
            className="carousel"
          >
            {news.map((item, index) => (
              <CarouselItem
                key={item._id || item.id || index}
              >
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: (index % 4) * 0.1,
                  }}
                  viewport={{ once: true }}
                  className="news-card"
                >
                  {item.image?.url && (
                    <div className="news-image-wrapper">
                      <img
                        src={item.image.url}
                        alt={
                          item.image.alt ||
                          item.title?.[language] ||
                          item.title?.en
                        }
                        className="news-image"
                      />
                    </div>
                  )}

                  <div className="news-content">
                    <time className="news-date">
                      {item.publishedAt
                        ? new Date(item.publishedAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )
                        : ""}
                    </time>

                    <h3 className="news-title line-clamp-2">
                      {item.title?.[language] || item.title?.en}
                    </h3>

                    <p className="news-description line-clamp-2">
                      {item.description?.[language] ||
                        item.description?.en}
                    </p>

                    {item.content?.[language] && (
                      <p className="news-extra line-clamp-2">
                        {item.content[language]}
                      </p>
                    )}

                    <button className="news-button">
                      {t("news.readMore") || "Read more"} →
                    </button>
                  </div>
                </motion.article>
              </CarouselItem>
            ))}
          </InfiniteCarousel>
        </motion.div>
      </div>
    </section>
  );
}
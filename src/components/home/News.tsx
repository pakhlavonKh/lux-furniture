import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAllNews, News as NewsType } from "@/lib/api";
import { useLanguage } from "@/contexts/useLanguageHook";
import { InfiniteCarousel, CarouselItem } from "@/components/ui/InfiniteCarousel";

export function News() {
  const { language, t } = useLanguage();
  const [news, setNews] = useState<NewsType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true);
        const data = await getAllNews(true);
        setNews(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch news");
        setNews([]);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
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
            itemsPerRow={4}
            className="carousel"
          >
            {news.map((item, index) => (
              <CarouselItem
                key={item._id || item.id || index}
                flex="0 0 calc(25% - 1.5rem)"
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
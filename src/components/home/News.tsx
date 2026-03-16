import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAllNews, News as NewsType } from "@/lib/api";

export function News() {
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
      <section className="py-section bg-background">
        <div className="container-luxury text-center">
          <div className="inline-block w-8 h-8 border-2 border-foreground border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    );
  }

  if (error || news.length === 0) {
    return null;
  }

  return (
    <section className="py-section bg-background">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="heading-section mb-12">Latest News</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {news.map((item, index) => (
              <motion.article
                key={item._id || item.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-card border border-border hover:border-foreground transition-colors"
              >
                {item.image?.url && (
                  <div className="relative w-full h-48 overflow-hidden bg-secondary">
                    <img
                      src={item.image.url}
                      alt={item.image.alt || item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}

                <div className="p-6">
                  <time className="text-caption text-muted-foreground">
                    {item.publishedAt
                      ? new Date(item.publishedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })
                      : ""}
                  </time>

                  <h3 className="heading-card mt-3 mb-3">{item.title}</h3>
                  <p className="text-body text-muted-foreground mb-4">
                    {item.description}
                  </p>

                  {item.content && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {item.content}
                    </p>
                  )}

                  <button className="text-foreground text-sm font-medium hover:opacity-60 transition-opacity">
                    Read more →
                  </button>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
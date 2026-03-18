import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface InfiniteCarouselProps {
  children: React.ReactNode;
  opts?: {
    loop?: boolean;
    align?: "start" | "center" | "end";
  };
  showDots?: boolean;
  showArrows?: boolean;
  autoplay?: boolean;
  autoplayDelay?: number;
  className?: string;
}

const InfiniteCarousel = React.forwardRef<
  HTMLDivElement,
  InfiniteCarouselProps
>(
  (
    {
      children,
      opts = { loop: true, align: "start" },
      showDots = true,
      showArrows = true,
      autoplay = true,
      autoplayDelay = 5000,
      className,
    },
    ref,
  ) => {
    const autoplayRef = React.useRef<ReturnType<typeof Autoplay> | null>(null);

    const [carouselRef, emblaApi] = useEmblaCarousel(
      {
        loop: opts.loop,
        align: "start",
        slidesToScroll: 1,
        containScroll: "trimSnaps",
      },
      autoplay
        ? [
            (autoplayRef.current = Autoplay({
              delay: autoplayDelay,
              stopOnInteraction: false,
            })),
          ]
        : [],
    );

    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);
    const [progress, setProgress] = React.useState(0);

    const startTimeRef = React.useRef(Date.now());
    const rafRef = React.useRef<number | null>(null);

    // INIT snaps
    React.useEffect(() => {
      if (!emblaApi) return;

      setScrollSnaps(emblaApi.scrollSnapList());
    }, [emblaApi]);

    // SELECT
    const onSelect = React.useCallback(() => {
      if (!emblaApi) return;

      setSelectedIndex(emblaApi.selectedScrollSnap());
      startTimeRef.current = Date.now();
    }, [emblaApi]);

    React.useEffect(() => {
      if (!emblaApi) return;

      onSelect();
      emblaApi.on("select", onSelect);

      return () => {
        emblaApi.off("select", onSelect);
      };
    }, [emblaApi, onSelect]);

    // AUTOPLAY PROGRESS
    React.useEffect(() => {
      if (!autoplay || !emblaApi) return;

      const update = () => {
        const elapsed = Date.now() - startTimeRef.current;
        const value = Math.min((elapsed / autoplayDelay) * 100, 100);
        setProgress(value);

        rafRef.current = requestAnimationFrame(update);
      };

      rafRef.current = requestAnimationFrame(update);

      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      };
    }, [emblaApi, autoplay, autoplayDelay]);

    const scrollPrev = () => {
      emblaApi?.scrollPrev();
      autoplayRef.current?.reset();
    };

    const scrollNext = () => {
      emblaApi?.scrollNext();
      autoplayRef.current?.reset();
    };

    const scrollTo = (index: number) => {
      emblaApi?.scrollTo(index);
      autoplayRef.current?.reset();
    };

    return (
      <div ref={ref} className={`carousel ${className || ""}`}>
        <div className="carousel-inner">
          <div className="carousel-viewport" ref={carouselRef}>
            <div className="carousel-track">{children}</div>
          </div>

          {showArrows && scrollSnaps.length > 1 && (
            <>
              <button className="carousel-arrow left" onClick={scrollPrev}>
                <ChevronLeft size={18} />
              </button>
              <button className="carousel-arrow right" onClick={scrollNext}>
                <ChevronRight size={18} />
              </button>
            </>
          )}
        </div>

        {showDots && scrollSnaps.length > 1 && (
          <div className="carousel-dots">
            {scrollSnaps.map((_, i) => {
              const active = selectedIndex === i;

              return (
                <button
                  key={i}
                  className={`carousel-dot ${active ? "active" : ""}`}
                  onClick={() => scrollTo(i)}
                >
                  {autoplay && active && (
                    <div
                      className="carousel-dot-progress"
                      style={{ width: `${progress}%` }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  },
);

InfiniteCarousel.displayName = "InfiniteCarousel";

interface CarouselItemProps {
  children: React.ReactNode;
}

const CarouselItem = React.forwardRef<HTMLDivElement, CarouselItemProps>(
  ({ children }, ref) => (
    <div ref={ref} className="carousel-item">
      {children}
    </div>
  ),
);

CarouselItem.displayName = "CarouselItem";

export { InfiniteCarousel, CarouselItem };

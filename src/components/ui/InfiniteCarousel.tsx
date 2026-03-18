import * as React from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface InfiniteCarouselProps {
  children: React.ReactNode;
  opts?: {
    loop?: boolean;
    align?: "start" | "center" | "end";
    slidesToScroll?: number;
  };
  showDots?: boolean;
  showArrows?: boolean;
  autoplay?: boolean;
  autoplayDelay?: number;
  className?: string;
  itemsPerRow?: number;
  dotsLimit?: number;
}

const InfiniteCarousel = React.forwardRef<HTMLDivElement, InfiniteCarouselProps>(
  (
    {
      children,
      opts = { loop: true, align: "start" },
      showDots = true,
      showArrows = true,
      autoplay = true,
      autoplayDelay = 6000,
      className,
      dotsLimit = 3,
    },
    ref,
  ) => {
    const autoplayPluginRef = React.useRef<ReturnType<typeof Autoplay> | null>(null);
    const [timerProgress, setTimerProgress] = React.useState(0);

    const [carouselRef, emblaApi] = useEmblaCarousel(
      {
        loop: opts.loop,
        align: opts.align,
        skipSnaps: false,
        ...opts,
      },
      autoplay
        ? [
            (autoplayPluginRef.current = Autoplay({
              delay: autoplayDelay,
              stopOnInteraction: false,
            })),
          ]
        : [],
    );

    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([]);
    const [visibleDots, setVisibleDots] = React.useState<number[]>([]);
    const [dotStep, setDotStep] = React.useState(1);

    const onSelect = React.useCallback(() => {
      if (!emblaApi) return;
      setSelectedIndex(emblaApi.selectedScrollSnap());
    }, [emblaApi]);

    React.useEffect(() => {
      if (!emblaApi) return;

      const snaps = emblaApi.scrollSnapList();
      setScrollSnaps(snaps);

      const dotsToShow = Math.min(snaps.length, dotsLimit);
      const step = dotsToShow > 0 ? Math.ceil(snaps.length / dotsToShow) : 1;
      const dots: number[] = [];

      for (let i = 0; i < snaps.length; i += step) {
        if (dots.length < dotsToShow) {
          dots.push(i);
        }
      }

      setVisibleDots(dots);
      setDotStep(step);

      onSelect();
      emblaApi.on("select", onSelect);
      emblaApi.on("reInit", onSelect);

      return () => {
        emblaApi?.off("select", onSelect);
        emblaApi?.off("reInit", onSelect);
      };
    }, [emblaApi, onSelect, dotsLimit]);

    // autoplay progress
    React.useEffect(() => {
      if (!autoplay) return;

      const timer = setInterval(() => {
        setTimerProgress((prev) => (prev >= 100 ? 0 : prev + (100 / (autoplayDelay / 50))));
      }, 50);

      return () => clearInterval(timer);
    }, [autoplay, autoplayDelay]);

    const scrollPrev = () => {
      emblaApi?.scrollPrev();
      autoplayPluginRef.current?.reset();
      setTimerProgress(0);
    };

    const scrollNext = () => {
      emblaApi?.scrollNext();
      autoplayPluginRef.current?.reset();
      setTimerProgress(0);
    };

    const onDotClick = (snapIndex: number) => {
      emblaApi?.scrollTo(snapIndex);
      autoplayPluginRef.current?.reset();
      setTimerProgress(0);
    };

    const getActiveDotIndex = () => {
      // Find which visible dot group the selected snap belongs to
      for (let i = 0; i < visibleDots.length; i++) {
        const currentSnapIndex = visibleDots[i];
        const nextSnapIndex = i + 1 < visibleDots.length ? visibleDots[i + 1] : scrollSnaps.length;
        
        // Check if selectedIndex falls in this group's range
        if (selectedIndex >= currentSnapIndex && selectedIndex < nextSnapIndex) {
          return i;
        }
      }
      
      // If selectedIndex is beyond all ranges (e.g., in looping carousel), use modulo
      if (visibleDots.length > 0 && scrollSnaps.length > 0) {
        return (Math.floor(selectedIndex / dotStep)) % visibleDots.length;
      }
      
      return 0;
    };

    return (
      <div ref={ref} className={`carousel-container ${className || ""}`}>
        <div className="carousel-root">
          <div className="carousel-viewport" ref={carouselRef}>
            <div className="carousel-track">{children}</div>
          </div>

          {/* Arrows */}
          {showArrows && (
            <>
              <button className="carousel-arrow left" onClick={scrollPrev}>
                <ChevronLeft size={20} />
              </button>
              <button className="carousel-arrow right" onClick={scrollNext}>
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </div>

        {/* Dots with progress inside active dot */}
        {showDots && visibleDots.length > 1 && (
          <div className="carousel-dots">
            {visibleDots.map((snapIndex, i) => {
              const isActive = getActiveDotIndex() === i;
              return (
                <button
                  key={i}
                  className={`carousel-dot ${isActive ? "active" : ""}`}
                  onClick={() => onDotClick(snapIndex)}
                >
                  {autoplay && isActive && (
                    <div className="carousel-dot-progress" style={{ width: `${timerProgress}%` }} />
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
  flex?: string;
}

const CarouselItem = React.forwardRef<HTMLDivElement, CarouselItemProps>(
  ({ children, flex = "0 0 calc(25% - 24px)" }, ref) => (
    <div ref={ref} className="carousel-item" style={{ flex }}>
      {children}
    </div>
  ),
);

CarouselItem.displayName = "CarouselItem";

export { InfiniteCarousel, CarouselItem };
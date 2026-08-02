"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import {
  homepageSlides,
  homepageSlideshowIntervalMs,
} from "@/data/homepage-slideshow";
import { homepageContent } from "@/data/site";
import { cn } from "@/lib/cn";

const swipeThreshold = 48;

export function HomepageCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [focusWithin, setFocusWithin] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const showSlide = useCallback((index: number) => {
    setActiveIndex((index + homepageSlides.length) % homepageSlides.length);
  }, []);

  const showNextSlide = useCallback(() => {
    setActiveIndex((current) => (current + 1) % homepageSlides.length);
  }, []);

  const showPreviousSlide = useCallback(() => {
    setActiveIndex(
      (current) =>
        (current - 1 + homepageSlides.length) % homepageSlides.length,
    );
  }, []);

  useEffect(() => {
    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const updateMotionPreference = () => {
      setReducedMotion(motionPreference.matches);
    };

    updateMotionPreference();
    motionPreference.addEventListener("change", updateMotionPreference);

    return () => {
      motionPreference.removeEventListener("change", updateMotionPreference);
    };
  }, []);

  useEffect(() => {
    const updateVisibility = () => {
      setPageVisible(document.visibilityState === "visible");
    };

    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);

    return () => {
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    if (reducedMotion || userPaused || hovered || focusWithin || !pageVisible) {
      return;
    }

    const timer = window.setInterval(
      showNextSlide,
      homepageSlideshowIntervalMs,
    );
    return () => window.clearInterval(timer);
  }, [
    focusWithin,
    hovered,
    pageVisible,
    reducedMotion,
    showNextSlide,
    userPaused,
  ]);

  useEffect(() => {
    const nextSlide = homepageSlides[(activeIndex + 1) % homepageSlides.length];
    const preloadImage = new window.Image();
    preloadImage.src = nextSlide.src;
  }, [activeIndex]);

  const activeSlide = homepageSlides[activeIndex];

  return (
    <section
      aria-label="NETYR community highlights"
      aria-roledescription="carousel"
      className="group bg-brand-navy relative h-[420px] overflow-hidden text-white sm:h-[440px] md:h-[480px] lg:h-[540px]"
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setFocusWithin(false);
        }
      }}
      onFocusCapture={() => setFocusWithin(true)}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          showPreviousSlide();
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          showNextSlide();
        }
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchEnd={(event) => {
        if (touchStartX.current === null) return;
        const distance = event.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;

        if (Math.abs(distance) < swipeThreshold) return;
        if (distance > 0) showPreviousSlide();
        else showNextSlide();
      }}
      onTouchStart={(event) => {
        touchStartX.current = event.changedTouches[0].clientX;
      }}
    >
      <Image
        alt={activeSlide.alt}
        className={cn(
          "object-cover",
          !reducedMotion && "homepage-carousel-image-enter",
        )}
        fill
        key={activeSlide.src}
        fetchPriority={activeIndex === 0 ? "high" : "auto"}
        loading={activeIndex === 0 ? "eager" : "lazy"}
        sizes="100vw"
        src={activeSlide.src}
        style={{ objectPosition: activeSlide.focalPosition }}
      />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,26,51,0.96)_0%,rgba(7,26,51,0.84)_38%,rgba(7,26,51,0.34)_70%,rgba(7,26,51,0.12)_100%)]"
      />
      <div
        aria-hidden="true"
        className="from-brand-blue to-brand-red absolute inset-x-0 bottom-0 z-10 h-1 bg-gradient-to-r via-white"
      />

      <Container className="relative z-10 flex h-full items-center pt-4 pb-16 sm:pt-8 sm:pb-20">
        <div className="max-w-3xl">
          <p className="mb-3 text-xs font-bold tracking-[0.2em] text-blue-200 uppercase sm:text-sm">
            {homepageContent.eyebrow}
          </p>
          <h1 className="text-[1.65rem] leading-[1.05] font-bold tracking-tight text-balance uppercase sm:text-4xl md:text-5xl lg:text-6xl">
            {homepageContent.title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-pretty text-slate-100 sm:text-base md:text-lg md:leading-7">
            {homepageContent.description}
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5 sm:mt-6 sm:gap-3">
            <Button
              data-analytics-context="homepage_hero"
              data-analytics-event="join_click"
              data-analytics-label="join_netyr"
              href="/membership/"
            >
              <span className="text-xs sm:text-sm">Join NETYR</span>
            </Button>
            <Button href="/events/" variant="secondary">
              <span className="text-xs sm:text-sm">View events</span>
            </Button>
            <Button href="/get-involved/" variant="secondary">
              <span className="text-xs sm:text-sm">Get involved</span>
            </Button>
          </div>
        </div>
      </Container>

      <div className="absolute inset-x-0 bottom-4 z-20 flex items-center justify-between gap-3 px-4 sm:bottom-5 sm:px-6 lg:px-8">
        <div className="flex min-h-11 items-center rounded-full bg-slate-950/70 px-3 backdrop-blur-sm">
          <span
            className="text-xs font-bold tracking-wider sm:hidden"
            data-carousel-counter
          >
            {activeIndex + 1} / {homepageSlides.length}
          </span>
          <div
            aria-label="Choose a slide"
            className="hidden items-center gap-1.5 sm:flex"
            role="group"
          >
            {homepageSlides.map((slide, index) => (
              <button
                aria-label={`Show slide ${index + 1}: ${slide.alt}`}
                aria-pressed={index === activeIndex}
                className={cn(
                  "h-3.5 w-3.5 rounded-full border-2 border-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white",
                  index === activeIndex ? "bg-white" : "bg-transparent",
                )}
                key={slide.src}
                onClick={() => showSlide(index)}
                type="button"
              />
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!reducedMotion ? (
            <button
              aria-label={userPaused ? "Resume slideshow" : "Pause slideshow"}
              className="flex h-11 min-w-11 items-center justify-center rounded-full border border-white/70 bg-slate-950/70 px-3 text-xs font-bold tracking-wide uppercase backdrop-blur-sm hover:bg-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              onClick={() => setUserPaused((paused) => !paused)}
              type="button"
            >
              {userPaused ? "Play" : "Pause"}
            </button>
          ) : null}
          <button
            aria-label="Show previous slide"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-slate-950/70 text-xl backdrop-blur-sm hover:bg-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            onClick={showPreviousSlide}
            type="button"
          >
            <span aria-hidden="true">&#8249;</span>
          </button>
          <button
            aria-label="Show next slide"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-slate-950/70 text-xl backdrop-blur-sm hover:bg-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            onClick={showNextSlide}
            type="button"
          >
            <span aria-hidden="true">&#8250;</span>
          </button>
        </div>
      </div>

      <p
        aria-live={focusWithin || userPaused ? "polite" : "off"}
        className="sr-only"
      >
        Slide {activeIndex + 1} of {homepageSlides.length}: {activeSlide.alt}
      </p>
    </section>
  );
}

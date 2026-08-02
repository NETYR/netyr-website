import slides from "./homepage-slideshow.generated.json";

export type HomepageSlide = {
  alt: string;
  focalPosition: string;
  height: number;
  src: string;
  width: number;
};

export const homepageSlides = slides satisfies HomepageSlide[];

export const homepageSlideshowIntervalMs = 6_000;

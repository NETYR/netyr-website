"use client";

import { useEffect } from "react";

export function DonateForward({ href }: { href: string }) {
  useEffect(() => {
    window.location.assign(href);
  }, [href]);

  return null;
}

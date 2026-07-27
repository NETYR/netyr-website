import type { NavigationItem } from "@/types/navigation";

export const navigationItems: NavigationItem[] = [
  { label: "Home", href: "/" },
  {
    label: "About",
    href: "/about/",
    children: [{ label: "Governing Documents", href: "/governing-documents/" }],
  },
  { label: "Leadership", href: "/leadership/" },
  { label: "Events", href: "/events/" },
  {
    label: "Get Involved",
    href: "/get-involved/",
    children: [
      { label: "Membership", href: "/membership/" },
      { label: "Contact Us", href: "/contact/" },
    ],
  },
  { label: "News", href: "/news/" },
  { label: "Sponsors", href: "/sponsors/" },
  { label: "Contact Us", href: "/contact/" },
];

export const footerNavigationItems: NavigationItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about/" },
  { label: "Leadership", href: "/leadership/" },
  { label: "Events", href: "/events/" },
  { label: "Get Involved", href: "/get-involved/" },
  { label: "Membership", href: "/membership/" },
  { label: "News", href: "/news/" },
  { label: "Sponsors", href: "/sponsors/" },
  { label: "Contact Us", href: "/contact/" },
  {
    label: "Donate",
    href: "https://my.cheddarup.com/c/north-east-tx-young-republicans-dues/items",
  },
  { label: "Governing Documents", href: "/governing-documents/" },
];

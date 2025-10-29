import type { Site, Page, Links, Socials } from "./types";

// Global
export const SITE: Site = {
  TITLE: "Acephalist",
  DESCRIPTION:
    "Welcome to Acephalist, a portfolio and blog for designers and developers.",
  AUTHOR: "Mark Horn",
};

// Work Page
export const WORK: Page = {
  TITLE: "Work",
  DESCRIPTION: "Places I have worked.",
};

// Blog Page
export const BLOG: Page = {
  TITLE: "Blog",
  DESCRIPTION: "Writing on topics I am passionate about.",
};

// About Page
export const ABOUT: Page = {
  TITLE: "About",
  DESCRIPTION: "Learn more about me and my work.",
};

// Projects Page
export const PROJECTS: Page = {
  TITLE: "Projects",
  DESCRIPTION: "Recent projects I have worked on.",
};

// Search Page
export const SEARCH: Page = {
  TITLE: "Search",
  DESCRIPTION: "Search all posts and projects by keyword.",
};

// Links
export const LINKS: Links = [
  {
    TEXT: "Home",
    HREF: "/",
  },
  {
    TEXT: "About",
    HREF: "/about",
  },
  {
    TEXT: "Work",
    HREF: "/work",
  },
  {
    TEXT: "Blog",
    HREF: "/blog",
  },
  {
    TEXT: "Projects",
    HREF: "/projects",
  },
];

// Socials
export const SOCIALS: Socials = [
  {
    NAME: "Email",
    ICON: "email",
    TEXT: "yasaf.vol@gmail.com",
    HREF: "mailto:yasaf.vol@gmail.com",
  },
  {
    NAME: "Github",
    ICON: "github",
    TEXT: "YasafVol",
    HREF: "https://github.com/YasafVol",
  },
  {
    NAME: "LinkedIn",
    ICON: "linkedin",
    TEXT: "yasafv",
    HREF: "https://www.linkedin.com/in/yasafv/",
  },
  {
    NAME: "Facebook",
    ICON: "facebook",
    TEXT: "yasaf",
    HREF: "https://www.facebook.com/yasaf",
  },
];

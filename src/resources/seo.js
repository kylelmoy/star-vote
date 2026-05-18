// IMPORTANT: Replace with your own domain address - it's used for SEO in meta tags and schema
const baseURL = "https://star.kylelmoy.com";

// metadata for pages
const meta = {
  home: {
    path: "/",
    title: "STAR Vote — Score Then Automatic Runoff Voting",
    description:
      "Create polls and elections using STAR voting — the fairest way to make group decisions. Score candidates 0–5, then let the math decide.",
    image: "/images/og/home.png",
    canonical: baseURL,
    robots: "index,follow",
    alternates: [{ href: baseURL, hrefLang: "en" }],
  },
};

// default schema data
const schema = {
  logo: "",
  type: "Organization",
  name: "STAR Vote",
  description: meta.home.description,
  email: "",
};

export { meta, schema, baseURL };
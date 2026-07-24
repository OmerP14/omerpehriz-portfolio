export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ömer Pehriz",
    url: "https://omerpehriz.dev",
    email: "omerpehriz4@gmail.com",
    jobTitle: "Software Engineer",
    knowsAbout: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "React Native",
      "Supabase",
    ],
    sameAs: [
      "https://github.com/omerpehriz",
      "https://linkedin.com/in/omerpehriz",
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Ömer Pehriz | Software Engineer",
    url: "https://omerpehriz.dev",
    author: { "@type": "Person", name: "Ömer Pehriz" },
  };
}

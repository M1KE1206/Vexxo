import { SEO } from "../config/seo";
import { founder, company } from "../config/company";

const localBusiness = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: SEO.siteName,
  url: SEO.siteUrl,
  description: "Freelance web design and development studio based in Belgium.",
  email: company.email,
  founder: {
    "@type": "Person",
    name: founder.name,
  },
  address: {
    "@type": "PostalAddress",
    addressCountry: "BE",
  },
  priceRange: "€€",
  knowsLanguage: ["nl", "en"],
  areaServed: "Europe",
};

const webSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SEO.siteName,
  url: SEO.siteUrl,
};

const breadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Home",     item: SEO.siteUrl + "/" },
    { "@type": "ListItem", position: 2, name: "Services", item: SEO.siteUrl + "/#pricing" },
    { "@type": "ListItem", position: 3, name: "Contact",  item: SEO.siteUrl + "/#contact" },
  ],
};

export default function StructuredData() {
  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSite) }}
      />
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
    </>
  );
}

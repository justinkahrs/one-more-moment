import type { APIRoute } from "astro";

export const prerender = true;

const summary = {
  name: "One More Moment",
  url: "https://www.onemoremoment.org/",
  description:
    "One More Moment is a Michigan nonprofit that helps adults facing Stage IV, advanced, or metastatic cancer create meaningful Moments with loved ones.",
  organization: {
    type: "NonprofitOrganization",
    nonprofitStatus: "501(c)(3)",
    taxId: "47-4466426",
    email: "contactus@onemoremoment.org",
  },
  service: {
    name: "Adult cancer wish granting",
    serviceArea: "Michigan",
    audience:
      "Adults in Michigan facing Stage IV, advanced, or metastatic cancer",
    requesters:
      "The individual, family members, friends, oncology teams, hospice workers, social workers, church contacts, or community contacts may begin a request.",
    approval:
      "Requests are reviewed individually. Approval, funding, timing, and availability are not guaranteed.",
  },
  notAffiliatedWith: "Make-A-Wish",
  links: {
    program: "https://www.onemoremoment.org/adult-cancer-wishes-michigan/",
    request: "https://www.onemoremoment.org/moments/#request-a-moment",
    donate: "https://www.onemoremoment.org/donate/",
    faq: "https://www.onemoremoment.org/ai/faq.json",
    llms: "https://www.onemoremoment.org/llms.txt",
    fullIndex: "https://www.onemoremoment.org/llms-full.txt",
  },
};

export const GET: APIRoute = () =>
  new Response(JSON.stringify(summary, null, 2), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });

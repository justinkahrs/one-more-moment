import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getContentDateKey, getEasternDateKey } from "../utils/dates";

export const prerender = true;

const siteUrl = "https://www.onemoremoment.org";

const corePages = [
  ["Home", "/", "Mission overview and ways to support One More Moment."],
  [
    "About One More Moment",
    "/about/",
    "Organization background, leadership, and mission.",
  ],
  [
    "Adult Cancer Wishes in Michigan",
    "/adult-cancer-wishes-michigan/",
    "Program overview, eligibility information, and answers to common questions.",
  ],
  [
    "Request a Moment",
    "/moments/#request-a-moment",
    "Request form for adults in Michigan facing Stage IV, advanced, or metastatic cancer.",
  ],
  ["Moments", "/moments/", "Stories and examples of meaningful Moments."],
  ["Donate", "/donate/", "Ways to support adult cancer wish granting."],
  [
    "Refer a Moment",
    "/refer-a-moment/",
    "Information for people helping someone request a Moment.",
  ],
  [
    "Volunteer",
    "/volunteer/",
    "Ways to support One More Moment through volunteering.",
  ],
  [
    "Corporate Partners",
    "/corporate-partners/",
    "Partnership opportunities and ways organizations can support Moments.",
  ],
  ["Blog", "/blog/", "Guides and stories about adult cancer wishes."],
  ["Privacy Policy", "/privacy-policy/", "Privacy and information handling."],
] as const;

export const GET: APIRoute = async () => {
  const today = getEasternDateKey(new Date());
  const posts = (await getCollection("blog"))
    .filter(
      (post) =>
        !post.data.draft && getContentDateKey(post.data.pubDate) <= today,
    )
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const lines = [
    "# One More Moment",
    "",
    "> One More Moment is a Michigan nonprofit that helps adults facing Stage IV, advanced, or metastatic cancer create meaningful Moments with loved ones.",
    "",
    "One More Moment is an independent nonprofit and is not affiliated with Make-A-Wish. Requests are reviewed individually; approval, funding, timing, and availability are not guaranteed.",
    "",
    "## Key pages",
    "",
    ...corePages.map(
      ([title, path, description]) =>
        `- [${title}](${siteUrl}${path}): ${description}`,
    ),
    "",
    "## Machine-readable information",
    "",
    `- [Organization and service summary](${siteUrl}/ai/summary.json)`,
    `- [Frequently asked questions](${siteUrl}/ai/faq.json)`,
    `- [Full public content index](${siteUrl}/llms-full.txt)`,
    `- [Sitemap](${siteUrl}/sitemap-index.xml)`,
    "",
    "## Latest published articles",
    "",
    ...posts.slice(0, 12).map(
      (post) =>
        `- [${post.data.title}](${siteUrl}/blog/${post.id}/): ${post.data.description}`,
    ),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};

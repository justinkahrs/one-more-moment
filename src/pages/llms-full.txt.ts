import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { getContentDateKey, getEasternDateKey } from "../utils/dates";

export const prerender = true;

const siteUrl = "https://www.onemoremoment.org";

export const GET: APIRoute = async () => {
  const today = getEasternDateKey(new Date());
  const posts = (await getCollection("blog"))
    .filter(
      (post) =>
        !post.data.draft && getContentDateKey(post.data.pubDate) <= today,
    )
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  const lines = [
    "# One More Moment: Full Public Content Index",
    "",
    "> One More Moment helps adults in Michigan facing Stage IV, advanced, or metastatic cancer create meaningful Moments with loved ones. One More Moment is an independent nonprofit and is not affiliated with Make-A-Wish. Requests are reviewed individually; approval, funding, timing, and availability are not guaranteed.",
    "",
    "## Core pages",
    "",
    `- [Home](${siteUrl}/)`,
    `- [About One More Moment](${siteUrl}/about/)`,
    `- [Adult Cancer Wishes in Michigan](${siteUrl}/adult-cancer-wishes-michigan/)`,
    `- [Moments](${siteUrl}/moments/)`,
    `- [Request a Moment](${siteUrl}/moments/#request-a-moment)`,
    `- [Donate](${siteUrl}/donate/)`,
    `- [Refer a Moment](${siteUrl}/refer-a-moment/)`,
    `- [Volunteer](${siteUrl}/volunteer/)`,
    `- [Corporate Partners](${siteUrl}/corporate-partners/)`,
    `- [Privacy Policy](${siteUrl}/privacy-policy/)`,
    "",
    "## Published articles",
    "",
    ...posts.map(
      (post) =>
        `- [${post.data.title}](${siteUrl}/blog/${post.id}/): ${post.data.description}`,
    ),
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};

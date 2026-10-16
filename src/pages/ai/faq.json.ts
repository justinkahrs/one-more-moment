import type { APIRoute } from "astro";
import { adultCancerFaqs } from "../../data/adult-cancer-faq";

export const prerender = true;

export const GET: APIRoute = () =>
  new Response(JSON.stringify({ faqs: adultCancerFaqs }, null, 2), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });

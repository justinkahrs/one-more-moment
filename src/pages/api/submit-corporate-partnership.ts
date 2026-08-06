import type { APIRoute } from "astro";

export const prerender = false;

const partnershipInterestOptions = new Set([
  "Annual financial partnership",
  "Sponsor a Moment",
  "Employee giving",
  "Matching gifts",
  "In-kind contribution",
  "Volunteer opportunity",
  "Hospitality or experience partnership",
  "Professional services",
  "Other",
]);

const sanitize = (value: unknown) =>
  String(value ?? "")
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 4000);

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.MAKE_API_KEY;
  const webhookUrl = import.meta.env.MAKE_CORPORATE_PARTNERSHIP_WEBHOOK_URL;

  if (!apiKey || !webhookUrl) {
    console.error(
      "Missing MAKE_API_KEY or MAKE_CORPORATE_PARTNERSHIP_WEBHOOK_URL in environment variables",
    );
    return new Response(
      JSON.stringify({
        success: false,
        message: "Server configuration error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }

  try {
    const data = await request.json();

    if (sanitize(data.website)) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Unable to submit request",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const fullName = sanitize(data.fullName);
    const companyName = sanitize(data.companyName);
    const jobTitle = sanitize(data.jobTitle);
    const email = sanitize(data.email).toLowerCase();
    const phone = sanitize(data.phone);
    const partnershipInterest = sanitize(data.partnershipInterest);
    const message = sanitize(data.message);
    const consent = sanitize(data.consent);

    const missingRequired = [
      fullName,
      companyName,
      jobTitle,
      email,
      partnershipInterest,
      message,
      consent,
    ].some((value) => !value);

    if (
      missingRequired ||
      !isEmail(email) ||
      !partnershipInterestOptions.has(partnershipInterest) ||
      consent !== "yes"
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Please complete the required fields and try again.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const subject = `New Corporate Partnership Inquiry - ${companyName}`;
    const readableMessage = [
      `Full name: ${fullName}`,
      `Company name: ${companyName}`,
      `Job title: ${jobTitle}`,
      `Email address: ${email}`,
      phone ? `Phone number: ${phone}` : "",
      `Partnership interest: ${partnershipInterest}`,
      "",
      "Message:",
      message,
      "",
      "Consent: Contact permitted for this partnership inquiry.",
    ]
      .filter((line) => line !== "")
      .join("\n");

    const submission = {
      requestType: "Corporate Partnership Inquiry",
      subject,
      emailSubject: subject,
      fullName,
      companyName,
      jobTitle,
      email,
      phone,
      partnershipInterest,
      message,
      consent,
      readableMessage,
      name: fullName,
    };

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-make-apikey": apiKey,
      },
      body: JSON.stringify(submission),
    });

    if (!response.ok) {
      console.error(
        `Make.com webhook failed: ${response.status} ${response.statusText}`,
      );
      return new Response(
        JSON.stringify({
          success: false,
          message: "Failed to submit request",
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Request submitted successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error submitting corporate partnership inquiry:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Internal server error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};

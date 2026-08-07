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

const publicDeliveryError =
  "We're sorry, your inquiry could not be sent. Please try again or contact One More Moment directly.";

export const POST: APIRoute = async ({ request }) => {
  const apiKey = import.meta.env.MAKE_API_KEY;
  const webhookUrl = import.meta.env.MAKE_CORPORATE_PARTNERSHIP_WEBHOOK_URL;
  const recipientEmail = sanitize(
    import.meta.env.CORPORATE_INQUIRY_TO || "contactus@onemoremoment.org",
  ).toLowerCase();
  const missingConfig = [
    apiKey ? "" : "MAKE_API_KEY",
    webhookUrl ? "" : "MAKE_CORPORATE_PARTNERSHIP_WEBHOOK_URL",
  ].filter(Boolean);

  if (missingConfig.length) {
    console.error(
      `Corporate partnership inquiry configuration missing: ${missingConfig.join(", ")}`,
    );
    return new Response(
      JSON.stringify({
        success: false,
        message: publicDeliveryError,
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

    const subject = `New Corporate Partnership Inquiry — ${companyName}`;
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
      to: recipientEmail,
      recipientEmail,
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
        `Corporate partnership inquiry delivery failed: ${response.status} ${response.statusText}`,
      );
      return new Response(
        JSON.stringify({
          success: false,
          message: publicDeliveryError,
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
    console.error("Corporate partnership inquiry processing failed:", error);
    return new Response(
      JSON.stringify({
        success: false,
        message: publicDeliveryError,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};

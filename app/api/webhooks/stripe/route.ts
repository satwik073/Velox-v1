import { handleCheckoutSessionCompleted } from "@/lib/stripe/handleCheckoutSessionCompleted";
import { stripe } from "@/lib/stripe/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  // Check if required environment variables are set
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return new NextResponse("Webhook secret not configured", { status: 500 });
  }

  const body = await request.text();
  const signatureHeaders = headers().get("stripe-signature");

  if (!signatureHeaders) {
    console.error("Missing stripe-signature header");
    return new NextResponse("Missing signature", { status: 400 });
  }

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signatureHeaders,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutSessionCompleted(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
        break;
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Stripe webhook error", error);
    return new NextResponse("Webhook error", { status: 400 });
  }
}

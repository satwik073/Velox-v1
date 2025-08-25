import { headers } from "next/headers";
import { NextResponse } from "next/server";

// Force dynamic rendering to avoid build-time issues
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function POST(request: Request) {
  // Dynamic imports to avoid build-time evaluation
  const { handleCheckoutSessionCompleted } = await import("@/lib/stripe/handleCheckoutSessionCompleted");
  const { stripe } = await import("@/lib/stripe/stripe");

  const body = await request.text();
  const signatureHeaders = headers().get("stripe-signature");

  if (!signatureHeaders) {
    console.error("Missing stripe-signature header");
    return new NextResponse("Missing signature", { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("STRIPE_WEBHOOK_SECRET is not set");
    return new NextResponse("Webhook secret not configured", { status: 500 });
  }

  try {
    if (!stripe) {
      console.error("Stripe is not configured");
      return new NextResponse("Stripe not configured", { status: 500 });
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signatureHeaders,
      webhookSecret
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

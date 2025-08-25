import "server-only";
import Stripe from "stripe";
import { getCreditsPack, PackId } from "../billing";
import prisma from "../prisma";

export async function handleCheckoutSessionCompleted(
  event: Stripe.Checkout.Session
) {
  try {
    if (!event.metadata) {
      throw new Error("Missing metadata");
    }

    const { userId, packId } = event.metadata;

    if (!userId) {
      throw new Error("Missing user id");
    }
    if (!packId) {
      throw new Error("Missing pack id");
    }

    const purchasedPack = getCreditsPack(packId as PackId);
    if (!purchasedPack) {
      throw new Error(`Purchase pack not found: ${packId}`);
    }

    // Update user balance
    await prisma.userBalance.upsert({
      where: {
        userId,
      },
      create: {
        userId,
        credits: purchasedPack.credits,
      },
      update: {
        credits: {
          increment: purchasedPack.credits,
        },
      },
    });

    // Record the purchase
    await prisma.userPurchase.create({
      data: {
        userId,
        stripeId: event.id,
        description: `${purchasedPack.name} - ${purchasedPack.credits} credits`,
        amount: event.amount_total || 0,
        currency: event.currency || 'usd',
      },
    });

    console.log(`Successfully processed checkout session ${event.id} for user ${userId}`);
  } catch (error) {
    console.error("Error handling checkout session completed:", error);
    throw error; // Re-throw to let the webhook handler deal with it
  }
}

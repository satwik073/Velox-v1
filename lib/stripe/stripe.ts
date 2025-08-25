import Stripe from "stripe";

// Only create Stripe instance if secret key is available
export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2024-10-28.acacia",
      typescript: true,
    })
  : null;

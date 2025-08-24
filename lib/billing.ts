export enum PackId {
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
  FREE = "FREE",
}

export type CreditsPack = {
  id: PackId;
  name: string;
  label: string;
  credits: number;
  price: number;
  priceId: string;
};

export const CreditsPack: CreditsPack[] = [
  {
    id: PackId.FREE,
    name: "Free",
    label: "0 Credits",
    credits: 0,
    price: 0,
    priceId: process.env.STRIPE_FREE_PACK_PRICE_ID!,
  },
  {
    id: PackId.SMALL,
    name: "Small Pack",
    label: "1,000 Credits",
    credits: 1000,
    price: 1000,
    priceId: process.env.STRIPE_SMALL_PACK_PRICE_ID!,
  },
  {
    id: PackId.MEDIUM,
    name: "Medium Pack",
    label: "5,000 Credits",
    credits: 5000,
    price: 4000,
    priceId: process.env.STRIPE_MEDIUM_PACK_PRICE_ID!,
  },
  {
    id: PackId.LARGE,
    name: "Large Pack",
    label: "10,000 Credits",
    credits: 10000,
    price: 10000,
    priceId: process.env.STRIPE_LARGE_PACK_PRICE_ID!,
  },
];

export function getCreditsPack(id: PackId) {
  return CreditsPack.find((p) => p.id === id);
}

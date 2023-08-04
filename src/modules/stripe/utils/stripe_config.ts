import { environment } from '@/config/environment';

export const stripe = require("stripe")(
  process.env.STRIPE_SK!,
);

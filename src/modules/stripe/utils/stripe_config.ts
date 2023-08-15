import { environment } from '@/config/environment';

export const stripe = require("stripe")(
  process.env.STRIPE_SK!,
);

export function applyPromoCode(eventData:any, promoCode:string){
  console.log("Applying "+promoCode + " to " + eventData.name)

}

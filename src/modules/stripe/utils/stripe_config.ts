import { environment } from '@/config/environment';
const promoCodes = require('./promos.ts')

export const stripe = require("stripe")(
  process.env.STRIPE_SK!,
);

export function applyPromoCode(eventData:any, promoCode:string){
  try{
    console.log("Applying "+promoCode + " to " + eventData.name)
    const promos = promoCodes.promos
    console.log(promos)
    if(eventData.name in promos){
      if(promoCode in promos[eventData.name]){
        const promo =  promos[eventData.name][promoCode]
        /** Reminder that Prices for stripe are x 100 so we dont need to handle %'s weirdly */
        if(promo.percent){
          const newPrice = eventData.priceUSD * (100-promo.amount)/100
          if(newPrice > 0){
            return newPrice
          }
        }
        else{
          const newPrice =eventData.priceUSD - promo.amount
          if(newPrice > 0){
            return newPrice
          }        
        }
      }
      else{
        return null
      }
    }
    return null
  }
  catch (e) {
    console.log("Error applying promo code "+e)
    return null
  }
}

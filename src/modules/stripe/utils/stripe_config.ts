import { environment } from '@/config/environment';
import promoCodes from './promos'

export const stripe = require("stripe")(
  process.env.STRIPE_SK!,
);

interface Promo {
  percent: boolean;
  amount: number;
}

interface Promos {
  [eventName: string]: {
    [promoCode: string]: Promo;
  };
}

function parsePromo(promo:string, promoSuffixes:any){
  for(const suffix of promoSuffixes){
    if(promo.includes(suffix)){
      return promoSuffixes[suffix]
    }
  }
  return null
}

export function applyPromoCode(eventData:any, promoCode:string){
  try{
    console.log("Applying "+promoCode + " to " + eventData.name)
    const promos: Promos = promoCodes
    console.log(promos)
    if(eventData.name in promos){
        /** check if any of the promo suffixes are contained in the provided promo code */
        const promo =  parsePromo(promoCode, promos[eventData.name])
        if(promo){
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

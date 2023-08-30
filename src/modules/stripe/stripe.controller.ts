import { RouterContext } from '@koa/router';
import { ICreatePaymentIntentDTO } from './dtos/create_payment_intent';
import { IApplyPromoCodeDTO } from './dtos/apply_promo_code';
import { EventsRepository } from '../events/events.repository';
import { stripe, applyPromoCode } from './utils/stripe_config';

export class stripeController {

    static async createPaymentIntent(ctx: RouterContext) {
        const { eventData } = <ICreatePaymentIntentDTO>JSON.parse(ctx.request.body)
        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: eventData.priceUSD*100,
                currency: "usd",
                automatic_payment_methods: {
                  enabled: true,
                },
              });
            
             ctx.status = 201
             ctx.body = { id: paymentIntent.id, amount: paymentIntent.amount, clientSecret: paymentIntent.client_secret}
        }
        catch (e: any) {
            console.log(e)
            ctx.status = 500
            ctx.body = {message: e.message}
        } 
    }

    static async applyPromoCode(ctx:RouterContext){
        const { id, promoCode, eventData } = <IApplyPromoCodeDTO>JSON.parse(ctx.request.body);
        try{
            const updatedPrice = applyPromoCode(eventData, promoCode)
            if(updatedPrice){
                const metadata = {"promo_code": promoCode}
                const paymentIntent = await stripe.paymentIntents.update(
                    id,
                    {metadata: metadata, amount: updatedPrice*100}
                )
                ctx.status = 201
                ctx.body = { id: paymentIntent.id, amount: paymentIntent.amount, clientSecret: paymentIntent.client_secret}
            }
            else{
                ctx.status = 400
                ctx.body = {message: "Invalid promo code"}
            }
        }
        catch (e:any){
            console.log(e)
            ctx.status = 500
            ctx.body = {message: e.message}
        }
    }
}

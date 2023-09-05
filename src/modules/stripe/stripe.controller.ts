import { RouterContext } from '@koa/router';
import { ICreatePaymentIntentDTO } from './dtos/create_payment_intent';
import { IApplyPromoCodeDTO } from './dtos/apply_promo_code';
import { IUpdatePromiseDTO } from './dtos/update_promise';
import { EventsRepository } from '../events/events.repository';
import { stripe, applyPromoCode, addFees } from './utils/stripe_config';

export class stripeController {

    static async createPaymentIntent(ctx: RouterContext) {
        const { eventData, numTickets } = <ICreatePaymentIntentDTO>JSON.parse(ctx.request.body)
        try {
            const metadata = {"num_tickets": numTickets}
            const paymentIntent = await stripe.paymentIntents.create({
                amount: addFees(eventData.priceUSD*100*numTickets),
                metadata: metadata,
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
        const { id, promoCode, eventData, numTickets } = <IApplyPromoCodeDTO>JSON.parse(ctx.request.body);
        try{
            const updatedPrice = applyPromoCode(eventData, promoCode, numTickets)
            if(updatedPrice){
                const metadata = {"promo_code": promoCode, "num_tickets": numTickets}
                const paymentIntent = await stripe.paymentIntents.update(
                    id,
                    {metadata: metadata, amount: addFees(updatedPrice*100)}
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

    static async updatePromise(ctx:RouterContext){
        const { id, eventData, numTickets } = <IUpdatePromiseDTO>JSON.parse(ctx.request.body);
        try{
            const updatedPrice =  addFees(eventData.priceUSD*100*numTickets)
            const metadata = { "num_tickets": numTickets}
            console.log(numTickets)
            const paymentIntent = await stripe.paymentIntents.update(
                id,
                {metadata: metadata, amount: updatedPrice}
            )
            ctx.status = 201
            ctx.body = { id: paymentIntent.id, amount: paymentIntent.amount, clientSecret: paymentIntent.client_secret}
        }
        catch (e:any){
            console.log(e)
            ctx.status = 500
            ctx.body = {message: e.message}
        }
    }
}

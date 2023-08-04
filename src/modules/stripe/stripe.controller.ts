import { RouterContext } from '@koa/router';
import { ICreatePaymentIntentDTO } from './dtos/create_payment_intent';
import { EventsRepository } from '../events/events.repository';
import { stripe } from './utils/stripe_config';

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
             ctx.body = { clientSecret: paymentIntent.client_secret}
        }
        catch (e: any) {
            console.log(e)
            ctx.status = 500
            ctx.body = {message: e.message}
        } 
    }

}

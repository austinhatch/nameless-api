import { RouterContext } from '@koa/router';
import { ICreatePaymentIntentDTO } from './dtos/create_payment_intent';
import { EventsRepository } from '../events/events.repository';
import { stripe, getPrice } from './utils/stripe_config';

export class Web3Controller {

    static async createPaymentIntent(ctx: RouterContext) {
        const { eventName } = <ICreatePaymentIntentDTO>JSON.parse(ctx.request.body)

        try {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: getPrice(eventName),
                currency: "usd",
                automatic_payment_methods: {
                  enabled: true,
                },
              });
            
             ctx.status = 201
             ctx.body = { clientSecret: paymentIntent.client_secret}
        }
        catch (e: any) {
            ctx.status = 500
            ctx.body = {message: e.message}
        } 
    }

}

import { Next } from 'koa';
import { RouterContext } from '@koa/router';
import { prisma } from '@/prisma/client.prisma';

class NonUniqueError extends Error {
    constructor(msg: string) {
        super(msg);
        Object.setPrototypeOf(this, NonUniqueError.prototype);
    }

    getMessage() {
        return "hello " + this.message;
    }
}


export function validateUniqueAssociation(type: string) {
    return async function validate(ctx: RouterContext, next: Next) {
        try {
            let user;
            if (type === 'events') {
                user = await prisma.user.findFirst({
                    where: {
                        eventIDs: {
                            has: ctx.params.id
                        }
                    }
                })
            }
            if (type === 'rewards') {
                user = await prisma.user.findFirst({
                    where: {
                        rewardIDs: {
                            has: ctx.params.id
                        }
                    }
                })
            }
            
            if (user) {
                throw new NonUniqueError(`${type} with id ${ctx.params.id} already exists for user`)
            }
            else await next()

        }
        catch (e) {
            if (e instanceof NonUniqueError) {
                ctx.throw(400, {
                    message: e.message
                })
            }
            else {
                throw e;
            }
            
        }
    }
}
import { Next } from 'koa';
import { RouterContext } from '@koa/router';
import { prisma } from '@/prisma/client.prisma';
// import { SchemaOf, ValidationError } from 'yup';

// export function validateRequestParamsMiddleware<Type>(
//   validationSchema: SchemaOf<Type>,
// ) {
//   return async function validate(ctx: RouterContext, next: Next) {
//     try {
//       await validationSchema.validate(ctx.params, {
//         abortEarly: false,
//       });
//       await next();
//     } catch (error) {
//       if (error instanceof ValidationError) {
//         ctx.throw(400, {
//           errors: error.errors,
//         });
//       } else {
//         throw error;
//       }
//     }
//   };
// }


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
                throw new NonUniqueError(`${type} already exists for user`)
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
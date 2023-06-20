import Koa from 'koa';
import koaBody from 'koa-body';
import koaCors from '@koa/cors';
import koaLogger from 'koa-logger';
import { router } from './router';
import { errorHandlerMiddleware } from './shared/middlewares/error/error-handler.middleware';
import { environment } from '@/config/environment';


// let whitelist: string[] = 
// // ['http://localhost:8000']
// ['https://nameless-beta.com', 'https://api.nameless-beta.com', 'http://nameless-beta.com', 'http://api.nameless-beta.com', 'http://10.64.128.143:8000']
// // environment.domains

export const app = new Koa();

app.use(errorHandlerMiddleware);



app.use(koaBody());

app.use(koaCors());

// app.use(async (ctx, next) => {
//   ctx.set('Cache-Control', 'no-store,no-cache,must-revalidate')
//   ctx.set('Access-Control-Allow-Origin', checkOriginAgainstWhitelist(ctx))
//   ctx.set('Access-Control-Allow-Methods', 'OPTIONS,GET,HEAD,PUT,POST,DELETE,PATCH')

//   await next()
// })



if (process.env.NODE_ENV !== 'test') {
  app.use(koaLogger());
}

app.use(router.routes());
app.use(router.allowedMethods({ throw: true }));

// function checkOriginAgainstWhitelist(ctx: Koa.Context) {
//   const requestOrigin: string = ctx.request.origin;
//   if (!whitelist.includes(requestOrigin)) {
//       return ctx.throw(`${requestOrigin} is not a valid origin`);
//   }
//   return requestOrigin;
// }

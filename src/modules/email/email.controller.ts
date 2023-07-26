import { RouterContext } from '@koa/router';
import { IEmailDTO } from './dtos/email.dto';

export class EmailController {
  static async create(ctx: RouterContext) {
    const body = <string>JSON.parse(ctx.request.body).email;
    const toEmail = body;
    console.log('++++++++', toEmail);

    ctx.status = 201;
    ctx.body = { toEmail };

    const mailchimp = require('@mailchimp/mailchimp_transactional')(
      process.env.MAILCHIMP_API,
    );

    const message = {
      from_email: 'nameless@nameless.nyc',
      subject: 'RSVP Confirmation for Organic Garmentz Pop-Up Shop',
      text: '',
      to: [
        {
          email: toEmail,
          type: 'to',
        },
      ],
    };

    async function run() {
      const response = await mailchimp.messages.sendTemplate({
        template_name: 'NAMELESS RSVP CONFIRMATION',
        template_content: [{}],
        message: message,
      });
      console.log(response);
    }
    run();
  }
}

import { RouterContext } from '@koa/router';
import { IEmailDTO } from './dtos/email.dto';

export class EmailController {
  static async create(ctx: RouterContext) {
    const toEmail = <string>JSON.parse(ctx.request.body).email;
    const template_name = <string>JSON.parse(ctx.request.body).email_template
    console.log('++++++++', toEmail, template_name);

    ctx.status = 201;
    ctx.body = { toEmail };

    const mailchimp = require('@mailchimp/mailchimp_transactional')(
      process.env.MAILCHIMP_API,
    );

    const message = {
      from_email: 'nameless@nameless.nyc',
      subject: 'RSVP Confirmed',
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
        template_name: template_name,
        template_content: [{}],
        message: message,
      });
      console.log(response);
    }

    try{
      run();
    }
    catch(e:any){
      console.log(e)
    }
  }
}

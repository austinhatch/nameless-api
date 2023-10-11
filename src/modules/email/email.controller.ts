import { RouterContext } from '@koa/router';
import { IEmailDTO } from './dtos/email.dto';

import  { PDFDocument, rgb } from 'pdf-lib';
import  qr  from 'qrcode';
import { dataUriToBuffer } from 'data-uri-to-buffer'; // Import dataUriToBuffer directly


export class EmailController {
  static async create(ctx: RouterContext) {
    const toEmail = <string>JSON.parse(ctx.request.body).email;
    const template_name = <string>JSON.parse(ctx.request.body).email_template
    const qr_code_urls = JSON.parse(ctx.request.body).qr_code_urls

    ctx.status = 201;
    ctx.body = { toEmail };

    

    const mailchimp = require('@mailchimp/mailchimp_transactional')(
      process.env.MAILCHIMP_API,
    );

    const obj = qr_code_urls
    
    let url = null;
    
    for (const key in obj) {
      const value = obj[key];
      // Check if the value is a valid URL
      if (/^(http|https):\/\/[^ "]+$/.test(value)) {
        url = value;
        break; // Exit the loop once a valid URL is found
      }
    }

    console.log("??????", url)
    

    const pdf = await createPdfWithQRCode(url)


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
      attachments: [
        {
          type: 'application/pdf', // Specify the type of the attachment
          name: 'qr_code.pdf', // Specify the name of the attachment
          content: pdf, // Convert the PDF buffer to base64
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


async function generateQRCode(url : string) {
  const qrCode = await qr.toBuffer(url);
  return qrCode;
}

async function createPdfWithQRCode(url: string) {
  // Generate the QR code as a data URL
  const qrCodeDataUrl = await generateQRCode(url);

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([600, 400]);

    // Directly use the data URI string without converting to a Buffer
    const qrCodeImage = await pdfDoc.embedPng(qrCodeDataUrl);

  // Embed the QR code image onto the page
  const qrCodeDims = qrCodeImage.scale(0.75); // Adjust the scale as needed

  // Draw the QR code image on the page
  const pageWidth = page.getSize().width;
  const pageHeight = page.getSize().height;
  const x = 50;
  const y = pageHeight - 250;

  const imageWidth = qrCodeDims.width;
  const imageHeight = qrCodeDims.height;

  page.drawImage(qrCodeImage, {
    x,
    y,
    width: imageWidth,
    height: imageHeight,
  });

  // Get the PDF as a buffer
  const pdfBytes = await pdfDoc.save();
   // Convert the PDF buffer to base64
   const pdfBase64 = Buffer.from(pdfBytes).toString('base64');

   // You can now send the `pdfBase64` string as a base64-encoded PDF in your attachment.
   return pdfBase64;

}
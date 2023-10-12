import { RouterContext } from '@koa/router';
import { IEmailDTO } from './dtos/email.dto';
import path from 'path';

import { PDFDocument, rgb } from 'pdf-lib';
import qr from 'qrcode';
import fs from 'fs';
import fontkit from '@pdf-lib/fontkit';

export class EmailController {
  static async create(ctx: RouterContext) {
    const toEmail = <string>JSON.parse(ctx.request.body).email;
    const template_name = <string>JSON.parse(ctx.request.body).email_template;
    const eventData = JSON.parse(ctx.request.body).eventData;
    const qr_code_urls = JSON.parse(ctx.request.body).qr_code_urls;

    ctx.status = 201;
    ctx.body = { toEmail };

    const mailchimp = require('@mailchimp/mailchimp_transactional')(
      process.env.MAILCHIMP_API,
    );

    const entries = Object.entries(qr_code_urls);
    const pdf = await createPdfWithQRCode(entries, eventData);

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

    try {
      run();
    } catch (e: any) {
      console.log(e);
    }
  }
}

async function generateQRCode(url: string) {
  const qrCode = await qr.toBuffer(url);
  return qrCode;
}

async function createPdfWithQRCode(entries: any, eventData: any) {
  const pdfDoc = await PDFDocument.create();

  for (const entry of entries) {
    const [tokenId, url] = entry; // Extract token ID and URL

    // Create a new page for each entry
    const page = pdfDoc.addPage([612, 792]); // Letter-sized page
    const pageWidth = page.getSize().width;
    const pageHeight = page.getSize().height;

    // Generate the QR code for the current URL
    const qrCodeDataUrl = await generateQRCode(url);
    const qrCodeImage = await pdfDoc.embedPng(qrCodeDataUrl);
    const qrCodeDims = qrCodeImage.scale(0.75);

    // Center the QR code on the page
    const x = (page.getSize().width - qrCodeDims.width) / 2;
    const y = page.getSize().height - qrCodeDims.height - 50; // Adjust the 50 as needed

    page.drawImage(qrCodeImage, {
      x,
      y,
      width: qrCodeDims.width,
      height: qrCodeDims.height,
    });

    // Add a box with event information
    const boxWidth = 400;
    const boxHeight = 150;
    const boxX = (pageWidth - boxWidth) / 2;
    const boxY = y - 20 - boxHeight;

    page.drawRectangle({
      x: boxX,
      y: boxY,
      width: boxWidth,
      height: boxHeight,
      color: rgb(1, 1, 1), // White box
    });

    // Text settings
    const textSize = 12;
    const textX = boxX + 10;
    const textY = boxY + boxHeight - 20;

    // Add event information to the box
    pdfDoc.registerFontkit(fontkit);
    const fontPath = path.join(__dirname, 'fonts', 'OpenSans-Bold.ttf');
    const boldFont = await pdfDoc.embedFont(fs.readFileSync(fontPath));

    const font = await pdfDoc.embedFont('Helvetica');
    page.drawText('Name:', {
      x: textX,
      y: textY,
      size: textSize,
      font: boldFont,
    });
    page.drawText(eventData.name, {
      x: textX + 50,
      y: textY,
      size: textSize,
      font,
    });

    page.drawText('Date:', {
      x: textX,
      y: textY - 20,
      size: textSize,
      font: boldFont,
    });
    page.drawText(eventData.date, {
      x: textX + 50,
      y: textY - 20,
      size: textSize,
      font,
    });

    page.drawText('Time:', {
      x: textX,
      y: textY - 40,
      size: textSize,
      font: boldFont,
    });
    page.drawText(eventData.startTime, {
      x: textX + 50,
      y: textY - 40,
      size: textSize,
      font,
    });

    page.drawText('Location:', {
      x: textX,
      y: textY - 60,
      size: textSize,
      font: boldFont,
    });
    page.drawText(eventData.location, {
      x: textX + 80,
      y: textY - 60,
      size: textSize,
      font,
    });

    page.drawText('Ticket ID:', {
      x: textX,
      y: textY - 80,
      size: textSize,
      font: boldFont,
    });
    page.drawText(tokenId, {
      x: textX + 80,
      y: textY - 80,
      size: textSize,
      font,
    });

    // Embed the 'mask.png' image in the top right corner
    const imagePath = path.join(__dirname, 'pdfImages', 'mask.png');
    const maskImage = await pdfDoc.embedPng(fs.readFileSync(imagePath));
    const maskDims = maskImage.scale(0.1);
    const maskX = pageWidth - maskDims.width - 20;
    const maskY = pageHeight - maskDims.height - 20;

    page.drawImage(maskImage, {
      x: maskX,
      y: maskY,
      width: maskDims.width,
      height: maskDims.height,
    });
  }
  const pdfBytes = await pdfDoc.save();
  const pdfBase64 = Buffer.from(pdfBytes).toString('base64');

  return pdfBase64;
}

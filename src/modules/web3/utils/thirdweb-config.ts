import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import moment from 'moment'
import { environment } from '@/config/environment';

export const sdk = ThirdwebSDK.fromPrivateKey(
  process.env.PK!,
  "Mumbai",
  {secretKey: process.env.THIRDWEB_SECRET_KEY}
);

export const calcExpiryDate = (event: any) => {
    var expiry_string = undefined
    if (event.endTime) {
       expiry_string = event.date + " " + event.endTime;
    }
    else {
       expiry_string = event.date + " " + event.startTime;
    }
    const format = "M/D/YYYY hA";
    const expiry_date = moment(expiry_string, format).toDate();
    expiry_date.setFullYear(expiry_date.getFullYear() + 1)
    var expiry_seconds = Math.floor(expiry_date.getTime() / 1000)
    console.log(expiry_seconds)
    return expiry_seconds
 }
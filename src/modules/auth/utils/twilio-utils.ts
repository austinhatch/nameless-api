const accountSid = "AC397fa9376dc9daf29145fca878720421";
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifySid = "VA4863c6a74531561a530914c6ffafa38a";
const Twilio = require("twilio")(accountSid, authToken);



export const startVerififcation = async (num: string) => {
    const verification = await Twilio.verify.services(verifySid)
    .verifications
    .create({to: num, channel: 'sms'})

    return verification
}

export const checkVerificationCode = async (num: string, code: string) => {
    const verification = await Twilio.verify.services(verifySid)
    .verificationChecks
    .create({to: num, code})

    return verification.status
} 
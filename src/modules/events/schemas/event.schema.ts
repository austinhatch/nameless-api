import { number, object, string } from 'yup';

export const eventSchema = object({
    id: string().required(),
    url_endpoint: string().required(),
    name: string().required(),
    date: string().required(),
    startTime: string().required(),
    endTime: string(),
    tz: string().required(),
    type: string(),
    location: string().required(),
    location_url: string().required(),
    venue: string().required(),
    venue_url: string().required(),
    imgUrl: string().required(),
    description: string().required(),
    lockAddress: string(),
    priceUSD: number(),
    email_template: string(),
    cardColor: string()
});

import { number, object, string } from 'yup';

export const eventSchema = object({
    name: string().required(),
    date: string().required(),
    startTime: string().required(),
    endTime: string(),
    tz: string().required(),
    location: string().required(),
    imgUrl: string().required(),
    description: string().required(),
    costUSD: number().required(),
    unlockAddress: string().required(),
    organization: string().required(),
});

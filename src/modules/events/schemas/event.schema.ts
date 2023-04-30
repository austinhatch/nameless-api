import { object, string } from 'yup';

export const eventSchema = object({
    name: string(),
    date: string(),
    startTime: string(),
    endTime: string(),
    tz: string(),
    location: string(),
    imgUrl: string(),
    description: string()
});

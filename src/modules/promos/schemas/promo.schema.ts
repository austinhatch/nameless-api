import { boolean, number, object, string } from 'yup';

export const promoSchema = object({
    code: string().required(),
    percent: boolean().required(),
    amount: number().required(),
    expiry: string()
});

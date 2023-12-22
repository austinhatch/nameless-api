import { object, string } from 'yup';

export const scannerAuthSchema = object({
  accountId: string().required(),
  pin: string().required(),
});

import { object, string } from 'yup';

export const verifyCodeSchema = object({
  phone: string().required(),
  code: string().required(),
});

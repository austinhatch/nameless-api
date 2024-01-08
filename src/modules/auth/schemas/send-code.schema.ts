import { object, string } from 'yup';

export const sendCodeSchema = object({
  phone: string().required(),
});

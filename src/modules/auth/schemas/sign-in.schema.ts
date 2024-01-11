import { object, string } from 'yup';

export const signInSchema = object({
  phone: string().required(),
  password: string().required(),
});

import { object, string } from 'yup';

export const signInSchema = object({
  email: string().email(),
  phone: string(),
  password: string().required(),
});

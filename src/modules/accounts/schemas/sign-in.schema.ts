import { object, string } from 'yup';

export const signInSchema = object({
  email: string().required(),
  password: string().required(),
});

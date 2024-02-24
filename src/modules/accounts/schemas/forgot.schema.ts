import { object, string } from 'yup';

export const forgotSchema = object({
  email: string().email().required(),
});

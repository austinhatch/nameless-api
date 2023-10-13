import { object, string } from 'yup';

export const userExistsSchema = object({
  email: string().email().required(),
});

export const userExistsPhoneSchema = object({
  phone: string().required(),
});



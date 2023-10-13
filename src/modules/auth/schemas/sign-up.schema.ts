import { object, string, ref } from 'yup';

export const signUpSchema = object({
  email: string().email().required(),
  username: string().required(),
  password: string().required(),
  phone: string().required(),
  confirmPassword: string()
    .required()
    .oneOf([ref('password'), null], "passwords don't match"),
});

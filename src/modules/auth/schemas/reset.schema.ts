import { object, string, ref } from 'yup';

export const resetSchema = object({
  password: string().required(),
  confirmPassword: string()
    .required()
    .oneOf([ref('password'), null], "passwords don't match"),
});

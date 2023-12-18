import { object, string } from 'yup';

export const udpateUserSchema = object({
  name: string(),
  lastName: string(),
});

export const changeUsernameSchema = object({
  id: string().required(),
  username: string().required(),
});
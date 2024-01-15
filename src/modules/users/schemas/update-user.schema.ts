import { object, string } from 'yup';

export const udpateUserSchema = object({
  name: string(),
  lastName: string(),
});

export const changeUsernameSchema = object({
  id: string().required(),
  username: string().required(),
});

export const changeEmailSchema = object({
  id: string().required(),
  email: string().required(),
});

export const changePFPSchema = object({
  id: string().required(),
  pfpAddress: string().required(),
  chain: string().required()
});
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

export const addEventIdSchema = object({
  id:string().required(),
  eventId:string().required()
})

export const addRewardIdSchema = object({
  id:string().required(),
  rewardId:string().required(),
})

export const updateNameSchema = object({
  id: string().required(),
  name: string(),
  lastName: string(),
});
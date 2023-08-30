import { object, string } from 'yup';

export const affiliateLinkCreationSchema = object({
  email: string().email().required(),
  eventId: string().required(),
});

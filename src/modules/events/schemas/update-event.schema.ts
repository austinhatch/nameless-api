import { object, string } from 'yup';

export const updateEventSchema = object({
  name: string()
});

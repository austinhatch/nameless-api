import { object, string } from 'yup';

export const userIdUpdateSchema = object({
  id: string().required()
});

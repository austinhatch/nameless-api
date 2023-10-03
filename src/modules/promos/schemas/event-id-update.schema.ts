import { object, string } from 'yup';

export const eventIdUpdateSchema = object({
  id: string().required()
});

import { object, string } from 'yup';

export const udpateAccountsSchema = object({
  name: string(),
  email: string(),
});

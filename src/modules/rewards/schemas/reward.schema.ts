import { object, string } from 'yup';

export const rewardSchema = object({
    name: string(),
    description: string(),
    imgUrl: string()
});

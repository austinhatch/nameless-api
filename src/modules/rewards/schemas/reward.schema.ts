import { object, string } from 'yup';

export const rewardSchema = object({
    name: string().required(),
    description: string().required(),
    imgUrl: string().required()
});

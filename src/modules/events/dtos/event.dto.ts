export interface IEventDTO {
    name: string;
    date: string;
    startTime: string;
    endTime?: string;
    tz: string;
    location: string;
    imgUrl: string;
    description: string;
    costUSD: number;
    unlockAddress:string;
    organization:string;
  }
  
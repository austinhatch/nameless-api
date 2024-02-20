import { Json } from "twilio/lib/interfaces";

export interface IEventDTO {
  kyd_id?: string;
  url_endpoint: string;

  name: string;
  date?: string;
  startTime?: string;
  endTime?: string;
  tz?: string;
  type?: string;
  location?: string;
  location_url?: string;
  venue?: string;
  venue_url?: string;
  vendors?: string;

  imgUrl: string;
  imgUrl2?: string;
  imgUrl3?: string;

  description: string;
  claimDescription?: string;
  rsvpDescription?: string;

  priceUSD?: number;
  email_template?: string;
  cardColor?: string;

  ticketProvider?: Object;
  iframe_url?: String;

  rewardCollectionAddress?: String;
  rewardImgUrls?: Object;
  rewardRedeemable?: Boolean;

  featured?: Boolean;
  live?: Boolean;

}

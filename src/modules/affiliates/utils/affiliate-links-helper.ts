import {createHash} from 'node:crypto'

export interface IAffiliateLinkObject {
    id: string,
    link: string,
    impressions: number,
    conversions: number,
    eventId: string
}

// ID will be the unique hash of the affiliate link. Use to get eventId
export function createNewAffiliateLink(email: string, eventId: string) : IAffiliateLinkObject {

    const linkHash = createHash("shake256", { outputLength: 8 }).update(`${email} + ${eventId}`).digest('hex');
    console.log(linkHash)

    return {
        id: linkHash,
        link: `https://nameless.nyc/events/${linkHash}`,
        impressions: 0,
        conversions: 0,
        eventId
    }
}
  
import { AptosAccount } from 'aptos'
import { environment } from '@/config/environment';

export const aptosAccount = ()=> {
    const encoder = new TextEncoder()
    return new AptosAccount(encoder.encode(environment.aptos_private_key))
}

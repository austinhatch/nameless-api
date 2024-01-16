// import { aptos, getAptosAccount } from "./aptos-config";

import {
  Aptos,
  AptosConfig,
  Ed25519PrivateKey,
  Account,
} from '@aptos-labs/ts-sdk';
import { environment } from '@/config/environment';
import { Provider, Network } from 'aptos';
import { AccountAddressParam } from '@stripe/stripe-js';

const aptosConfig = new AptosConfig({ network: Network.DEVNET }); // default to devnet
const aptos = new Aptos(aptosConfig);

export async function mintTicket() {
  const privateKey = new Ed25519PrivateKey(environment.aptos_private_key_jesse);
  const aptosAccount = Account.fromPrivateKey({ privateKey });

  const transaction = await aptos.build.transaction({
    sender: aptosAccount.accountAddress,
    data: {
      function:
        '0xc58194fcaa565001385cd1f00e48367cbf455ac854444d83fac042004ef1736b::my_management2::create_ticket',
      typeArguments: [],
      functionArguments: [
        '0xc58194fcaa565001385cd1f00e48367cbf455ac854444d83fac042004ef1736b', 
        '0x5c47df3ea8cb8bee87794025a4f078ac403eb4fd9c0ad2b5700dc963a7deb90',
        '00', 
        'PARTY00', // TICKET ID MUST BE UNIQUE
        '100',
        '10',
        '10',
      ],
    },
  });

  const senderAuthenticator = aptos.sign.transaction({
    signer: aptosAccount,
    transaction,
  });

  console.log(senderAuthenticator);

  // submit transaction
  const committedTransaction = await aptos.submit.transaction({
    transaction,
    senderAuthenticator,
  });

  console.log(committedTransaction);

  return committedTransaction; // Fix: Return rawTxn
}

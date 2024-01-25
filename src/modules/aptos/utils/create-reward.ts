import { aptos, getAptosAccount, getSequenceNumber } from './aptos-config';
import { Account, AccountAddress } from '@aptos-labs/ts-sdk';

export async function mintTicket(
  recipient: string,
  collectionAddress: string,
  ticketId: string,
  ticketType: string,
  ticketPriceApt: number,
  ticketPrice: number,
  date: number
) {
  const aptosAccount = await getAptosAccount();
  const transaction = await aptos.transaction.build.simple({
    sender: aptosAccount.accountAddress,
    data: {
      function:
        '0x4085614bac67f35aaa8843566633d3b05e182e53af02bad646e42cf734e68afd::my_management::create_ticket',
      typeArguments: [],
      functionArguments: [
        recipient,
        collectionAddress,
        ticketId,
        ticketType, 
        ticketPriceApt,
        ticketPrice,
        date,
      ],
    },
  });

  // submit transaction
  const committedTransaction = await aptos.signAndSubmitTransaction({
    signer: aptosAccount,
    transaction: transaction,
  });

  console.log(committedTransaction);

  return committedTransaction; // Fix: Return rawTxn
}

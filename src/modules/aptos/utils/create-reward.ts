import { aptos, getAptosAccount, getSequenceNumber } from './aptos-config';
import { Account, AccountAddress } from '@aptos-labs/ts-sdk';
import { environment } from '@/config/environment';


export async function createReward(
  recipient: string,
  collectionAddress: string,

) {
    // DEFAULTS ______________________
  const  ticketType= "0"       // default to 0 
  const  ticketPriceApt= 0   // default to 0
  const ticketPrice= 0        // default to 0
  const  date= 0               // default to 0
  /// ____________________________________
  
  const  ticketId = generateRandomTicketID() 

  const aptosAccount = await getAptosAccount();
  const sequenceNumber = await getSequenceNumber()
  const transaction = await aptos.transaction.build.simple({
    sender: aptosAccount.accountAddress,
    data: {
      function:
        `${environment.aptos_public_key}::my_management::create_ticket`,
      typeArguments: [],
      functionArguments: [
        recipient,
        collectionAddress,
        ticketType,
        ticketId,
        ticketPriceApt,
        ticketPrice,
        date,
      ],
    }, options: {
        accountSequenceNumber: sequenceNumber
    }
  });

  // submit transaction
  const committedTransaction = await aptos.signAndSubmitTransaction({
    signer: aptosAccount,
    transaction: transaction,
  });

  console.log(committedTransaction);

  return committedTransaction; // Fix: Return rawTxn
}


function generateRandomTicketID() {
    // Generate a random 8-digit number
    const randomNumber = Math.floor(10000000 + Math.random() * 90000000);
    
    // Convert the number to a string and return it
    return randomNumber.toString();
  }

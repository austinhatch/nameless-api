import { aptos, getAptosAccount, getSequenceNumber } from "./aptos-config";
import { AccountAddress } from "@aptos-labs/ts-sdk";

export async function createAccount( address: string | undefined){
  const aptosAccount = await getAptosAccount()
  const sequenceNumber = await getSequenceNumber()
  const transaction = await aptos.transaction.build.simple({
    sender: aptosAccount.accountAddress,
    data: {
      function:
        '0x1::aptos_account::create_account',
      typeArguments: [],
      functionArguments: [
        address,
      ],
    },
    options: {
      accountSequenceNumber: sequenceNumber,
    }
  });

  const committedTransaction = await aptos.signAndSubmitTransaction({
    signer: aptosAccount,
    transaction: transaction,
  });

  console.log(committedTransaction);

  return committedTransaction;
}
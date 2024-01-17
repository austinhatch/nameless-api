import { aptos, getAptosAccount } from "./aptos-config";
import { AccountAddress } from "@aptos-labs/ts-sdk";

export async function createAccount( address: string | undefined){
  const aptosAccount = await getAptosAccount()
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
  });

  const committedTransaction = await aptos.signAndSubmitTransaction({
    signer: aptosAccount,
    transaction: transaction,
  });

  console.log(committedTransaction);

  return committedTransaction;
}
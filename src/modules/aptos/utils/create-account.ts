import { aptos, getAptosAccount } from "./aptos-config";
import { AccountAddress } from "@aptos-labs/ts-sdk";

export async function createAccount( address: string | undefined){
  const aptosAccount = await getAptosAccount()
  const transaction = await aptos.build.transaction({
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

  return committedTransaction;
}
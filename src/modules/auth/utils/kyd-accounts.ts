import { object } from 'yup';
import { KYD_UsersRepository } from '@/modules/kyd_users/kyd_users.repository';
import { UsersRepository } from '@/modules/users/users.repository';
import { User } from '@prisma/client';

export async function getKYDAccountsForUser(email?:string | null, phone?:string | null) {
    const kyd_accounts_email = email ? await KYD_UsersRepository.findByEmail(email) : []
    console.log(kyd_accounts_email)
    const kyd_accounts_phone = phone ? await KYD_UsersRepository.findByPhone(phone) : []
    const all_accounts = kyd_accounts_phone.concat(kyd_accounts_email)
    console.log(all_accounts)
    const kydAccountsSet = new Set(all_accounts.map(user=> user.wallet_address))
    console.log("Found KYD Accounts:",kydAccountsSet)
    return Array.from(kydAccountsSet)
}

export async function updateKYDAccountsForUser(user:User) {
    const kyd_accounts = await getKYDAccountsForUser(user.email, user.phone)
    const accounts:any = user.external_accounts
    if( accounts !== null && kyd_accounts.length > 0){
      const kydAccounts:any = accounts['KYD']
      if(kydAccounts){
        const kydAccountsSet = new Set(kydAccounts)
        kyd_accounts.forEach(account =>{
            kydAccountsSet.add(account)
        })
        accounts["KYD"] = Array.from(kydAccountsSet)
        await UsersRepository.update(user.id, {external_accounts:accounts})
      }
    }
}
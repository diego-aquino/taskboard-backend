import Account from '~/models/Account';
import { EmailAlreadyInUseError } from './errors';

class AccountsServices {
  static async create(accountInfo) {
    const { firstName, lastName, email, password } = accountInfo;

    const accountWithSameEmail = await Account.findOne({ email });
    if (accountWithSameEmail) {
      throw new EmailAlreadyInUseError(email);
    }

    const createdAccount = await Account.create({
      firstName,
      lastName,
      email,
      password,
    });

    return createdAccount;
  }
}

export default AccountsServices;

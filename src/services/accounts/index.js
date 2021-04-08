import Account from '~/models/Account';

class AccountsServices {
  static async create(accountInfo) {
    const { firstName, lastName, email, password } = accountInfo;

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

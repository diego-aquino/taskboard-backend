import * as yup from 'yup';

import Account from '~/models/Account';
import { EmailAlreadyInUseError } from './errors';

class AccountsServices {
  static async create(accountInfo) {
    await AccountsServices.#validateAccountInfo(accountInfo);

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

  static async #validateAccountInfo(accountInfo) {
    const accountInfoSchema = yup.object({
      firstName: yup.string().required(),
      lastName: yup.string().required(),
      email: yup.string().email().required(),
      password: yup.string().min(8, 'Password too short.').required(),
    });

    await accountInfoSchema.validate(accountInfo, {
      abortEarly: true,
      stripUnknown: true,
    });
  }

  static findById(accountId) {
    return Account.findById(accountId);
  }

  static existsWithId(accountId) {
    return Account.exists({ _id: accountId });
  }
}

export default AccountsServices;

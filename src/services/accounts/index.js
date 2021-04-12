import * as yup from 'yup';
import bcrypt from 'bcrypt';

import { Account } from '~/models';
import AuthServices from '~/services/auth';
import { EmailAlreadyInUseError, InvalidLoginCredentials } from './errors';

class AccountsServices {
  static async create(accountInfo) {
    await AccountsServices.#validateAccountInfo(accountInfo);

    const { firstName, lastName, email, password } = accountInfo;

    const accountWithSameEmailExists = await Account.exists({ email });
    if (accountWithSameEmailExists) {
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

  static async login(credentials) {
    const {
      email,
      password,
    } = await AccountsServices.#validateLoginCredentials(credentials);

    const account = await AccountsServices.findByEmail(email).select(
      '+password',
    );

    if (!account) {
      throw new InvalidLoginCredentials();
    }

    const passwordsDidMatch = await bcrypt.compare(password, account.password);
    if (!passwordsDidMatch) {
      throw new InvalidLoginCredentials();
    }

    const [accessToken, refreshToken] = await Promise.all([
      AuthServices.generateAccountAccessToken(account._id),
      AuthServices.generateAccountRefreshToken(account._id),
    ]);

    account.auth.activeRefreshToken = refreshToken;
    await account.save();

    return { accessToken, refreshToken };
  }

  static #validateLoginCredentials(credentials) {
    const loginCredentialsSchema = yup.object({
      email: yup.string().email().required(),
      password: yup.string().required(),
    });

    return loginCredentialsSchema.validate(credentials);
  }

  static findById(accountId) {
    return Account.findById(accountId);
  }

  static findByEmail(email) {
    return Account.findOne({ email });
  }

  static existsWithId(accountId) {
    return Account.exists({ _id: accountId });
  }
}

export default AccountsServices;

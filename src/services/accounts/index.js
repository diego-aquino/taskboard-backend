import * as yup from 'yup';

import { Account } from '~/models';
import AuthServices from '~/services/auth';
import { InvalidTokenError } from '~/services/auth/errors';
import {
  AccountNotFoundError,
  EmailAlreadyInUseError,
  InvalidLoginCredentials,
} from './errors';

class AccountsServices {
  static async create(accountInfo) {
    await AccountsServices.#validateAccountInfo(accountInfo);

    const { firstName, lastName, email, password } = accountInfo;

    const accountWithSameEmailExists = await Account.exists({ email });
    if (accountWithSameEmailExists) {
      throw new EmailAlreadyInUseError(email);
    }

    const account = await Account.create({
      firstName,
      lastName,
      email,
      password,
    });

    const { accessToken, refreshToken } = await AccountsServices.login({
      email,
      password,
    });

    return {
      account,
      authCredentials: { accessToken, refreshToken },
    };
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

    const passwordsDidMatch = await AuthServices.comparePasswords(
      password,
      account.password,
    );
    if (!passwordsDidMatch) {
      throw new InvalidLoginCredentials();
    }

    const {
      accessToken,
      refreshToken,
    } = await AuthServices.generateAuthCredentials(account.id);

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

  static async generateNewAccessToken(refreshToken) {
    const { accountId } = await AuthServices.validateRefreshToken(refreshToken);

    const account = await AccountsServices.findById(accountId)
      .select('+auth')
      .lean();

    if (!account) {
      throw new AccountNotFoundError();
    }

    if (account.auth.activeRefreshToken !== refreshToken) {
      throw new InvalidTokenError('refresh');
    }

    const newAccessToken = await AuthServices.generateAccountAccessToken(
      accountId,
    );

    return newAccessToken;
  }

  static async logout(accountId) {
    const account = await Account.findById(accountId);

    if (!account) {
      throw new AccountNotFoundError();
    }

    account.auth.activeRefreshToken = null;
    await account.save();
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

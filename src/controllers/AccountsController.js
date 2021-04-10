import { ValidationError } from 'yup';

import AccountsServices from '~/services/accounts';
import {
  AccountNotFoundError,
  EmailAlreadyInUseError,
} from '~/services/accounts/errors';
import AuthServices from '~/services/auth';
import { AccountsViews } from '~/views';

class AccountsController {
  static async signUp(request, response, next) {
    try {
      const { firstName, lastName, email, password } = request.body;
      const accountInfo = { firstName, lastName, email, password };

      const createdAccount = await AccountsServices.create(accountInfo);
      const accountId = createdAccount._id;

      const accountView = AccountsViews.render(createdAccount.toObject());
      const [accessToken, refreshToken] = await Promise.all([
        AuthServices.generateAccountAccessToken(accountId),
        AuthServices.generateAccountRefreshToken(accountId),
      ]);

      return response.status(201).json({
        account: accountView,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      return AccountsController.#handleError(error, { response, next });
    }
  }

  static async details(request, response, next) {
    try {
      const { accountId } = request.locals;

      const account = await AccountsServices.findById(accountId).lean();
      if (!account) {
        throw new AccountNotFoundError();
      }

      const accountView = AccountsViews.render(account);

      return response.status(200).json({ account: accountView });
    } catch (error) {
      return AccountsController.#handleError(error, { response, next });
    }
  }

  static #handleError(error, { response, next }) {
    const { message } = error;

    if (error instanceof EmailAlreadyInUseError) {
      return response.status(409).json({ message });
    }

    if (error instanceof AccountNotFoundError) {
      return response.status(404).json({ message });
    }

    if (error instanceof ValidationError) {
      return response.status(400).json({ message });
    }

    return next(error);
  }
}

export default AccountsController;

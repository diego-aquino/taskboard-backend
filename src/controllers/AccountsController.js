import { JsonWebTokenError } from 'jsonwebtoken';
import { ValidationError } from 'yup';

import AccountsServices from '~/services/accounts';
import {
  AccountNotFoundError,
  EmailAlreadyInUseError,
  InvalidLoginCredentials,
} from '~/services/accounts/errors';
import { AccountsViews } from '~/views';

class AccountsController {
  static async signup(request, response, next) {
    try {
      const { firstName, lastName, email, password } = request.body;
      const accountInfo = { firstName, lastName, email, password };

      const {
        account,
        authCredentials: { accessToken, refreshToken },
      } = await AccountsServices.create(accountInfo);

      const accountView = AccountsViews.render(account.toObject());

      return response.status(201).json({
        account: accountView,
        accessToken,
        refreshToken,
      });
    } catch (error) {
      return AccountsController.#handleError(error, { response, next });
    }
  }

  static async login(request, response, next) {
    try {
      const { email, password } = request.body;

      const authCredentials = await AccountsServices.login({ email, password });

      return response.status(201).json(authCredentials);
    } catch (error) {
      return AccountsController.#handleError(error, { response, next });
    }
  }

  static async token(request, response, next) {
    try {
      const { refreshToken } = request.body;

      const accessToken = await AccountsServices.generateNewAccessToken(
        refreshToken,
      );

      return response.status(201).json({ accessToken });
    } catch (error) {
      return AccountsController.#handleError(error, { response, next });
    }
  }

  static async logout(request, response, next) {
    try {
      const { accountId } = request.locals;

      await AccountsServices.logout(accountId);

      return response.status(204).send();
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

    if (
      error instanceof InvalidLoginCredentials ||
      error instanceof JsonWebTokenError
    ) {
      return response.status(401).json({ message });
    }

    if (error instanceof ValidationError) {
      return response.status(400).json({ message });
    }

    return next(error);
  }
}

export default AccountsController;

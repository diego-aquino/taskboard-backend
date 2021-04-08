import AccountsServices from '~/services/accounts';
import AuthServices from '~/services/auth';
import { AccountsViews } from '~/views';
import { EmailAlreadyInUseError } from '../services/accounts/errors';

class AccountsController {
  static async signUp(request, response) {
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
      return AccountsController.handleError(error, { request, response });
    }
  }

  static handleError(error, { response }) {
    const { message } = error;

    if (error instanceof EmailAlreadyInUseError) {
      return response.status(409).json({ message });
    }

    response.status(500).json({ message: 'Internal server error.' });
    throw error;
  }
}

export default AccountsController;

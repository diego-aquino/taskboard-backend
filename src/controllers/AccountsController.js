import AccountsServices from '~/services/accounts';
import AuthServices from '~/services/auth';
import { AccountsViews } from '~/views';

class AccountsController {
  static async signUp(request, response) {
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
  }
}

export default AccountsController;

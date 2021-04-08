import AccountsServices from '~/services/accounts';
import { AccountsViews } from '~/views';

class AccountsController {
  static async signUp(request, response) {
    const { firstName, lastName, email, password } = request.body;
    const accountInfo = { firstName, lastName, email, password };

    const createdAccount = await AccountsServices.create(accountInfo);

    const accountView = AccountsViews.render(createdAccount.toObject());

    return response.status(201).json({
      account: accountView,
    });
  }
}

export default AccountsController;

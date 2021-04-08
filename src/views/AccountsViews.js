class AccountsViews {
  static render(account) {
    const { _id, firstName, lastName, email } = account;

    const accountView = { id: _id, firstName, lastName, email };
    return accountView;
  }
}

export default AccountsViews;

export class EmailAlreadyInUseError extends Error {
  constructor(email) {
    super('Email is already in use.');
    this.email = email;
  }
}

export class AccountNotFoundError extends Error {
  constructor() {
    super('Account not found.');
  }
}

export class InvalidLoginCredentials extends Error {
  constructor() {
    super('Email and/or password do not match.');
  }
}

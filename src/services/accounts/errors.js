export class EmailAlreadyInUseError extends Error {
  constructor() {
    super('Email is already in use.');
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

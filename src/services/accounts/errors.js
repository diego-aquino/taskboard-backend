export class EmailAlreadyInUseError extends Error {
  constructor(email) {
    super('Email is already in use.');
    this.email = email;
  }
}

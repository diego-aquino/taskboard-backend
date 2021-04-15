import { ValidationError } from 'yup';

export class InvalidObjectId extends ValidationError {
  constructor() {
    super('Invalid object id.');
  }
}

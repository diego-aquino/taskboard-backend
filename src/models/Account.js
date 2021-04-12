import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const AccountSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  auth: {
    activeRefreshToken: {
      type: String,
      nullable: true,
      default: null,
    },
    select: false,
  },
});

AccountSchema.pre('save', async function preSave(next) {
  const account = this;
  const passwordHasBeenModified = account.isModified('password');

  if (passwordHasBeenModified) {
    account.password = await bcrypt.hash(account.password, 10);
  }

  next();
});

const Account = mongoose.model('Account', AccountSchema);

export default Account;

import { setLocale } from 'yup';

setLocale({
  mixed: {
    default: 'Invalid or missing field(s).',
    required: 'Invalid or missing required field(s).',
  },
  string: {
    email: 'Invalid email.',
  },
});

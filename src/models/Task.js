import mongoose, { Schema } from 'mongoose';

const TaskSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    priority: {
      type: String,
      required: true,
      trim: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
      required: true,
    },
  },
  { timestamps: true },
);

const Task = mongoose.model('Task', TaskSchema);

export default Task;

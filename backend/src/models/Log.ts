import mongoose, { Document, Schema } from 'mongoose';

export interface ILog extends Document {
  message: string;
  stack?: string;
  date: Date;
}

const logSchema: Schema = new mongoose.Schema({
  message: { type: String, required: true },
  stack: { type: String },
  date: { type: Date, default: Date.now },
});

const Log = mongoose.model<ILog>('Log', logSchema);

export default Log;

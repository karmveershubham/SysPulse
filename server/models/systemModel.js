// models/systemModel.js
import mongoose from 'mongoose';


const systemSchema = new mongoose.Schema({
  machine_id: { type: String, required: true, unique: true },
  hostname: { type: String },
  os: { type: String },
  interval: { type: Number, default: 30 },
  registered_at: { type: Date, default: Date.now },
});

systemSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

const System = mongoose.model('System', systemSchema);

export default System;

// models/reportModel.js
import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  machine_id: { type: String, required: true },
  hostname: { type: String },
  os: { type: String },

  disk_encrypted: { type: Boolean },
  disk_encryption_method: { type: String },

  os_up_to_date: { type: Boolean },
  current_os_version: { type: String },
  latest_os_version: { type: String },

  antivirus_exists: { type: Boolean },
  antivirus_active: { type: Boolean },
  antivirus_name: { type: String },

  sleep_ok: { type: Boolean },

  reported_at: { type: Date, default: Date.now }
});

reportSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

const Report = mongoose.model('Report', reportSchema);

export default Report;

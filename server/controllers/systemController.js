// controllers/systemController.js
import System from '../models/systemModel.js';
import Report from '../models/reportModel.js';
import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const TOKEN_EXPIRY = '7d';

export const registerSystem = async (req, res) => {
  try {
    const { machine_id, os, hostname } = req.body;

    // Check if system is already registered
    let system = await System.findOne({ machine_id });
    if (!system) {
      system = await System.create({ machine_id, os, hostname });
    }

    // Create JWT
    const token = jwt.sign({ machine_id }, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

    res.status(201).json({ message: 'System registered', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to register system' });
  }
};

export const reportSystem = async (req, res) => {
  try {
    const { machine_id } = req.body;
    const system = await Report.findOneAndUpdate({ machine_id }, req.body, {
      new: true,
      upsert: true,
    });
    res.status(200).json({ message: 'System reported', system });
  } catch (err) {
    res.status(500).json({ error: 'Failed to report system' });
  }
};

export const getSystems = async (req, res) => {
  try {
    const systems = await Report.find();
    res.status(200).json(systems);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch systems' });
  }
};

export const getReportByMachineId = async (req, res) => {
  const { machine_id } = req.params;

  try {
    const report = await Report.findOne({ machine_id });

    if (!report) {
      return res.status(404).json({ error: 'System not found' });
    }

    res.status(200).json(report);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch system report' });
  }
};

export const getFilteredSystems = async (req, res) => {
  try {
    const filters = {};

    if (req.query.os) filters.os = req.query.os;
    if (req.query.hostname) filters.hostname = { $regex: req.query.hostname, $options: 'i' };
    if (req.query.antivirus_active) filters.antivirus_active = req.query.antivirus_active === 'true';
    if (req.query.disk_encrypted) filters.disk_encrypted = req.query.disk_encrypted === 'true';
    if (req.query.os_up_to_date) filters.os_up_to_date = req.query.os_up_to_date === 'true';

    const results = await Report.find(filters);
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch filtered systems' });
  }
};

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

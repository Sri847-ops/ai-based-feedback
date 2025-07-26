import Staff from '../models/Staff.js';
import bcrypt from 'bcryptjs';

export const registerStaff = async (req, res) => {
  const { email, password } = req.body;

  try {
    const staffExists = await Staff.findOne({ email });
    if (staffExists) return res.status(400).json({ message: 'Staff already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStaff = await Staff.create({ email, password: hashedPassword });

    res.status(201).json({ message: 'Staff registered', staffId: newStaff._id });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error });
  }
};

export const loginStaff = async (req, res) => {
  const { email, password } = req.body;

  try {
    const staff = await Staff.findOne({ email });
    if (!staff) return res.status(404).json({ message: 'Staff not found' });

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    res.status(200).json({ message: 'Login successful', staffId: staff._id });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error });
  }
};

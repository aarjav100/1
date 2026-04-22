import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Student from '../models/Student.js';

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register new student
// @route   POST /api/register
// @access  Public
export const registerStudent = async (req, res) => {
  const { name, email, password, course } = req.body;

  if (!name || !email || !password || !course) {
    return res.status(400).json({ message: 'Please add all fields' });
  }

  // Check if student exists
  const studentExists = await Student.findOne({ email });

  if (studentExists) {
    return res.status(400).json({ message: 'Student already exists' });
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create student
  const student = await Student.create({
    name,
    email,
    password: hashedPassword,
    course,
  });

  if (student) {
    res.status(201).json({
      _id: student.id,
      name: student.name,
      email: student.email,
      course: student.course,
      token: generateToken(student._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid student data' });
  }
};

// @desc    Authenticate a student
// @route   POST /api/login
// @access  Public
export const loginStudent = async (req, res) => {
  const { email, password } = req.body;

  // Check for student email
  const student = await Student.findOne({ email });

  if (student && (await bcrypt.compare(password, student.password))) {
    res.json({
      _id: student.id,
      name: student.name,
      email: student.email,
      course: student.course,
      token: generateToken(student._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

// @desc    Update student password
// @route   PUT /api/update-password
// @access  Private
export const updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const student = await Student.findById(req.student._id);

  if (student && (await bcrypt.compare(oldPassword, student.password))) {
    const salt = await bcrypt.genSalt(10);
    student.password = await bcrypt.hash(newPassword, salt);
    await student.save();
    res.json({ message: 'Password updated successfully' });
  } else {
    res.status(401).json({ message: 'Invalid old password' });
  }
};

// @desc    Update student course
// @route   PUT /api/update-course
// @access  Private
export const updateCourse = async (req, res) => {
  const { course } = req.body;

  const student = await Student.findById(req.student._id);

  if (student) {
    student.course = course;
    const updatedStudent = await student.save();
    res.json({
      _id: updatedStudent.id,
      course: updatedStudent.course,
      message: 'Course updated successfully',
    });
  } else {
    res.status(404).json({ message: 'Student not found' });
  }
};

// @desc    Get student details (Logout logic is handled on frontend by clearing token)
// @route   GET /api/me
// @access  Private
export const getMe = async (req, res) => {
  res.status(200).json(req.student);
};

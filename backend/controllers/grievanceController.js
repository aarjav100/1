import Grievance from '../models/Grievance.js';

// @desc    Submit grievance
// @route   POST /api/grievances
// @access  Private
export const submitGrievance = async (req, res) => {
  const { title, description, category } = req.body;

  if (!title || !description || !category) {
    return res.status(400).json({ message: 'Please add all fields' });
  }

  const grievance = await Grievance.create({
    student: req.student._id,
    title,
    description,
    category,
  });

  if (grievance) {
    res.status(201).json(grievance);
  } else {
    res.status(400).json({ message: 'Invalid grievance data' });
  }
};

// @desc    View all grievances for logged-in student
// @route   GET /api/grievances
// @access  Private
export const getGrievances = async (req, res) => {
  const grievances = await Grievance.find({ student: req.student._id }).sort({ date: -1 });
  res.status(200).json(grievances);
};

// @desc    View grievance by ID
// @route   GET /api/grievances/:id
// @access  Private
export const getGrievanceById = async (req, res) => {
  const grievance = await Grievance.findById(req.params.id);

  if (!grievance) {
    return res.status(404).json({ message: 'Grievance not found' });
  }

  // Check for owner
  if (grievance.student.toString() !== req.student._id.toString()) {
    return res.status(401).json({ message: 'User not authorized' });
  }

  res.status(200).json(grievance);
};

// @desc    Update grievance
// @route   PUT /api/grievances/:id
// @access  Private
export const updateGrievance = async (req, res) => {
  const grievance = await Grievance.findById(req.params.id);

  if (!grievance) {
    return res.status(404).json({ message: 'Grievance not found' });
  }

  // Check for owner
  if (grievance.student.toString() !== req.student._id.toString()) {
    return res.status(401).json({ message: 'User not authorized' });
  }

  const updatedGrievance = await Grievance.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.status(200).json(updatedGrievance);
};

// @desc    Delete grievance
// @route   DELETE /api/grievances/:id
// @access  Private
export const deleteGrievance = async (req, res) => {
  const grievance = await Grievance.findById(req.params.id);

  if (!grievance) {
    return res.status(404).json({ message: 'Grievance not found' });
  }

  // Check for owner
  if (grievance.student.toString() !== req.student._id.toString()) {
    return res.status(401).json({ message: 'User not authorized' });
  }

  await grievance.deleteOne();

  res.status(200).json({ id: req.params.id, message: 'Grievance removed' });
};

// @desc    Search grievances by title
// @route   GET /api/grievances/search
// @access  Private
export const searchGrievances = async (req, res) => {
  const { title } = req.query;
  
  if (!title) {
    return res.status(400).json({ message: 'Search title query is required' });
  }

  const grievances = await Grievance.find({
    student: req.student._id,
    title: { $regex: title, $options: 'i' }
  });

  res.status(200).json(grievances);
};

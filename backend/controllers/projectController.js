import Project from '../models/Project.js';
import Task from '../models/Task.js';

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private
export const getProjects = async (req, res, next) => {
  try {
    let projects;
    if (req.user.role === 'Admin') {
      projects = await Project.find({}).populate('createdBy', 'name email').populate('teamMembers', 'name email');
    } else {
      projects = await Project.find({ teamMembers: req.user._id }).populate('createdBy', 'name email').populate('teamMembers', 'name email');
    }
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate('createdBy', 'name email').populate('teamMembers', 'name email');

    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }

    // Check if user has access to this project
    if (req.user.role !== 'Admin' && !project.teamMembers.some(member => member._id.toString() === req.user._id.toString())) {
        res.status(403);
        throw new Error('Not authorized to access this project');
    }

    res.status(200).json(project);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a project
// @route   POST /api/projects
// @access  Private/Admin
export const createProject = async (req, res, next) => {
  try {
    const { title, description, teamMembers } = req.body;

    const project = new Project({
      title,
      description,
      createdBy: req.user._id,
      teamMembers: teamMembers || [],
    });

    const createdProject = await project.save();
    res.status(201).json(createdProject);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private/Admin
export const updateProject = async (req, res, next) => {
  try {
    const { title, description, teamMembers } = req.body;
    const project = await Project.findById(req.params.id);

    if (project) {
      project.title = title || project.title;
      project.description = description || project.description;
      project.teamMembers = teamMembers || project.teamMembers;

      const updatedProject = await project.save();
      res.status(200).json(updatedProject);
    } else {
      res.status(404);
      throw new Error('Project not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private/Admin
export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (project) {
      // Also delete associated tasks
      await Task.deleteMany({ project: project._id });
      await project.deleteOne();
      res.status(200).json({ message: 'Project removed' });
    } else {
      res.status(404);
      throw new Error('Project not found');
    }
  } catch (error) {
    next(error);
  }
};

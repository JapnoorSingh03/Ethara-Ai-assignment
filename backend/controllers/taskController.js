import Task from '../models/Task.js';

// @desc    Get all tasks (with filters)
// @route   GET /api/tasks
// @access  Private
export const getTasks = async (req, res, next) => {
  try {
    const { status, priority, project, sort } = req.query;

    let query = {};

    // If member, only show assigned tasks
    if (req.user.role !== 'Admin') {
      query.assignedTo = req.user._id;
    }

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (project) query.project = project;

    let sortOptions = { createdAt: -1 }; // default sort
    if (sort === 'dueDate') sortOptions = { dueDate: 1 };
    else if (sort === 'priority') sortOptions = { priority: -1 }; // Might need custom logic for priority sorting

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name avatar')
      .populate('project', 'title')
      .sort(sortOptions);

    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

// @desc    Get task by ID
// @route   GET /api/tasks/:id
// @access  Private
export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email avatar')
      .populate('project', 'title');

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    if (req.user.role !== 'Admin' && task.assignedTo && task.assignedTo._id.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Not authorized to access this task');
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private/Admin
export const createTask = async (req, res, next) => {
  try {
    const { title, description, assignedTo, project, priority, dueDate, status } = req.body;

    const task = new Task({
      title,
      description,
      assignedTo,
      project,
      priority,
      dueDate,
      status
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
export const updateTask = async (req, res, next) => {
  try {
    const { title, description, assignedTo, project, priority, status, dueDate } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Members can only update status of their assigned tasks
    if (req.user.role !== 'Admin') {
      if (task.assignedTo && task.assignedTo.toString() !== req.user._id.toString()) {
         res.status(403);
         throw new Error('Not authorized to update this task');
      }
      task.status = status || task.status;
    } else {
      // Admins can update everything
      task.title = title || task.title;
      task.description = description !== undefined ? description : task.description;
      task.assignedTo = assignedTo || task.assignedTo;
      task.project = project || task.project;
      task.priority = priority || task.priority;
      task.status = status || task.status;
      task.dueDate = dueDate || task.dueDate;
    }

    const updatedTask = await task.save();
    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private/Admin
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (task) {
      await task.deleteOne();
      res.status(200).json({ message: 'Task removed' });
    } else {
      res.status(404);
      throw new Error('Task not found');
    }
  } catch (error) {
    next(error);
  }
};

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Project from './models/Project.js';
import Task from './models/Task.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const seedData = async () => {
  try {
    await User.deleteMany();
    await Project.deleteMany();
    await Task.deleteMany();

    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'Admin',
    });

    const member = await User.create({
      name: 'Team Member',
      email: 'member@example.com',
      password: 'password123',
      role: 'Member',
    });

    console.log('Seed: Users created');

    const project = await Project.create({
      title: 'Project Alpha',
      description: 'The first internal project for the team.',
      createdBy: admin._id,
      teamMembers: [admin._id, member._id],
    });

    console.log('Seed: Project created');

    await Task.create([
      {
        title: 'Initial Research',
        description: 'Conduct market research for Project Alpha.',
        assignedTo: admin._id,
        project: project._id,
        priority: 'High',
        status: 'Completed',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Design UI Mockups',
        description: 'Create Figma designs for the main dashboard.',
        assignedTo: member._id,
        project: project._id,
        priority: 'Medium',
        status: 'In Progress',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      },
      {
        title: 'Setup Database',
        description: 'Configure MongoDB Atlas and Mongoose schemas.',
        assignedTo: member._id,
        project: project._id,
        priority: 'High',
        status: 'Todo',
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      }
    ]);

    console.log('Seed: Tasks created');
    console.log('Data Seeded Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();

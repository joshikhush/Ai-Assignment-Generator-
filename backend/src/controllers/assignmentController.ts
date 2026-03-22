import { Request, Response } from 'express';
import Assignment from '../models/Assignment';
import { assignmentQueue } from '../lib/queue';

export const createAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { dueDate, questionTypes, additionalInfo, totalMarks, totalQuestions } = req.body;

    // 1. Save the new assignment directly to MongoDB with status "pending"
    const newAssignment = new Assignment({
      dueDate,
      questionTypes,
      additionalInfo,
      totalMarks,
      totalQuestions,
      status: 'pending',
    });

    const savedAssignment = await newAssignment.save();

    // 2. Add an event to our Redis Queue for the AI Worker to pick up!
    // We pass along the entire Assignment Object ID so the worker knows what to update later.
    await assignmentQueue.add('generate-paper', {
      assignmentId: savedAssignment._id,
      promptData: req.body, // Passes the info to the AI
    });

    // 3. Immediately respond back to the Frontend! 
    // This happens basically instantly while the queue works in the background
    res.status(201).json({ 
      success: true, 
      message: 'Assignment received and queue task started!',
      assignmentId: savedAssignment._id 
    });

  } catch (error) {
    console.error('Error in createAssignment controller:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

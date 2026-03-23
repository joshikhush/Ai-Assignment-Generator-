import { Request, Response } from 'express';
import Assignment from '../models/Assignment';
import { assignmentQueue } from '../lib/queue';

export const createAssignment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { dueDate, questionTypes, additionalInfo, totalMarks, totalQuestions } = req.body;

    const newAssignment = new Assignment({
      dueDate,
      questionTypes,
      additionalInfo,
      totalMarks,
      totalQuestions,
      status: 'pending',
    });

    const savedAssignment = await newAssignment.save();

    await assignmentQueue.add('generate-paper', {
      assignmentId: savedAssignment._id,
      promptData: req.body,
    });

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

export const getAssignmentStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const assignment = await Assignment.findById(id);

    if (!assignment) {
      res.status(404).json({ success: false, message: 'Assignment not found' });
      return;
    }

    res.status(200).json({
      success: true,
      status: assignment.status,
      generatedPaper: assignment.generatedPaper,
    });
  } catch (error) {
    console.error('Error in getAssignmentStatus:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

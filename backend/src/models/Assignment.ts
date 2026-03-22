import mongoose, { Schema, Document } from 'mongoose';

// 1. Typescript Interfaces (The "Spellchecker")
// This tells TypeScript exactly what shape our data should have.
export interface IQuestionType {
  type: string;
  count: number;
  marks: number;
}

export interface IAssignment extends Document {
  dueDate: string;
  questionTypes: IQuestionType[];
  additionalInfo: string;
  totalMarks: number;
  totalQuestions: number;
  status: 'pending' | 'completed' | 'failed';
  generatedPaper: any; // We will store the final AI JSON output here
  createdAt: Date;
}

// 2. Mongoose Schema (The "Database Rules")
// This tells MongoDB exactly how to store the data and what is required.
const AssignmentSchema: Schema = new Schema({
  dueDate: { type: String, required: true },
  
  // Array of question type objects
  questionTypes: [{
    type: { type: String, required: true },
    count: { type: Number, required: true },
    marks: { type: Number, required: true }
  }],
  
  additionalInfo: { type: String, default: "" },
  totalMarks: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  
  // When an assignment is first created, it is "pending" while the AI works
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed'], 
    default: 'pending' 
  },
  
  // This will temporarily be null until the AI gives us the questions
  generatedPaper: { type: Schema.Types.Mixed, default: null },
  
  createdAt: { type: Date, default: Date.now }
});

// Export the model so we can use it to save things to the database
export default mongoose.model<IAssignment>('Assignment', AssignmentSchema);

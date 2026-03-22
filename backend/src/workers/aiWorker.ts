import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import Assignment from '../models/Assignment';
import { getIO } from '../lib/socket';

dotenv.config();

// 1. Same Redis Connection we used for the Queue
const connection = new IORedis(process.env.REDIS_URL as string, {
  maxRetriesPerRequest: null,
});

// 2. Initialize Google Gemini AI Service
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY as string });

// 3. The Actual Worker Process
export const aiWorker = new Worker('assignment-generation', async (job: Job) => {
  console.log(`[Worker] Picked up job ${job.id} for Assignment ${job.data.assignmentId}`);
  
  const { assignmentId, promptData } = job.data;
  
  try {
    // Tell the database we are officially processing it (optional, but good practice)
    await Assignment.findByIdAndUpdate(assignmentId, { status: 'processing' });

    // 4. Construct the prompt for Gemini
    const promptMessage = `
      You are an expert teacher. Generate an exact JSON response for a test paper.
      Subject / Info: ${promptData.additionalInfo}
      Questions Required: ${promptData.totalQuestions} questions in total.
      Marks: ${promptData.totalMarks} total marks.
      Types of questions: ${JSON.stringify(promptData.questionTypes)}
      
      Output ONLY raw JSON format matching this structure:
      {
        "paper": [
          { "type": "MCQ", "question": "...", "options": ["A", "B", "C", "D"], "answer": "...", "marks": 1 },
          { "type": "Subjective", "question": "...", "answer": "...", "marks": 5 }
        ]
      }
    `;

    // 5. Ask Gemini to generate it
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptMessage,
      config: {
        responseMimeType: 'application/json',
      }
    });

    // 6. Parse the response into readable JSON
    let generatedJson = JSON.parse(response.text || '{}');

    // 7. Save the completed paper back into MongoDB!
    await Assignment.findByIdAndUpdate(assignmentId, {
      status: 'completed',
      generatedPaper: generatedJson,
    });

    console.log(`[Worker] ✅ Successfully generated and saved Assignment ${assignmentId}`);

    // 8. Ping the active user via WebSockets so their browser automatically updates!
    try {
      const io = getIO();
      // We only broadcast to the specific "room" that matches the assignmentId
      io.to(assignmentId).emit('assignment-completed', {
        success: true,
        assignmentId,
        generatedPaper: generatedJson,
      });
      console.log(`[Worker] 📡 Real-time notification sent to frontend for ${assignmentId}`);
    } catch (socketError) {
      console.error(`[Worker] ⚠️ Socket ping failed:`, socketError);
    }

  } catch (error) {
    console.error(`[Worker] ❌ Failed to generate paper for ${assignmentId}:`, error);
    
    // If anything fails (like AI server is down), mark the paper as failed in DB
    await Assignment.findByIdAndUpdate(assignmentId, {
      status: 'failed',
    });
    
    throw error;
  }
}, { connection: connection as any });

// Log when the worker starts listening
aiWorker.on('ready', () => {
    console.log('👷 AI Worker is awake and listening for assigned tasks...');
});

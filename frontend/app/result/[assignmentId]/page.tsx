"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { io } from "socket.io-client";
import { CheckCircle, Loader2, ArrowLeft, AlertCircle } from "lucide-react";

interface Question {
  type: string;
  question: string;
  options?: string[];
  answer: string;
  marks: number;
}

interface GeneratedPaper {
  paper: Question[];
}

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.assignmentId as string;

  const [status, setStatus] = useState<"waiting" | "completed" | "failed">("waiting");
  const [paper, setPaper] = useState<GeneratedPaper | null>(null);

  useEffect(() => {
    if (!assignmentId) return;

    // Connect to the backend Socket.io server
    const socket = io("http://localhost:5000");

    // Join the room for this specific assignment
    socket.emit("join-assignment", assignmentId);

    // Listen for the completion event from the AI Worker
    socket.on("assignment-completed", (data: { success: boolean; generatedPaper: GeneratedPaper }) => {
      if (data.success) {
        setPaper(data.generatedPaper);
        setStatus("completed");
      } else {
        setStatus("failed");
      }
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [assignmentId]);

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => router.push("/")} className="p-2 hover:bg-gray-200 rounded-full transition">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">Generated Assignment</h1>
      </div>

      {/* Waiting State */}
      {status === "waiting" && (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6 text-center">
          <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center">
            <Loader2 size={40} className="text-orange-500 animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">AI is generating your paper...</h2>
          <p className="text-gray-500 max-w-md">
            Our AI is crafting your assignment right now. This usually takes 10–30 seconds. 
            This page will automatically update when it's ready!
          </p>
          <div className="flex gap-2 mt-2">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: "300ms" }} />
          </div>
        </div>
      )}

      {/* Failed State */}
      {status === "failed" && (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 text-center">
          <AlertCircle size={56} className="text-red-400" />
          <h2 className="text-2xl font-bold text-gray-800">Generation Failed</h2>
          <p className="text-gray-500">Something went wrong while generating your assignment. Please try again.</p>
          <button onClick={() => router.push("/create")} className="mt-4 px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition">
            Try Again
          </button>
        </div>
      )}

      {/* Completed State */}
      {status === "completed" && paper && (
        <div>
          <div className="flex items-center gap-3 mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl">
            <CheckCircle size={24} className="text-green-500" />
            <p className="font-semibold text-green-800">Your assignment paper is ready!</p>
          </div>

          <div className="space-y-4">
            {paper.paper.map((q, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-start gap-3">
                    <span className="font-bold text-gray-400 text-sm mt-0.5">Q{index + 1}.</span>
                    <p className="font-semibold text-gray-900">{q.question}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <span className="text-xs font-medium bg-orange-100 text-orange-700 px-2 py-1 rounded-full">{q.type}</span>
                    <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{q.marks} mark{q.marks !== 1 ? "s" : ""}</span>
                  </div>
                </div>

                {/* MCQ Options */}
                {q.options && q.options.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 mb-3 ml-6">
                    {q.options.map((opt, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg text-sm">
                        <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                          {String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                      </div>
                    ))}
                  </div>
                )}

                {/* Answer */}
                <div className="ml-6 mt-3 p-3 bg-green-50 border border-green-100 rounded-xl">
                  <p className="text-xs font-semibold text-green-700 mb-1">Answer</p>
                  <p className="text-sm text-green-900">{q.answer}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex gap-4">
            <button onClick={() => router.push("/create")} className="px-6 py-3 border border-gray-200 rounded-full font-medium hover:bg-gray-50 transition">
              Create Another
            </button>
            <button onClick={() => window.print()} className="px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition">
              Print / Save as PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

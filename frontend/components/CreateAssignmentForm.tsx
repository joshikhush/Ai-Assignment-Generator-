"use client";
import React from "react";
import { UploadCloud, Plus, X, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { useAssignmentStore } from "@/store/useAssignmentStore";
import { useRouter } from "next/navigation";

export default function CreateAssignmentForm() {
  const router = useRouter();

  const {
    dueDate,
    setDueDate,
    questionTypes,
    addQuestionType,
    updateQuestionType,
    removeQuestionType,
    additionalInfo,
    setAdditionalInfo,
    isSubmitting,
    setIsSubmitting,
  } = useAssignmentStore();

  const totalQuestions = questionTypes.reduce((acc, q) => acc + q.count, 0);
  const totalMarks = questionTypes.reduce((acc, q) => acc + q.count * q.marks, 0);

  const handleNextSubmit = async () => {
    if (!dueDate) {
      alert("Please select a Due Date for your assignment before proceeding.");
      return;
    }
    if (totalQuestions === 0 || totalMarks === 0) {
      alert("Your assignment must contain at least 1 question and 1 mark.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        dueDate,
        totalQuestions,
        totalMarks,
        questionTypes,
        additionalInfo,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/assignments/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Something went wrong. Please try again.");
      }

      // Navigate to the result page where we wait for the AI to finish
      router.push(`/result/${data.assignmentId}`);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <button onClick={() => router.push('/')} className="p-2 hover:bg-gray-200 rounded-full transition">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold">Assignment</h1>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <h2 className="text-lg font-bold">Create Assignment</h2>
      </div>
      <p className="text-gray-500 mb-8">Set up a new assignment for your students</p>

      {/* Main Form Card */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold mb-1">Assignment Details</h3>
        <p className="text-gray-500 text-sm mb-8">Basic information about your assignment.</p>

        {/* Upload Area */}
        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center mb-8 hover:bg-gray-50 transition cursor-pointer">
          <UploadCloud className="text-gray-400 mb-3" size={32} />
          <p className="font-semibold text-gray-700 mb-1">Choose a file or drag &amp; drop it here</p>
          <p className="text-xs text-gray-400 mb-4">JPEG, PNG, upto 10MB</p>
          <button className="px-6 py-2 border border-gray-200 rounded-full text-sm font-medium hover:border-gray-300">
            Browse File
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Due Date */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Due Date</label>
            <div className="relative">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              />
            </div>
          </div>

          {/* Question Types */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-gray-900">Question Type</label>
              <div className="flex gap-12 mr-16 text-sm font-medium text-gray-500">
                <span>No. of Questions</span>
                <span>Marks</span>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              {questionTypes.map((qt) => (
                <div key={qt.id} className="flex items-center gap-4">
                  <button
                    onClick={() => removeQuestionType(qt.id)}
                    className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <X size={16} />
                  </button>

                  <select
                    value={qt.type}
                    onChange={(e) => updateQuestionType(qt.id, 'type', e.target.value)}
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none"
                  >
                    <option value="Multiple Choice Questions">Multiple Choice Questions</option>
                    <option value="Short Questions">Short Questions</option>
                    <option value="Diagram/Graph-Based Questions">Diagram/Graph-Based Questions</option>
                    <option value="Numerical Problems">Numerical Problems</option>
                  </select>

                  <span className="text-gray-400">×</span>

                  {/* Number of Questions Counter */}
                  <div className="w-24 flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                    <button onClick={() => updateQuestionType(qt.id, 'count', qt.count - 1)} className="text-gray-400 hover:text-black font-bold px-1">−</button>
                    <span className="font-medium text-sm">{qt.count}</span>
                    <button onClick={() => updateQuestionType(qt.id, 'count', qt.count + 1)} className="text-gray-400 hover:text-black font-bold px-1">+</button>
                  </div>

                  {/* Marks Counter */}
                  <div className="w-24 flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
                    <button onClick={() => updateQuestionType(qt.id, 'marks', qt.marks - 1)} className="text-gray-400 hover:text-black font-bold px-1">−</button>
                    <span className="font-medium text-sm">{qt.marks}</span>
                    <button onClick={() => updateQuestionType(qt.id, 'marks', qt.marks + 1)} className="text-gray-400 hover:text-black font-bold px-1">+</button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={addQuestionType}
              className="flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-orange-500 transition mt-4"
            >
              <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center">
                <Plus size={16} />
              </div>
              Add Question Type
            </button>
          </div>

          {/* Totals Summary */}
          <div className="flex flex-col items-end gap-1 text-sm font-medium text-gray-900 mt-6 pt-6 border-t border-gray-100">
            <p>Total Questions : {totalQuestions}</p>
            <p>Total Marks : {totalMarks}</p>
          </div>

          {/* Additional Info */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Additional Information (For better output)</label>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm min-h-[100px] focus:outline-none focus:ring-2 focus:ring-orange-500/20"
              placeholder="e.g. Generate a question paper for 3-hour exam duration..."
            ></textarea>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-between items-center mt-10 pt-6">
          <button onClick={() => router.push('/')} className="flex items-center gap-2 px-6 py-3 border border-gray-200 rounded-full font-medium hover:bg-gray-50 transition">
            <ArrowLeft size={18} /> Previous
          </button>
          <button
            onClick={handleNextSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-8 py-3 bg-[#1a1a1a] text-white rounded-full font-medium hover:bg-gray-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Generating...
              </>
            ) : (
              <>
                Next <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

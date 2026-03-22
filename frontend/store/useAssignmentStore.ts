import { create } from "zustand";

export interface QuestionType {
  id: string;
  type: string;
  count: number;
  marks: number;
}

interface AssignmentState {
  dueDate: string;
  setDueDate: (date: string) => void;

  questionTypes: QuestionType[];
  addQuestionType: () => void;
  updateQuestionType: (id: string, field: keyof QuestionType, value: any) => void;
  removeQuestionType: (id: string) => void;

  additionalInfo: string;
  setAdditionalInfo: (info: string) => void;
  
  isSubmitting: boolean;
  setIsSubmitting: (status: boolean) => void;
}

const defaultQuestionTypes: QuestionType[] = [
  { id: "1", type: "Multiple Choice Questions", count: 4, marks: 1 },
  { id: "2", type: "Short Questions", count: 3, marks: 2 },
];

export const useAssignmentStore = create<AssignmentState>((set) => ({
  dueDate: "",
  setDueDate: (date) => set({ dueDate: date }),

  questionTypes: defaultQuestionTypes,
  
  addQuestionType: () =>
    set((state) => ({
      questionTypes: [
        ...state.questionTypes,
        { id: Date.now().toString(), type: "Multiple Choice Questions", count: 1, marks: 1 },
      ],
    })),

  updateQuestionType: (id, field, value) => {
    // Basic validation: Don't allow negative numbers for count or marks
    if ((field === "count" || field === "marks") && typeof value === 'number' && value < 1) {
      value = 1;
    }

    set((state) => ({
      questionTypes: state.questionTypes.map((q) =>
        q.id === id ? { ...q, [field]: value } : q
      ),
    }));
  },

  removeQuestionType: (id) =>
    set((state) => ({
      // Don't let them remove the very last question type (we need at least one!)
      questionTypes: state.questionTypes.length > 1 
        ? state.questionTypes.filter((q) => q.id !== id) 
        : state.questionTypes,
    })),

  additionalInfo: "",
  setAdditionalInfo: (info) => set({ additionalInfo: info }),
  
  isSubmitting: false,
  setIsSubmitting: (status) => set({ isSubmitting: status })
}));

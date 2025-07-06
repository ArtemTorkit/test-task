export type QuestionType = "BOOLEAN" | "INPUT" | "CHECKBOX";

export interface QuizOption {
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id?: string;
  text: string;
  type: QuestionType;
  options: QuizOption[];
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

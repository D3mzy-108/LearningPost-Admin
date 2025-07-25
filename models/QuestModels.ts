export interface Quest {
  id: string | number;
  cover: string;
  title: string;
  grade: string;
  category: string;
  time: number | string;
  bookmark_count: number;
  question_count: number;
  rating: number;
  about: string | null;
  instructions: string | null;
  organization: string | null;
}

export interface Question {
  questionid: string | number;
  comprehension: string | null;
  diagram: string | null;
  question: string;
  a: string;
  b: string;
  c: string;
  d: string;
  answer: string;
  explanation: string;
  topic: string | null;
}

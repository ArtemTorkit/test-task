import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import QuestionCard from "../components/QuestionCard";
import { AddQuestionForm } from "../components/AddQuestionForm";
import type { Question, Quiz, QuizOption } from "../services/types";

const QuizDetail = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionType, setNewQuestionType] = useState<
    "BOOLEAN" | "INPUT" | "CHECKBOX"
  >("BOOLEAN");

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const fetchQuiz = async () => {
    try {
      const res = await axios.get(`http://localhost:1111/quizzes/${id}`);
      setQuiz(res.data);
    } catch (err) {
      setError("Failed to load quiz. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async (newQuestion: Question) => {
    try {
      let options = newQuestion.options;
      // Add default options for boolean questions if none provided
      if (newQuestion.type === "BOOLEAN" && options.length === 0) {
        options = [
          { text: "True", isCorrect: true },
          { text: "False", isCorrect: false },
        ];
      }

      const response = await axios.post(
        `http://localhost:1111/quizzes/${id}/questions`,
        {
          text: newQuestion.text,
          type: newQuestion.type,
          options: newQuestion.type === "CHECKBOX" ? options : [],
        },
      );

      setQuiz((prev) => ({
        ...prev!,
        questions: [...prev!.questions, response.data],
      }));
    } catch (err) {
      console.error("Failed to add question:", err);
      setError("Failed to add question");
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    try {
      await axios.delete(`http://localhost:1111/questions/${questionId}`);
      setQuiz((prev) => ({
        ...prev!,
        questions: prev!.questions.filter((q) => q.id !== questionId),
      }));
    } catch (err) {
      console.error("Failed to delete question:", err);
      setError("Failed to delete question");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (!quiz) return <div className="p-4">Quiz not found.</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{quiz.title}</h1>

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Add New Question</h2>
        <AddQuestionForm onSubmit={handleAddQuestion} submitButton={true} />
      </div>

      {/* Questions List */}
      {quiz.questions.map((q, idx) => (
        <div key={q.id} className="relative mb-6">
          <QuestionCard question={q} index={idx} />
          <button
            onClick={() => handleDeleteQuestion(q.id)}
            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            title="Delete question"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default QuizDetail;

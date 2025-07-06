import React, { useState } from "react";

type Option = {
  text: string;
  isCorrect: boolean;
};

type Question = {
  id: string;
  text: string;
  type: "BOOLEAN" | "INPUT" | "CHECKBOX";
  options?: Option[];
};

type QuestionCardProps = {
  question: Question;
  index: number;
};

const QuestionCard: React.FC<QuestionCardProps> = ({ question, index }) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [inputAnswer, setInputAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);

  const handleOptionSelect = (optionText: string) => {
    setSelectedOption(optionText);
    setShowFeedback(false);
  };

  const handleSubmit = () => {
    setShowFeedback(true);
  };

  const renderBooleanQuestion = () => (
    <div className="space-y-2">
      <div className="flex space-x-4">
        <button
          className={`px-4 py-2 rounded ${selectedOption === "True" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => handleOptionSelect("True")}
        >
          True
        </button>
        <button
          className={`px-4 py-2 rounded ${selectedOption === "False" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => handleOptionSelect("False")}
        >
          False
        </button>
      </div>
      {showFeedback && (
        <p className="text-sm mt-2">
          {selectedOption === "True" && question.options?.[0].isCorrect
            ? "Correct!"
            : "Incorrect!"}
        </p>
      )}
    </div>
  );

  const renderInputQuestion = () => (
    <div className="space-y-2">
      <input
        type="text"
        value={inputAnswer}
        onChange={(e) => setInputAnswer(e.target.value)}
        className="border rounded p-2 w-full"
        placeholder="Your answer..."
      />
      {showFeedback && (
        <p className="text-sm mt-2">
          {inputAnswer.trim().toLowerCase() ===
          question.options?.[0].text.toLowerCase()
            ? "Correct!"
            : `Incorrect! The correct answer is: ${question.options?.[0].text}`}
        </p>
      )}
    </div>
  );

  const renderCheckboxQuestion = () => (
    <div className="space-y-2">
      <ul className="space-y-2">
        {question.options?.map((opt, i) => (
          <li key={i}>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedOption === opt.text}
                onChange={() => handleOptionSelect(opt.text)}
                className="form-checkbox"
              />
              <span>{opt.text}</span>
            </label>
          </li>
        ))}
      </ul>
      {showFeedback && (
        <div className="text-sm mt-2">
          {selectedOption &&
          question.options?.find((opt) => opt.text === selectedOption)
            ?.isCorrect
            ? "Correct!"
            : "Incorrect!"}
        </div>
      )}
    </div>
  );

  return (
    <div className="mb-6 p-4 bg-white shadow rounded-lg border border-gray-200">
      <h2 className="font-semibold text-lg mb-2">
        {index + 1}. {question.text}
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Type:{" "}
        {question.type === "BOOLEAN"
          ? "True/False"
          : question.type === "INPUT"
            ? "Short answer"
            : "Multiple choice"}
      </p>

      {question.type === "BOOLEAN" && renderBooleanQuestion()}
      {question.type === "INPUT" && renderInputQuestion()}
      {question.type === "CHECKBOX" && renderCheckboxQuestion()}

    </div>
  );
};

export default QuestionCard;

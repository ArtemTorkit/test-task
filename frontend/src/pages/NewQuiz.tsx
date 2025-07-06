import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";

type QuestionType = "BOOLEAN" | "INPUT" | "CHECKBOX";

interface QuizOption {
  text: string;
  isCorrect: boolean;
}

interface Question {
  text: string;
  type: QuestionType;
  options: QuizOption[];
}

interface QuizFormData {
  title: string;
  questions: Question[];
}

const QUESTION_TYPES: QuestionType[] = ["BOOLEAN", "INPUT", "CHECKBOX"];

export default function NewQuiz() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
    trigger,
  } = useForm<QuizFormData>({
    defaultValues: {
      title: "",
      questions: [],
    },
  });

  const [questionCount, setQuestionCount] = useState(0);

  const handleAddQuestion = () => {
    const questions = getValues("questions");
    setValue("questions", [
      ...questions,
      { text: "", type: "BOOLEAN", options: [] },
    ]);
    setQuestionCount(questionCount + 1);
  };

  const handleRemoveQuestion = (index: number) => {
    const questions = getValues("questions");
    setValue(
      "questions",
      questions.filter((_, i) => i !== index),
    );
    trigger("questions"); // Re-trigger validation
  };

  const handleAddOption = (questionIndex: number) => {
    const questions = getValues("questions");
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.push({ text: "", isCorrect: false });
    setValue("questions", newQuestions);
  };

  const handleRemoveOption = (questionIndex: number, optionIndex: number) => {
    const questions = getValues("questions");
    const newQuestions = [...questions];
    newQuestions[questionIndex].options.splice(optionIndex, 1);
    setValue("questions", newQuestions);
    trigger("questions"); // Re-trigger validation
  };

  const onSubmit = async (data: QuizFormData) => {
    try {
      await axios.post("http://localhost:1111/quizzes", data);
      alert("Quiz created successfully!");
      // Reset form
      setValue("title", "");
      setValue("questions", []);
      setQuestionCount(0);
    } catch (error) {
      console.error("Error creating quiz:", error);
      alert("Failed to create quiz");
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Create a New Quiz</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block font-semibold">Quiz Title *</label>
          <Controller
            name="title"
            control={control}
            rules={{ required: "Title is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="border w-full px-2 py-1"
              />
            )}
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}
        </div>

        <Controller
          name="questions"
          control={control}
          rules={{
            validate: (questions) =>
              questions.length > 0 || "At least one question is required",
          }}
          render={({ field }) => (
            <>
              {field.value.map((question, i) => (
                <div key={i} className="border p-3 mb-4 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <strong>Question {i + 1}</strong>
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(i)}
                      className="text-red-600"
                    >
                      Remove
                    </button>
                  </div>

                  <Controller
                    name={`questions.${i}.text`}
                    control={control}
                    rules={{ required: "Question text is required" }}
                    render={({ field }) => (
                      <>
                        <input
                          {...field}
                          type="text"
                          placeholder="Question text"
                          className="border w-full px-2 py-1 mb-2"
                        />
                        {errors.questions?.[i]?.text && (
                          <p className="text-red-500 text-sm">
                            {errors.questions[i]?.text?.message}
                          </p>
                        )}
                      </>
                    )}
                  />

                  <Controller
                    name={`questions.${i}.type`}
                    control={control}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="border px-2 py-1 mb-2"
                        onChange={(e) => {
                          field.onChange(e);
                          // Clear options if not CHECKBOX
                          if (e.target.value !== "CHECKBOX") {
                            const questions = getValues("questions");
                            const newQuestions = [...questions];
                            newQuestions[i].options = [];
                            setValue("questions", newQuestions);
                          }
                        }}
                      >
                        {QUESTION_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    )}
                  />

                  {question.type === "CHECKBOX" && (
                    <div className="mt-2">
                      <p className="font-semibold mb-1">Options *</p>
                      {question.options.map((option, j) => (
                        <div key={j} className="flex gap-2 mb-1">
                          <Controller
                            name={`questions.${i}.options.${j}.text`}
                            control={control}
                            rules={{
                              required: "Option text is required",
                              validate: (value) => {
                                const options = getValues(
                                  `questions.${i}.options`,
                                );
                                if (
                                  question.type === "CHECKBOX" &&
                                  options.length < 1
                                ) {
                                  return "At least one option is required";
                                }
                                return true;
                              },
                            }}
                            render={({ field }) => (
                              <input
                                {...field}
                                type="text"
                                placeholder="Option text"
                                className="border px-2 py-1 flex-1"
                              />
                            )}
                          />
                          <Controller
                            name={`questions.${i}.options.${j}.isCorrect`}
                            control={control}
                            render={({ field }) => (
                              <label>
                                <input
                                  {...field}
                                  type="checkbox"
                                  checked={field.value}
                                  onChange={(e) =>
                                    field.onChange(e.target.checked)
                                  }
                                />{" "}
                                Correct
                              </label>
                            )}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveOption(i, j)}
                            className="text-red-500"
                          >
                            X
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleAddOption(i)}
                        className="mt-1 text-blue-600"
                      >
                        + Add Option
                      </button>
                      {errors.questions?.[i]?.options && (
                        <p className="text-red-500 text-sm">
                          {errors.questions[i]?.options?.message ||
                            errors.questions[i]?.options?.root?.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ))}
              {errors.questions && (
                <p className="text-red-500 text-sm">
                  {errors.questions.message}
                </p>
              )}
            </>
          )}
        />

        <button
          type="button"
          onClick={handleAddQuestion}
          className="bg-gray-200 px-3 py-1 rounded mb-4"
        >
          Add Question
        </button>

        <br />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Quiz
        </button>
      </form>
    </div>
  );
}

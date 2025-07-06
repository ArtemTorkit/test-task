import { useForm, Controller } from "react-hook-form";
import type { Question, QuestionType, QuizOption } from "../services/types";

interface AddQuestionFormProps {
  initialQuestion?: Partial<Question>;
  onSubmit: (question: Question) => Promise<void>;
  onCancel?: () => void;
  submitButtonText?: string;
}

export const AddQuestionForm = ({
  initialQuestion = { text: "", type: "BOOLEAN", options: [] },
  onSubmit,
  onCancel,
  submitButtonText = "Add Question",
}: AddQuestionFormProps) => {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<Question>({
    defaultValues: {
      text: initialQuestion.text || "",
      type: initialQuestion.type || "BOOLEAN",
      options: initialQuestion.options || [],
    },
  });

  const questionType = watch("type");

  const handleAddOption = () => {
    const currentOptions = getValues("options");
    setValue("options", [...currentOptions, { text: "", isCorrect: false }]);
  };

  const handleRemoveOption = (index: number) => {
    const currentOptions = getValues("options");
    const newOptions = currentOptions.filter((_, i) => i !== index);
    setValue("options", newOptions);
  };

  const handleFormSubmit = async (data: Question) => {
    try {
      // Add default options for boolean questions if none provided
      if (data.type === "BOOLEAN" && data.options.length === 0) {
        data.options = [
          { text: "True", isCorrect: true },
          { text: "False", isCorrect: false },
        ];
      }

      await onSubmit(data);

      // Reset form after successful submission if no initial question was provided
      if (!initialQuestion.text) {
        reset({
          text: "",
          type: "BOOLEAN",
          options: [],
        });
      }
    } catch (error) {
      console.error("Failed to submit question:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4 p-4 bg-gray-50 rounded-lg"
    >
      <div>
        <label htmlFor="question-text" className="block font-medium mb-1">
          Question Text *
        </label>
        <Controller
          name="text"
          control={control}
          rules={{ required: "Question text is required" }}
          render={({ field }) => (
            <input
              {...field}
              id="question-text"
              type="text"
              placeholder="Enter your question"
              className="w-full p-2 border rounded"
            />
          )}
        />
        {errors.text && (
          <p className="text-red-500 text-sm mt-1">{errors.text.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="question-type" className="block font-medium mb-1">
          Question Type *
        </label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <select
              {...field}
              id="question-type"
              className="w-full p-2 border rounded"
              onChange={(e) => {
                field.onChange(e);
                // Clear options if not CHECKBOX
                if (e.target.value !== "CHECKBOX") {
                  setValue("options", []);
                }
              }}
            >
              <option value="BOOLEAN">True/False</option>
              <option value="INPUT">Short Answer</option>
              <option value="CHECKBOX">Multiple Choice</option>
            </select>
          )}
        />
      </div>

      {questionType === "CHECKBOX" && (
        <div className="space-y-2">
          <label className="block font-medium">Options *</label>
          <Controller
            name="options"
            control={control}
            rules={{
              validate: (options) =>
                options.length > 0 || "At least one option is required",
            }}
            render={({ field }) => (
              <>
                {field.value.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Controller
                      name={`options.${index}.text`}
                      control={control}
                      rules={{ required: "Option text is required" }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          placeholder="Option text"
                          className="flex-1 p-2 border rounded"
                        />
                      )}
                    />
                    <Controller
                      name={`options.${index}.isCorrect`}
                      control={control}
                      render={({ field }) => (
                        <label className="flex items-center gap-1">
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={(e) => field.onChange(e.target.checked)}
                          />
                          Correct
                        </label>
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(index)}
                      className="text-red-500 p-1"
                      aria-label="Remove option"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {errors.options && (
                  <p className="text-red-500 text-sm">
                    {errors.options.message}
                  </p>
                )}
              </>
            )}
          />
          <button
            type="button"
            onClick={handleAddOption}
            className="text-blue-600 text-sm"
          >
            + Add Option
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
        >
          {isSubmitting ? "Processing..." : submitButtonText}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

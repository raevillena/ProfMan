import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createQuiz } from '../features/quizzes/quizzesSlice';
import { Button } from './Button';
import { Input } from './Input';
import { QuizQuestion } from '../types/quiz';

interface CreateQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onQuizCreated: () => void;
  branches: Array<{
    id: string;
    title: string;
    description: string;
  }>;
}

interface QuizFormData {
  branchId: string;
  title: string;
  description: string;
  timeLimit: number;
  attemptsAllowed: number;
  questions: Omit<QuizQuestion, 'id'>[];
}

const CreateQuizModal: React.FC<CreateQuizModalProps> = ({
  isOpen,
  onClose,
  onQuizCreated,
  branches,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<QuizFormData>({
    branchId: '',
    title: '',
    description: '',
    timeLimit: 30,
    attemptsAllowed: 1,
    questions: [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await dispatch(createQuiz({
        branchId: formData.branchId,
        title: formData.title,
        description: formData.description,
        timeLimit: formData.timeLimit,
        attemptsAllowed: formData.attemptsAllowed,
        questions: formData.questions,
      })).unwrap();
      
      // Reset form and close modal
      setFormData({
        branchId: '',
        title: '',
        description: '',
        timeLimit: 30,
        attemptsAllowed: 1,
        questions: [],
      });
      onQuizCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'timeLimit' || name === 'attemptsAllowed' ? parseInt(value) || 0 : value,
    }));
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          type: 'multiple_choice' as const,
          question: '',
          options: ['', '', '', ''],
          correctAnswer: '',
          points: 1,
          explanation: '',
        }
      ]
    }));
  };

  const removeQuestion = (index: number) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.filter((_, i) => i !== index)
    }));
  };

  const updateQuestion = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === index ? { ...q, [field]: value } : q
      )
    }));
  };

  const updateQuestionOption = (questionIndex: number, optionIndex: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      questions: prev.questions.map((q, i) => 
        i === questionIndex 
          ? { 
              ...q, 
              options: q.options?.map((opt, j) => j === optionIndex ? value : opt) || []
            }
          : q
      )
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Create New Quiz</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Basic Quiz Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Branch *
                </label>
                <select
                  name="branchId"
                  value={formData.branchId}
                  onChange={handleChange}
                  className="input"
                  required
                >
                  <option value="">Select a branch</option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>
                      {branch.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quiz Title *
                </label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Midterm Exam"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description of the quiz..."
                className="input min-h-[80px] resize-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Limit (minutes)
                </label>
                <Input
                  type="number"
                  name="timeLimit"
                  value={formData.timeLimit}
                  onChange={handleChange}
                  min="1"
                  placeholder="30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attempts Allowed
                </label>
                <Input
                  type="number"
                  name="attemptsAllowed"
                  value={formData.attemptsAllowed}
                  onChange={handleChange}
                  min="1"
                  placeholder="1"
                />
              </div>

              <div className="flex items-end">
                <Button
                  type="button"
                  onClick={addQuestion}
                  variant="outline"
                  className="w-full"
                >
                  Add Question
                </Button>
              </div>
            </div>

            {/* Questions */}
            {formData.questions.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Questions</h3>
                <div className="space-y-6">
                  {formData.questions.map((question, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-medium text-gray-900">Question {index + 1}</h4>
                        <Button
                          type="button"
                          onClick={() => removeQuestion(index)}
                          variant="danger"
                          size="sm"
                        >
                          Remove
                        </Button>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Question Text *
                          </label>
                          <textarea
                            value={question.question}
                            onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                            className="input"
                            rows={2}
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Question Type
                            </label>
                            <select
                              value={question.type}
                              onChange={(e) => updateQuestion(index, 'type', e.target.value)}
                              className="input"
                            >
                              <option value="multiple_choice">Multiple Choice</option>
                              <option value="multiple_select">Multiple Select</option>
                              <option value="true_false">True/False</option>
                              <option value="short_answer">Short Answer</option>
                              <option value="numeric">Numeric</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Points
                            </label>
                            <Input
                              type="number"
                              value={question.points}
                              onChange={(e) => updateQuestion(index, 'points', parseInt(e.target.value) || 1)}
                              min="1"
                              className="input"
                            />
                          </div>
                        </div>

                        {/* Options for multiple choice/select */}
                        {(question.type === 'multiple_choice' || question.type === 'multiple_select') && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Options
                            </label>
                            <div className="space-y-2">
                              {question.options?.map((option, optIndex) => (
                                <Input
                                  key={optIndex}
                                  type="text"
                                  value={option}
                                  onChange={(e) => updateQuestionOption(index, optIndex, e.target.value)}
                                  placeholder={`Option ${optIndex + 1}`}
                                  className="input"
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Correct Answer *
                          </label>
                          {question.type === 'true_false' ? (
                            <select
                              value={question.correctAnswer}
                              onChange={(e) => updateQuestion(index, 'correctAnswer', e.target.value)}
                              className="input"
                            >
                              <option value="">Select answer</option>
                              <option value="true">True</option>
                              <option value="false">False</option>
                            </select>
                          ) : (
                            <Input
                              type="text"
                              value={question.correctAnswer}
                              onChange={(e) => updateQuestion(index, 'correctAnswer', e.target.value)}
                              placeholder="Enter correct answer"
                              required
                            />
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Explanation (optional)
                          </label>
                          <textarea
                            value={question.explanation || ''}
                            onChange={(e) => updateQuestion(index, 'explanation', e.target.value)}
                            placeholder="Explanation for the correct answer..."
                            className="input"
                            rows={2}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading || formData.questions.length === 0}
            >
              {loading ? 'Creating...' : 'Create Quiz'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateQuizModal;

import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createExam } from '../features/exams/examsSlice';
import { CreateExamRequest, ExamQuestion } from '../types/exam';
import { Button } from './Button';
import { Input } from './Input';
import { LoadingSpinner } from './LoadingSpinner';

interface Branch {
  id: string;
  title: string;
  description: string;
}

interface CreateExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExamCreated: () => void;
  branches: Branch[];
}

const CreateExamModal: React.FC<CreateExamModalProps> = ({
  isOpen,
  onClose,
  onExamCreated,
  branches
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateExamRequest>({
    branchId: '',
    title: '',
    description: '',
    instructions: '',
    totalPoints: 100,
    timeLimit: undefined,
    dueDate: '',
    allowLateSubmission: false,
    maxAttempts: 1,
    questions: []
  });

  const [questions, setQuestions] = useState<ExamQuestion[]>([
    {
      id: 'q1',
      type: 'multiple_choice',
      question: '',
      points: 10,
      options: ['', '', '', ''],
      correctAnswer: '',
      isRequired: true
    }
  ]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.branchId || !formData.title || questions.length === 0) {
      return;
    }

    setLoading(true);
    try {
      const examData: CreateExamRequest = {
        ...formData,
        questions: questions.map(q => ({
          type: q.type,
          question: q.question,
          points: q.points,
          options: q.options,
          correctAnswer: q.correctAnswer,
          fileTypes: q.fileTypes,
          maxFileSize: q.maxFileSize,
          isRequired: q.isRequired
        }))
      };

      await dispatch(createExam(examData)).unwrap();
      onExamCreated();
      onClose();
      resetForm();
    } catch (error) {
      console.error('Failed to create exam:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      branchId: '',
      title: '',
      description: '',
      instructions: '',
      totalPoints: 100,
      timeLimit: undefined,
      dueDate: '',
      allowLateSubmission: false,
      maxAttempts: 1,
      questions: []
    });
    setQuestions([
      {
        id: 'q1',
        type: 'multiple_choice',
        question: '',
        points: 10,
        options: ['', '', '', ''],
        correctAnswer: '',
        isRequired: true
      }
    ]);
  };

  const addQuestion = () => {
    const newQuestion: ExamQuestion = {
      id: `q${questions.length + 1}`,
      type: 'multiple_choice',
      question: '',
      points: 10,
      options: ['', '', '', ''],
      correctAnswer: '',
      isRequired: true
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const updateQuestion = (index: number, field: keyof ExamQuestion, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestions(updatedQuestions);
  };

  const updateQuestionOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[questionIndex].options) {
      updatedQuestions[questionIndex].options![optionIndex] = value;
    }
    setQuestions(updatedQuestions);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Exam</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Branch *
              </label>
              <select
                value={formData.branchId}
                onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
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
                Title *
              </label>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Exam title"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="input"
              rows={3}
              placeholder="Brief description of the exam"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instructions
            </label>
            <textarea
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              className="input"
              rows={3}
              placeholder="Instructions for students"
            />
          </div>

          {/* Exam Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Points *
              </label>
              <Input
                type="number"
                value={formData.totalPoints}
                onChange={(e) => setFormData({ ...formData, totalPoints: parseInt(e.target.value) || 0 })}
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Limit (minutes)
              </label>
              <Input
                type="number"
                value={formData.timeLimit || ''}
                onChange={(e) => setFormData({ ...formData, timeLimit: e.target.value ? parseInt(e.target.value) : undefined })}
                min="1"
                placeholder="No limit"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Attempts
              </label>
              <Input
                type="number"
                value={formData.maxAttempts || ''}
                onChange={(e) => setFormData({ ...formData, maxAttempts: e.target.value ? parseInt(e.target.value) : undefined })}
                min="1"
                placeholder="Unlimited"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date *
              </label>
              <Input
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.allowLateSubmission}
                  onChange={(e) => setFormData({ ...formData, allowLateSubmission: e.target.checked })}
                  className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <span className="ml-2 text-sm text-gray-700">Allow late submission</span>
              </label>
            </div>
          </div>

          {/* Questions */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Questions</h3>
              <Button
                type="button"
                onClick={addQuestion}
                variant="outline"
                size="sm"
              >
                Add Question
              </Button>
            </div>

            <div className="space-y-4">
              {questions.map((question, index) => (
                <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium text-gray-900">Question {index + 1}</h4>
                    {questions.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeQuestion(index)}
                        variant="danger"
                        size="sm"
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
                        <option value="true_false">True/False</option>
                        <option value="short_answer">Short Answer</option>
                        <option value="essay">Essay</option>
                        <option value="file_upload">File Upload</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Points
                      </label>
                      <Input
                        type="number"
                        value={question.points}
                        onChange={(e) => updateQuestion(index, 'points', parseInt(e.target.value) || 0)}
                        min="1"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Question Text
                    </label>
                    <textarea
                      value={question.question}
                      onChange={(e) => updateQuestion(index, 'question', e.target.value)}
                      className="input"
                      rows={3}
                      placeholder="Enter your question here"
                    />
                  </div>

                  {/* Options for multiple choice and true/false */}
                  {(question.type === 'multiple_choice' || question.type === 'true_false') && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Options
                      </label>
                      <div className="space-y-2">
                        {question.options?.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center space-x-2">
                            <Input
                              type="text"
                              value={option}
                              onChange={(e) => updateQuestionOption(index, optionIndex, e.target.value)}
                              placeholder={`Option ${optionIndex + 1}`}
                            />
                            {question.type === 'multiple_choice' && (
                              <input
                                type="radio"
                                name={`correct-${index}`}
                                value={optionIndex}
                                checked={question.correctAnswer === optionIndex.toString()}
                                onChange={(e) => updateQuestion(index, 'correctAnswer', e.target.value)}
                                className="text-blue-600"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Correct answer for true/false */}
                  {question.type === 'true_false' && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Correct Answer
                      </label>
                      <select
                        value={question.correctAnswer || ''}
                        onChange={(e) => updateQuestion(index, 'correctAnswer', e.target.value)}
                        className="input"
                      >
                        <option value="">Select correct answer</option>
                        <option value="true">True</option>
                        <option value="false">False</option>
                      </select>
                    </div>
                  )}

                  {/* File upload settings */}
                  {question.type === 'file_upload' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Allowed File Types
                        </label>
                        <Input
                          type="text"
                          value={question.fileTypes?.join(', ') || ''}
                          onChange={(e) => updateQuestion(index, 'fileTypes', e.target.value.split(',').map(t => t.trim()))}
                          placeholder="pdf, doc, docx"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Max File Size (MB)
                        </label>
                        <Input
                          type="number"
                          value={question.maxFileSize || ''}
                          onChange={(e) => updateQuestion(index, 'maxFileSize', e.target.value ? parseInt(e.target.value) : undefined)}
                          min="1"
                          placeholder="10"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={question.isRequired}
                      onChange={(e) => updateQuestion(index, 'isRequired', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700">Required question</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
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
              disabled={loading || !formData.branchId || !formData.title || questions.length === 0}
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Creating...
                </>
              ) : (
                'Create Exam'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExamModal;

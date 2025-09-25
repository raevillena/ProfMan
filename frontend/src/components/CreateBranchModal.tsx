import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createBranch } from '../features/branches/branchesSlice';
import { Button } from './Button';
import { Input } from './Input';

interface CreateBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBranchCreated: () => void;
  subjects: Array<{
    id: string;
    code: string;
    title: string;
    description: string;
    credits: number;
  }>;
  professorId: string;
}

interface CreateBranchForm {
  subjectId: string;
  title: string;
  description: string;
}

const CreateBranchModal: React.FC<CreateBranchModalProps> = ({
  isOpen,
  onClose,
  onBranchCreated,
  subjects,
  professorId,
}) => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<CreateBranchForm>({
    subjectId: '',
    title: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await dispatch(createBranch({
        ...formData,
        professorId,
        weekStructure: [], // Start with empty week structure
      })).unwrap();
      
      // Reset form and close modal
      setFormData({
        subjectId: '',
        title: '',
        description: '',
      });
      onBranchCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create branch');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subjectId = e.target.value;
    const selectedSubject = subjects.find(s => s.id === subjectId);
    
    setFormData(prev => ({
      ...prev,
      subjectId,
      title: selectedSubject ? `${selectedSubject.title} - ${new Date().getFullYear()}` : '',
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Create New Branch</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <select
                name="subjectId"
                value={formData.subjectId}
                onChange={handleSubjectChange}
                className="input"
                required
              >
                <option value="">Select a subject</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {subject.code} - {subject.title} ({subject.credits} credits)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Branch Title *
              </label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., CS101 - Fall 2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Brief description of this branch..."
                className="input min-h-[80px] resize-none"
                rows={3}
              />
            </div>
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
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Branch'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBranchModal;

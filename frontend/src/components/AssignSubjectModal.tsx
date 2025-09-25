import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { Input } from './Input';
import { LoadingSpinner } from './LoadingSpinner';
import { User } from '../types/user';
import { AssignSubjectRequest } from '../types/subject';

interface AssignSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (assignmentData: AssignSubjectRequest) => void;
  subjectTitle: string;
  currentAssignments: string[];
  professors: User[];
  loading?: boolean;
}

const AssignSubjectModal: React.FC<AssignSubjectModalProps> = ({
  isOpen,
  onClose,
  onAssign,
  subjectTitle,
  currentAssignments,
  professors,
  loading = false
}) => {
  const [selectedProfessors, setSelectedProfessors] = useState<string[]>(currentAssignments);
  const [searchTerm, setSearchTerm] = useState('');

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedProfessors(currentAssignments);
      setSearchTerm('');
    }
  }, [isOpen, currentAssignments]);

  const handleProfessorToggle = (professorId: string) => {
    setSelectedProfessors(prev => {
      if (prev.includes(professorId)) {
        return prev.filter(id => id !== professorId);
      } else {
        return [...prev, professorId];
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAssign({ professorIds: selectedProfessors });
  };

  const filteredProfessors = professors.filter(professor =>
    professor.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Assign Subject: {subjectTitle}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Professors
              </label>
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Professors ({selectedProfessors.length} selected)
              </label>
              <div className="border border-gray-300 rounded-md max-h-64 overflow-y-auto">
                {loading ? (
                  <div className="p-4 text-center">
                    <LoadingSpinner size="sm" />
                    <p className="text-sm text-gray-500 mt-2">Loading professors...</p>
                  </div>
                ) : filteredProfessors.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    No professors found
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {filteredProfessors.map((professor) => (
                      <label
                        key={professor.id}
                        className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedProfessors.includes(professor.id)}
                          onChange={() => handleProfessorToggle(professor.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <div className="ml-3 flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {professor.displayName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {professor.email}
                          </div>
                        </div>
                        {currentAssignments.includes(professor.id) && (
                          <span className="text-xs text-blue-600 font-medium">
                            Currently Assigned
                          </span>
                        )}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3">
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
                disabled={loading || selectedProfessors.length === 0}
              >
                {loading ? 'Assigning...' : 'Assign Subject'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignSubjectModal;

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { fetchSubjects } from '../features/subjects/subjectsSlice';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Input } from '../components/Input';

interface Subject {
  id: string;
  code: string;
  title: string;
  description: string;
  credits: number;
  isActive: boolean;
  assignedProfessors: string[];
}

const ProfessorSubjectsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { subjects, loading: subjectsLoading } = useSelector((state: RootState) => state.subjects);
  
  const [searchTerm, setSearchTerm] = useState('');

  // Load subjects assigned to this professor
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchSubjects({ isActive: true }));
    }
  }, [dispatch, user?.id]);

  // Filter subjects assigned to this professor
  const assignedSubjects = subjects.filter(subject => 
    subject.assignedProfessors?.includes(user?.id || '')
  );

  // Filter subjects based on search term
  const filteredSubjects = assignedSubjects.filter(subject => 
    searchTerm === '' || 
    subject.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subject.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (subjectsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">My Subjects</h1>
          <div className="text-sm text-gray-500">
            {assignedSubjects.length} subject{assignedSubjects.length !== 1 ? 's' : ''} assigned
          </div>
        </div>
        
        {/* Search */}
        <div className="max-w-md">
          <Input
            type="text"
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Subjects List */}
      <div className="bg-white rounded-lg shadow">
        {filteredSubjects.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-500 mb-4">
              {searchTerm ? 'No subjects found matching your search.' : 'No subjects assigned to you yet.'}
            </div>
            {!searchTerm && (
              <p className="text-sm text-gray-400">
                Contact your administrator to get subjects assigned to you.
              </p>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredSubjects.map((subject) => (
              <div key={subject.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {subject.title}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {subject.code}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {subject.credits} credit{subject.credits !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">
                      {subject.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>Status: {subject.isActive ? 'Active' : 'Inactive'}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Navigate to branches for this subject
                        window.location.href = `/professor/branches?subject=${subject.id}`;
                      }}
                    >
                      View Classes
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfessorSubjectsPage;

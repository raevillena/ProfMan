import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { fetchBranches } from '../features/branches/branchesSlice';
import { fetchSubjects } from '../features/subjects/subjectsSlice';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface Branch {
  id: string;
  subjectId: string;
  professorId: string;
  title: string;
  description: string;
  weekStructure: any[];
  isActive: boolean;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  updatedAt: {
    seconds: number;
    nanoseconds: number;
  };
}

interface Subject {
  id: string;
  code: string;
  title: string;
  description: string;
  credits: number;
  isActive: boolean;
}

const StudentDashboardPage: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { branches, loading: branchesLoading } = useSelector((state: RootState) => state.branches);
  const { subjects, loading: subjectsLoading } = useSelector((state: RootState) => state.subjects);
  
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Load available branches and subjects
  useEffect(() => {
    dispatch(fetchBranches({ isActive: true }));
    dispatch(fetchSubjects({ isActive: true }));
  }, [dispatch]);

  // Filter branches based on search term
  const filteredBranches = branches.filter(branch => {
    const matchesSearch = searchTerm === '' || 
      branch.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  // Get subject name by ID
  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? `${subject.code} - ${subject.title}` : 'Unknown Subject';
  };

  // Get subject code by ID
  const getSubjectCode = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.code : 'Unknown';
  };

  // Get subject credits by ID
  const getSubjectCredits = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.credits : 0;
  };

  if (branchesLoading || subjectsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-600 mt-2">View your enrolled courses and academic progress</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Enrolled Courses</p>
              <p className="text-2xl font-semibold text-gray-900">{branches.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">0</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900">{branches.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Credits</p>
              <p className="text-2xl font-semibold text-gray-900">
                {branches.reduce((total, branch) => {
                  const subject = subjects.find(s => s.id === branch.subjectId);
                  return total + (subject ? subject.credits : 0);
                }, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Courses
            </label>
            <input
              type="text"
              placeholder="Search by course title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input"
            />
          </div>
        </div>
      </div>

      {/* Course List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Your Enrolled Courses</h2>
        </div>

        {filteredBranches.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No courses found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {branches.length === 0 
                ? "You are not enrolled in any courses yet."
                : "Try adjusting your search criteria."
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredBranches.map((branch) => (
              <div key={branch.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {branch.title}
                      </h3>
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Enrolled
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {getSubjectName(branch.subjectId)}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      {branch.description}
                    </p>
                    <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                      <span>
                        {getSubjectCredits(branch.subjectId)} credits
                      </span>
                      <span>
                        {branch.weekStructure?.length || 0} weeks
                      </span>
                      <span>
                        Started {new Date(branch.createdAt.seconds * 1000).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => setSelectedBranch(branch)}
                      className="btn btn-outline btn-sm"
                    >
                      View Details
                    </Button>
                    <Button
                      onClick={() => {/* Navigate to course content */}}
                      className="btn btn-primary btn-sm"
                    >
                      Enter Course
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Course Details Modal */}
      {selectedBranch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Course Details</h2>
                <Button
                  onClick={() => setSelectedBranch(null)}
                  className="btn btn-ghost btn-sm"
                >
                  ✕
                </Button>
              </div>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium text-gray-900">{selectedBranch.title}</h3>
                  <p className="text-sm text-gray-600">{getSubjectName(selectedBranch.subjectId)}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                  <p className="text-sm text-gray-600">{selectedBranch.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Credits</h4>
                    <p className="text-sm text-gray-600">{getSubjectCredits(selectedBranch.subjectId)}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">Duration</h4>
                    <p className="text-sm text-gray-600">{selectedBranch.weekStructure?.length || 0} weeks</p>
                  </div>
                </div>

                {selectedBranch.weekStructure && selectedBranch.weekStructure.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Course Structure</h4>
                    <div className="space-y-2">
                      {selectedBranch.weekStructure.map((week, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                            {week.weekNumber}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{week.title}</p>
                            {week.description && (
                              <p className="text-xs text-gray-500">{week.description}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  onClick={() => setSelectedBranch(null)}
                  className="btn btn-outline"
                >
                  Close
                </Button>
                <Button
                  onClick={() => {/* Navigate to course content */}}
                  className="btn btn-primary"
                >
                  Enter Course
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboardPage;

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { fetchQuizzes, createQuiz, deleteQuiz } from '../features/quizzes/quizzesSlice';
import { fetchBranches, fetchBranchesByProfessor } from '../features/branches/branchesSlice';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import CreateQuizModal from '../components/CreateQuizModal';

interface Quiz {
  id: string;
  branchId: string;
  title: string;
  description?: string;
  questions: any[];
  totalPoints: number;
  timeLimit?: number;
  attemptsAllowed: number;
  isActive: boolean;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

interface Branch {
  id: string;
  subjectId: string;
  professorId: string;
  title: string;
  description: string;
  isActive: boolean;
}

const QuizManagementPage: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { quizzes, loading: quizzesLoading } = useSelector((state: RootState) => state.quizzes);
  const { branches, loading: branchesLoading } = useSelector((state: RootState) => state.branches);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Load quizzes and branches
  useEffect(() => {
    dispatch(fetchQuizzes({ isActive: true }));
    if (user?.role === 'professor') {
      dispatch(fetchBranchesByProfessor(user.id));
    } else {
      dispatch(fetchBranches({ isActive: true }));
    }
  }, [dispatch, user?.id, user?.role]);

  // Filter quizzes based on selected branch and search term
  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesBranch = selectedBranch === 'all' || quiz.branchId === selectedBranch;
    const matchesSearch = searchTerm === '' || 
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesBranch && matchesSearch;
  });

  // Get branch name by ID
  const getBranchName = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    return branch ? branch.title : 'Unknown Branch';
  };

  if (quizzesLoading || branchesLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Quiz Management</h1>
        <p className="text-gray-600 mt-2">Create and manage quizzes for your courses</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Quizzes</p>
              <p className="text-2xl font-semibold text-gray-900">{quizzes.length}</p>
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
              <p className="text-sm font-medium text-gray-600">Active Quizzes</p>
              <p className="text-2xl font-semibold text-gray-900">{quizzes.filter(q => q.isActive).length}</p>
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
              <p className="text-sm font-medium text-gray-600">Total Questions</p>
              <p className="text-2xl font-semibold text-gray-900">
                {quizzes.reduce((total, quiz) => total + quiz.questions.length, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Points</p>
              <p className="text-2xl font-semibold text-gray-900">
                {quizzes.reduce((total, quiz) => total + quiz.totalPoints, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Quizzes
            </label>
            <input
              type="text"
              placeholder="Search by title or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input"
            />
          </div>
          
          <div className="min-w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Branch
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="input"
            >
              <option value="all">All Branches</option>
              {branches.map(branch => (
                <option key={branch.id} value={branch.id}>
                  {branch.title}
                </option>
              ))}
            </select>
          </div>

          <Button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            Create New Quiz
          </Button>
        </div>
      </div>

      {/* Quizzes List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Your Quizzes</h2>
        </div>

        {filteredQuizzes.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No quizzes found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {quizzes.length === 0 
                ? "Get started by creating your first quiz."
                : "Try adjusting your search or filter criteria."
              }
            </p>
            <div className="mt-6">
              <Button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary"
              >
                Create New Quiz
              </Button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredQuizzes.map((quiz) => (
              <div key={quiz.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {quiz.title}
                      </h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        quiz.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {quiz.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {getBranchName(quiz.branchId)}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      {quiz.description}
                    </p>
                    <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                      <span>
                        {quiz.questions.length} questions
                      </span>
                      <span>
                        {quiz.totalPoints} points
                      </span>
                      {quiz.timeLimit && (
                        <span>
                          {quiz.timeLimit} min time limit
                        </span>
                      )}
                      <span>
                        {quiz.attemptsAllowed === -1 ? 'Unlimited' : quiz.attemptsAllowed} attempts
                      </span>
                      <span>
                        Created {new Date(quiz.createdAt.seconds * 1000).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => {/* Navigate to quiz details */}}
                      className="btn btn-outline btn-sm"
                    >
                      View Details
                    </Button>
                    <Button
                      onClick={() => {/* Navigate to quiz editor */}}
                      className="btn btn-primary btn-sm"
                    >
                      Edit Quiz
                    </Button>
                    <Button
                      onClick={() => dispatch(deleteQuiz(quiz.id))}
                      variant="danger"
                      size="sm"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Quiz Modal */}
      <CreateQuizModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onQuizCreated={() => {
          dispatch(fetchQuizzes({ isActive: true }));
        }}
        branches={branches}
      />
    </div>
  );
};

export default QuizManagementPage;

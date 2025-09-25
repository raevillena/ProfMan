import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { fetchBranches, fetchBranchesByProfessor } from '../features/branches/branchesSlice';
import { fetchExamsByProfessor, deleteExam } from '../features/exams/examsSlice';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { LoadingSpinner } from '../components/LoadingSpinner';
import CreateExamModal from '../components/CreateExamModal';
import { Exam } from '../types/exam';

const ExamManagementPage: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { branches, loading: branchesLoading } = useSelector((state: RootState) => state.branches);
  const { exams, loading: examsLoading, error } = useSelector((state: RootState) => state.exams);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Load professor's branches and exams
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchBranchesByProfessor(user.id));
      dispatch(fetchExamsByProfessor(true));
    }
  }, [dispatch, user?.id]);

  // Filter exams based on selected branch and search term
  const filteredExams = exams.filter(exam => {
    const matchesBranch = selectedBranch === 'all' || exam.branchId === selectedBranch;
    const matchesSearch = searchTerm === '' ||
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && exam.isActive) ||
      (statusFilter === 'inactive' && !exam.isActive);
    return matchesBranch && matchesSearch && matchesStatus;
  });

  // Get branch name by ID
  const getBranchName = (branchId: string) => {
    const branch = branches.find(b => b.id === branchId);
    return branch ? branch.title : 'Unknown Branch';
  };

  // Handle exam actions
  const handleDeleteExam = async (examId: string) => {
    if (!confirm('Are you sure you want to delete this exam?')) return;
    try {
      await dispatch(deleteExam(examId)).unwrap();
    } catch (err) {
      console.error('Failed to delete exam:', err);
    }
  };

  const handleToggleActive = async (examId: string, isActive: boolean) => {
    // This would need to be implemented in the updateExam action
    console.log('Toggle active:', examId, isActive);
  };

  if (branchesLoading || examsLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>Error: {error}</p>
        <Button onClick={() => dispatch(fetchExamsByProfessor(true))} variant="primary" className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Exam Management</h1>
        <p className="text-gray-600 mt-2">Create and manage exams for your courses</p>
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
              <p className="text-sm font-medium text-gray-600">Total Exams</p>
              <p className="text-2xl font-semibold text-gray-900">{exams.length}</p>
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
              <p className="text-sm font-medium text-gray-600">Active Exams</p>
              <p className="text-2xl font-semibold text-gray-900">{exams.filter(e => e.isActive).length}</p>
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
              <p className="text-sm font-medium text-gray-600">Upcoming Exams</p>
              <p className="text-2xl font-semibold text-gray-900">
                {exams.filter(e => e.isActive && new Date(e.dueDate.seconds * 1000) > new Date()).length}
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
                {exams.reduce((total, exam) => total + exam.totalPoints, 0)}
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
              Search Exams
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

          <div className="min-w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <Button
            onClick={() => setShowCreateModal(true)}
            variant="primary"
          >
            Create New Exam
          </Button>
        </div>
      </div>

      {/* Exams List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Your Exams</h2>
        </div>

        {filteredExams.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No exams found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {exams.length === 0
                ? "Get started by creating your first exam."
                : "Try adjusting your search or filter criteria."
              }
            </p>
            <div className="mt-6">
              <Button
                onClick={() => setShowCreateModal(true)}
                variant="primary"
              >
                Create New Exam
              </Button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredExams.map((exam) => (
              <div key={exam.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {exam.title}
                      </h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        exam.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {exam.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {getBranchName(exam.branchId)}
                    </p>
                    <p className="mt-2 text-sm text-gray-500">
                      {exam.description}
                    </p>
                    <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                      <span>
                        {exam.totalPoints} points
                      </span>
                      <span>
                        Due: {new Date(exam.dueDate.seconds * 1000).toLocaleDateString()}
                      </span>
                      {exam.timeLimit && (
                        <span>
                          Time limit: {exam.timeLimit} minutes
                        </span>
                      )}
                      <span>
                        Created {new Date(exam.createdAt.seconds * 1000).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => {/* Navigate to exam details */}}
                      variant="outline"
                      size="sm"
                    >
                      View Details
                    </Button>
                    <Button
                      onClick={() => {/* Navigate to exam editor */}}
                      variant="primary"
                      size="sm"
                    >
                      Edit Exam
                    </Button>
                    <Button
                      onClick={() => handleDeleteExam(exam.id)}
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

      {/* Create Exam Modal */}
      <CreateExamModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onExamCreated={() => {
          dispatch(fetchExamsByProfessor(true));
        }}
        branches={branches}
      />
    </div>
  );
};

export default ExamManagementPage;
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { fetchBranchesByProfessor } from '../features/branches/branchesSlice';
import { fetchSubjects } from '../features/subjects/subjectsSlice';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import CreateBranchModal from '../components/CreateBranchModal';
import { ExportToSheetsModal } from '../components/ExportToSheetsModal';

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

const ProfessorDashboardPage: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);
  const { branches, loading: branchesLoading } = useSelector((state: RootState) => state.branches);
  const { subjects, loading: subjectsLoading } = useSelector((state: RootState) => state.subjects);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedBranchForExport, setSelectedBranchForExport] = useState<Branch | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Load professor's branches and available subjects
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchBranchesByProfessor(user.id));
      dispatch(fetchSubjects({ isActive: true }));
    }
  }, [dispatch, user?.id]);

  // Filter branches based on selected subject and search term
  const filteredBranches = branches.filter(branch => {
    const matchesSubject = selectedSubject === 'all' || branch.subjectId === selectedSubject;
    const matchesSearch = searchTerm === '' || 
      branch.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      branch.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  // Get subject name by ID
  const getSubjectName = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? `${subject.code} - ${subject.title}` : 'Unknown Subject';
  };

  // Mock students data for export (in real app, this would come from enrollment data)
  const getMockStudents = (branchId: string) => {
    return [
      { id: '1', studentNumber: '2024-001', displayName: 'John Doe', email: 'john.doe@student.edu' },
      { id: '2', studentNumber: '2024-002', displayName: 'Jane Smith', email: 'jane.smith@student.edu' },
      { id: '3', studentNumber: '2024-003', displayName: 'Bob Johnson', email: 'bob.johnson@student.edu' },
      { id: '4', studentNumber: '2024-004', displayName: 'Alice Brown', email: 'alice.brown@student.edu' },
      { id: '5', studentNumber: '2024-005', displayName: 'Charlie Wilson', email: 'charlie.wilson@student.edu' },
    ];
  };

  // Handle export to Google Sheets
  const handleExportToSheets = (branch: Branch) => {
    setSelectedBranchForExport(branch);
    setShowExportModal(true);
  };

  // Get subject code by ID
  const getSubjectCode = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.code : 'Unknown';
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
        <h1 className="text-3xl font-bold text-gray-900">Professor Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage your courses and class branches</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Branches</p>
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
              <p className="text-sm font-medium text-gray-600">Active Branches</p>
              <p className="text-2xl font-semibold text-gray-900">{branches.filter(b => b.isActive).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available Subjects</p>
              <p className="text-2xl font-semibold text-gray-900">{subjects.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Branches
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
              Filter by Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="input"
            >
              <option value="all">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject.id} value={subject.id}>
                  {subject.code} - {subject.title}
                </option>
              ))}
            </select>
          </div>

          <Button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
          >
            Create New Branch
          </Button>
        </div>
      </div>

      {/* Branches List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Your Course Branches</h2>
        </div>

        {filteredBranches.length === 0 ? (
          <div className="p-8 text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No branches found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {branches.length === 0 
                ? "Get started by creating your first course branch."
                : "Try adjusting your search or filter criteria."
              }
            </p>
            <div className="mt-6">
              <Button
                onClick={() => setShowCreateModal(true)}
                className="btn btn-primary"
              >
                Create New Branch
              </Button>
            </div>
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
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        branch.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {branch.isActive ? 'Active' : 'Inactive'}
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
                        {branch.weekStructure?.length || 0} weeks
                      </span>
                      <span>
                        Created {new Date(branch.createdAt.seconds * 1000).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => {/* Navigate to branch details */}}
                      variant="outline"
                      size="sm"
                    >
                      View Details
                    </Button>
                    <Button
                      onClick={() => handleExportToSheets(branch)}
                      variant="outline"
                      size="sm"
                    >
                      Export to Sheets
                    </Button>
                    <Button
                      onClick={() => {/* Navigate to branch editor */}}
                      variant="primary"
                      size="sm"
                    >
                      Manage Content
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Branch Modal */}
      <CreateBranchModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onBranchCreated={() => {
          if (user?.id) {
            dispatch(fetchBranchesByProfessor(user.id));
          }
        }}
        subjects={subjects}
        professorId={user?.id || ''}
      />

      {selectedBranchForExport && (
        <ExportToSheetsModal
          isOpen={showExportModal}
          onClose={() => {
            setShowExportModal(false);
            setSelectedBranchForExport(null);
          }}
          branchId={selectedBranchForExport.id}
          branchTitle={selectedBranchForExport.title}
          students={getMockStudents(selectedBranchForExport.id)}
          onSuccess={(spreadsheetUrl) => {
            console.log('Gradebook created:', spreadsheetUrl);
            // Could show a success notification here
          }}
        />
      )}
    </div>
  );
};

export default ProfessorDashboardPage;

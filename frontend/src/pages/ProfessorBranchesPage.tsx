import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { fetchBranchesByProfessor } from '../features/branches/branchesSlice';
import { fetchSubjects } from '../features/subjects/subjectsSlice';
import { Button } from '../components/Button';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { Input } from '../components/Input';
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

const ProfessorBranchesPage: React.FC = () => {
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

  // Get subject code by ID
  const getSubjectCode = (subjectId: string) => {
    const subject = subjects.find(s => s.id === subjectId);
    return subject ? subject.code : 'Unknown';
  };

  // Mock students for export (replace with actual data)
  const getMockStudents = () => {
    return [
      { id: '1', name: 'John Doe', email: 'john@example.com', studentNumber: '2024001' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', studentNumber: '2024002' },
      { id: '3', name: 'Bob Johnson', email: 'bob@example.com', studentNumber: '2024003' },
    ];
  };

  const handleExportToSheets = (branch: Branch) => {
    setSelectedBranchForExport(branch);
    setShowExportModal(true);
  };

  if (branchesLoading || subjectsLoading) {
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
          <h1 className="text-2xl font-bold text-gray-900">My Classes</h1>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Create New Class
          </Button>
        </div>
        
        {/* Filters */}
        <div className="flex space-x-4 mb-4">
          <div className="flex-1 max-w-md">
            <Input
              type="text"
              placeholder="Search classes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-64">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Subjects</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.code} - {subject.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                <span className="text-blue-600 font-semibold">📚</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Classes</p>
              <p className="text-2xl font-semibold text-gray-900">{branches.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                <span className="text-green-600 font-semibold">✅</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Classes</p>
              <p className="text-2xl font-semibold text-gray-900">
                {branches.filter(b => b.isActive).length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                <span className="text-purple-600 font-semibold">📖</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Subjects</p>
              <p className="text-2xl font-semibold text-gray-900">
                {new Set(branches.map(b => b.subjectId)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Classes List */}
      <div className="bg-white rounded-lg shadow">
        {filteredBranches.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-500 mb-4">
              {searchTerm || selectedSubject !== 'all' 
                ? 'No classes found matching your filters.' 
                : 'No classes created yet.'
              }
            </div>
            {!searchTerm && selectedSubject === 'all' && (
              <Button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Create Your First Class
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredBranches.map((branch) => (
              <div key={branch.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {branch.title}
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getSubjectCode(branch.subjectId)}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        branch.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {branch.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">
                      {branch.description}
                    </p>
                    <p className="text-sm text-gray-500 mb-3">
                      Subject: {getSubjectName(branch.subjectId)}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>
                        Created: {new Date(branch.createdAt.seconds * 1000).toLocaleDateString()}
                      </span>
                      <span>
                        Weeks: {branch.weekStructure?.length || 0}
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleExportToSheets(branch)}
                    >
                      Export to Sheets
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Navigate to class details or edit
                        console.log('Edit class:', branch.id);
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {showCreateModal && (
        <CreateBranchModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      )}

      {showExportModal && selectedBranchForExport && (
        <ExportToSheetsModal
          isOpen={showExportModal}
          onClose={() => {
            setShowExportModal(false);
            setSelectedBranchForExport(null);
          }}
          branch={selectedBranchForExport}
          students={getMockStudents()}
        />
      )}
    </div>
  );
};

export default ProfessorBranchesPage;

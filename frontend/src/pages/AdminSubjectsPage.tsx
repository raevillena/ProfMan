import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { fetchSubjects, deleteSubject, restoreSubject } from '../features/subjects/subjectsSlice';
import { fetchUsers } from '../features/users/usersSlice';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { LoadingSpinner } from '../components/LoadingSpinner';
import CreateSubjectModal from '../components/CreateSubjectModal';
import AssignSubjectModal from '../components/AssignSubjectModal';
import { subjectService } from '../services/subjectService';
import { AssignSubjectRequest } from '../types/subject';

interface Subject {
  id: string;
  code: string;
  title: string;
  description: string;
  credits: number;
  isActive: boolean;
  assignedProfessors: string[];
  createdBy: string;
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  updatedAt: {
    seconds: number;
    nanoseconds: number;
  };
}

const AdminSubjectsPage: React.FC = () => {
  const dispatch = useDispatch();
  const { subjects, loading, error, pagination } = useSelector((state: RootState) => state.subjects);
  const { users } = useSelector((state: RootState) => state.users);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [assignmentLoading, setAssignmentLoading] = useState(false);

  // Fetch subjects
  const loadSubjects = () => {
    dispatch(fetchSubjects({
      page: currentPage,
      limit: 10,
      isActive: statusFilter === 'all' ? undefined : statusFilter === 'active',
      search: searchTerm || undefined,
    }));
  };

  useEffect(() => {
    loadSubjects();
  }, [currentPage, statusFilter, searchTerm]);

  // Load professors for assignment
  useEffect(() => {
    dispatch(fetchUsers({ role: 'professor', limit: 1000 }));
  }, [dispatch]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadSubjects();
  };

  // Handle subject actions
  const handleDeleteSubject = async (subjectId: string) => {
    if (!confirm('Are you sure you want to delete this subject?')) return;

    try {
      await dispatch(deleteSubject(subjectId)).unwrap();
      loadSubjects(); // Refresh the list
    } catch (err) {
      console.error('Failed to delete subject:', err);
    }
  };

  const handleRestoreSubject = async (subjectId: string) => {
    try {
      await dispatch(restoreSubject(subjectId)).unwrap();
      loadSubjects(); // Refresh the list
    } catch (err) {
      console.error('Failed to restore subject:', err);
    }
  };

  const handleToggleActive = async (subjectId: string, isActive: boolean) => {
    try {
      // This would need to be implemented in the updateSubject action
      // For now, we'll just refresh the list
      loadSubjects();
    } catch (err) {
      console.error('Failed to update subject:', err);
    }
  };

  const handleAssignSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setShowAssignModal(true);
  };

  const handleAssignmentSubmit = async (assignmentData: AssignSubjectRequest) => {
    if (!selectedSubject) return;

    setAssignmentLoading(true);
    try {
      await subjectService.assignSubject(selectedSubject.id, assignmentData);
      loadSubjects(); // Refresh the list
      setShowAssignModal(false);
      setSelectedSubject(null);
    } catch (err) {
      console.error('Failed to assign subject:', err);
    } finally {
      setAssignmentLoading(false);
    }
  };

  const getProfessors = () => {
    return users.filter(user => user.role === 'professor');
  };

  const getProfessorName = (professorId: string) => {
    const professor = users.find(u => u.id === professorId);
    return professor ? professor.displayName : 'Unknown Professor';
  };

  if (loading && subjects.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Subject Management</h1>
        <p className="text-gray-600 mt-2">Manage subjects, courses, and academic content</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <Input
              type="text"
              placeholder="Search by code, title, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="min-w-32">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <Button type="submit" variant="primary">
            Search
          </Button>
        </form>
      </div>

      {/* Subjects Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Subjects</h2>
            <Button
              onClick={() => setShowCreateModal(true)}
              variant="primary"
            >
              Add Subject
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Assigned Professors
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subjects.map((subject) => (
                <tr key={subject.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {subject.code} - {subject.title}
                      </div>
                      <div className="text-sm text-gray-500 max-w-md truncate">
                        {subject.description}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      {subject.credits} credit{subject.credits !== 1 ? 's' : ''}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      subject.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {subject.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {subject.assignedProfessors && subject.assignedProfessors.length > 0 ? (
                        subject.assignedProfessors.slice(0, 2).map((professorId) => (
                          <span
                            key={professorId}
                            className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800"
                          >
                            {getProfessorName(professorId)}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">No assignments</span>
                      )}
                      {subject.assignedProfessors && subject.assignedProfessors.length > 2 && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          +{subject.assignedProfessors.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(subject.createdAt.seconds * 1000).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {!subject.isActive ? (
                        <Button
                          onClick={() => handleRestoreSubject(subject.id)}
                          variant="outline"
                          size="sm"
                        >
                          Restore
                        </Button>
                      ) : (
                        <>
                          <Button
                            onClick={() => handleAssignSubject(subject)}
                            variant="primary"
                            size="sm"
                          >
                            Assign
                          </Button>
                          <Button
                            onClick={() => handleToggleActive(subject.id, subject.isActive)}
                            variant="outline"
                            size="sm"
                          >
                            Deactivate
                          </Button>
                          <Button
                            onClick={() => handleDeleteSubject(subject.id)}
                            variant="danger"
                            size="sm"
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-700">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                  disabled={currentPage === pagination.totalPages}
                  variant="outline"
                  size="sm"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create Subject Modal */}
      <CreateSubjectModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubjectCreated={loadSubjects}
      />

      {/* Assign Subject Modal */}
      {selectedSubject && (
        <AssignSubjectModal
          isOpen={showAssignModal}
          onClose={() => {
            setShowAssignModal(false);
            setSelectedSubject(null);
          }}
          onAssign={handleAssignmentSubmit}
          subjectTitle={selectedSubject.title}
          currentAssignments={selectedSubject.assignedProfessors || []}
          professors={getProfessors()}
          loading={assignmentLoading}
        />
      )}
    </div>
  );
};

export default AdminSubjectsPage;

import React, { useState } from 'react';
import { sheetsService, CreateGradebookRequest } from '../services/sheetsService';
import { Button } from './Button';
import { LoadingSpinner } from './LoadingSpinner';

interface ExportToSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  branchId: string;
  branchTitle: string;
  students: Array<{
    id: string;
    studentNumber?: string;
    displayName: string;
    email: string;
  }>;
  onSuccess?: (spreadsheetUrl: string) => void;
}

export const ExportToSheetsModal: React.FC<ExportToSheetsModalProps> = ({
  isOpen,
  onClose,
  branchId,
  branchTitle,
  students,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [spreadsheetUrl, setSpreadsheetUrl] = useState<string | null>(null);

  const handleExport = async () => {
    if (students.length === 0) {
      setError('No students to export');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const requestData: CreateGradebookRequest = {
        branchId,
        branchTitle,
        students
      };

      const response = await sheetsService.createGradebook(requestData);

      if (response.success && response.data) {
        setSuccess(true);
        setSpreadsheetUrl(response.data.spreadsheetUrl);
        onSuccess?.(response.data.spreadsheetUrl);
      } else {
        setError(response.error?.message || 'Failed to create gradebook');
      }
    } catch (err) {
      console.error('Export to sheets error:', err);
      setError('Failed to export to Google Sheets. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setError(null);
    setSuccess(false);
    setSpreadsheetUrl(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Export to Google Sheets
          </h2>
        </div>

        <div className="px-6 py-4">
          {!success ? (
            <>
              <div className="mb-4">
                <p className="text-gray-600 mb-2">
                  Export gradebook for <strong>{branchTitle}</strong>
                </p>
                <p className="text-sm text-gray-500">
                  This will create a new Google Sheets spreadsheet with {students.length} students.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  onClick={handleClose}
                  variant="outline"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleExport}
                  variant="primary"
                  disabled={loading || students.length === 0}
                >
                  {loading ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Creating...
                    </>
                  ) : (
                    'Create Gradebook'
                  )}
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="mb-4">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Gradebook Created Successfully!
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  Your Google Sheets gradebook has been created and is ready to use.
                </p>
              </div>

              {spreadsheetUrl && (
                <div className="mb-4">
                  <a
                    href={spreadsheetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 1v10h10V5H5z" clipRule="evenodd" />
                    </svg>
                    Open in Google Sheets
                  </a>
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  onClick={handleClose}
                  variant="primary"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

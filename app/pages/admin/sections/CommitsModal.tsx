import React from 'react';

interface CommitsModalProps {
  show: boolean;
  onClose: () => void;
  branch: string | null;
  commits: any[];
  loading: boolean;
  error: string | null;
}

const CommitsModal: React.FC<CommitsModalProps> = ({ show, onClose, branch, commits, loading, error }) => {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
        <h2 className="text-lg font-bold mb-2">Commits de la rama: <span className="font-mono">{branch}</span></h2>
        {loading && <div>Cargando commits...</div>}
        {error && <div className="text-red-600">{error}</div>}
        {!loading && !error && commits.length === 0 && (
          <div className="text-gray-500">Esta rama no tiene commits (0 commits reportados por el backend).</div>
        )}
        {!loading && !error && commits.length > 0 && (
          <ul className="divide-y divide-gray-200">
            {commits.map((commit: any) => (
              <li key={commit.sha} className="py-2">
                <div className="font-mono text-xs text-gray-500">{commit.sha.substring(0, 7)}</div>
                <div className="font-semibold">{commit.message}</div>
                <div className="text-xs text-gray-600">{commit.author} - {new Date(commit.date).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        )}
        <button className="mt-4 px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default CommitsModal;

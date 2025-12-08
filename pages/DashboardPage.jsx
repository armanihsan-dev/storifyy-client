import { useEffect, useState } from 'react';
import FileUpload from '../components/FileUpload';
import { useNavigate, useParams } from 'react-router-dom';
import CreateDirectory from '../components/CreateDirectory';
import FileCard from '../components/FileCard';
import DirCard from './../components/DirCard';
import { Toaster } from 'react-hot-toast';
import { PuffLoader } from 'react-spinners';
import { FiFolder, FiFileText, FiPlus } from 'react-icons/fi';
import { getAllSharedDirectories } from '../API/share';

const DashboardPage = () => {
  const BASE_URL = 'http://localhost:3000';

  const [directoriesList, setDirectoriesList] = useState([]);
  const [filesList, setFilesList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState({ isOwner: true });
  const [folderName, setFolderName] = useState('');
  const [newFilename, setNewFilename] = useState('');

  const { dirId } = useParams();

  const navigate = useNavigate();

  //open dir  by clicking their cards
  function openDirectory(id) {
    navigate(`/directory/${id}`);
  }

  async function getDirectory() {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${BASE_URL}/directory${dirId ? `/${dirId}` : ''}`,
        { credentials: 'include' }
      );

      const data = await response.json();

      if (response.status === 401) {
        setUser({ isOwner: false });
        setError(data.error || 'Unauthorized');
        setLoading(false);
        return;
      }

      setDirectoriesList(data.directories || []);
      setFilesList(data.files || []);
      setUser({ isOwner: data.isOwner ?? true });
    } catch (err) {
      setError('Something went wrong while loading the directory.');
      setUser({ isOwner: false });
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateDirectory(e) {
    e.preventDefault();
    const URL = `${BASE_URL}/directory/${dirId || ''}`;

    await fetch(URL, {
      method: 'POST',
      credentials: 'include',
      headers: { folderName },
    });

    setFolderName('');
    getDirectory();
  }

  useEffect(() => {
    getDirectory();
    (async () => console.log(await getAllSharedDirectories()))();
  }, [dirId]);

  return (
    <div className="min-h-screen font-[Poppins] text-slate-800 relative overflow-x-hidden">
      <Toaster position="top-center" />

      {/* Ambient Background Effects */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-pink-200/30 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-200/30 blur-[120px]" />
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-64 w-full">
            <PuffLoader color="#ec4899" size={60} />
            <p className="text-slate-400 mt-4 text-sm animate-pulse">
              Fetching your files...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Content */}
        {!loading && !error && (
          <div className="space-y-10">
            {/* Directories */}
            {directoriesList.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                  <FiFolder className="text-yellow-500" />
                  Directories
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {directoriesList.map((dir) => (
                    <DirCard
                      key={dir.id}
                      id={dir.id}
                      name={dir.name}
                      getDirectories={getDirectory}
                      newDirName={newFilename}
                      setNewDirName={setNewFilename}
                      onOpen={openDirectory}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Files */}
            {filesList.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                  <FiFileText className="text-blue-500" />
                  Files
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filesList.map(({ id, name, updatedAt, size }) => (
                    <FileCard
                      key={id}
                      id={id}
                      title={name}
                      sizeLabel={size || 'Unknown'}
                      updatedAt={new Date(updatedAt).toLocaleDateString()}
                      getDirectories={getDirectory}
                      newFilename={newFilename}
                      setNewFilename={setNewFilename}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* Empty */}
            {directoriesList.length === 0 && filesList.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                  <FiPlus className="w-8 h-8 text-slate-300" />
                </div>

                <h3 className="text-xl font-semibold text-slate-700">
                  It's empty here
                </h3>

                <p className="text-slate-500 max-w-md text-center mt-2 mb-6">
                  Upload files or create a new directory.
                </p>

                {user.isOwner && (
                  <button
                    onClick={() =>
                      document.querySelector('input[type="file"]')?.click()
                    }
                    className="text-pink-500 font-medium hover:text-pink-600 transition-colors"
                  >
                    Upload a file →
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;

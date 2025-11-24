import { useEffect, useState } from 'react';
import FileUpload from '../components/FileUpload';
import { useParams, Link, useNavigate } from 'react-router-dom';
import CreateDirectory from '../components/CreateDirectory';
import FileCard from '../components/FileCard';
import DirCard from './../components/DirCard';
import { Toaster } from 'react-hot-toast';
import AuthDropDown from './../components/AuthDropDown';
import { PuffLoader } from 'react-spinners';
import { FiFolder, FiFileText, FiHome, FiSearch, FiPlus } from 'react-icons/fi'; // Assuming you can install react-icons
import { getAllSharedDirectories } from '../API/share';
import SharedDirectoriesList from '../pages/SharedDirectoriesTable';

const DirectoryView = () => {
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
    const response = await fetch(URL, {
      method: 'POST',
      credentials: 'include',
      headers: { folderName },
    });
    const data = await response.json();
    console.log(data.error);
    setFolderName('');
    getDirectory();
  }

  useEffect(() => {
    getDirectory();
    (async () => console.log(await getAllSharedDirectories()))();
  }, [dirId]);

  return (
    <div className="min-h-screen bg-slate-50 font-[Poppins] text-slate-800 relative overflow-x-hidden">
      <Toaster position="top-center" />

      {/* Ambient Background Effects */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-pink-200/30 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-200/30 blur-[120px]" />
      </div>

      {/* Navbar / Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 border-b border-slate-200/60 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo Area */}
          <div
            className="flex items-center gap-3 group cursor-pointer"
            onClick={() => navigate('/')}
          >
            <div className="relative w-10 h-10 flex items-center justify-center rounded-xl  ">
              {/* Replaced img with icon for demo, put your img back here */}
              <img src="../public/logo.svg" className="w-8 h-8 " alt="logo" />
            </div>
            <span className="text-2xl text-pink-400 font-bold">Storifyy</span>
          </div>

          {/* Search Bar (Visual Only - Optional) */}
          <div className="hidden md:flex items-center bg-slate-100/50 border border-slate-200 rounded-full px-4 py-2 w-1/3 focus-within:bg-white focus-within:ring-2 focus-within:ring-pink-100 transition-all">
            <FiSearch className="text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="Search files..."
              className="bg-transparent border-none outline-none w-full text-sm text-slate-600 placeholder:text-slate-400"
            />
          </div>

          {/* Actions & Profile */}
          <div className="flex items-center gap-4">
            {user.isOwner ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:block">
                  {/* Wrapped components to ensure they fit the theme */}
                  <FileUpload getDirectories={getDirectory} />
                </div>

                <div className="hidden sm:block">
                  <CreateDirectory
                    setfolderName={setFolderName}
                    folderName={folderName}
                    handleCreateDirectory={handleCreateDirectory}
                  />
                </div>
              </div>
            ) : null}

            <div className="pl-2 border-l border-slate-200">
              <AuthDropDown BASEURL={BASE_URL} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb / Title Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          {/* Mobile Actions (if needed) */}
          {user.isOwner && (
            <div className="flex sm:hidden gap-2">
              {/* Mobile specific buttons if components are not responsive */}
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center h-64 w-full">
            <PuffLoader color="#ec4899" size={60} />
            <p className="text-slate-400 mt-4 text-sm animate-pulse">
              Fetching your data...
            </p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-center">
            {error}
          </div>
        )}

        {/* Content Grid */}
        {!loading && !error && (
          <div className="space-y-10">
            {/* Directories Section */}
            {directoriesList.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                  <FiFolder className="text-yellow-500" />
                  <span>Directories</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {directoriesList.map((dir, ind) => (
                    <div key={ind}>
                      <DirCard
                        id={dir.id}
                        name={dir.name}
                        onOpen={(id) => console.log('Open dir', id)} // You might want to link this to navigation
                        onDelete={() => console.log('On del')}
                        onSave={() => console.log('On save')}
                        getDirectories={getDirectory}
                        newDirName={newFilename}
                        setNewDirName={setNewFilename}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Files Section */}
            {filesList.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                  <FiFileText className="text-blue-500" /> Files
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filesList.map(({ id, name }) => {
                    const updatedAt = '10/9/2024 10:15am'; // Dynamic date recommended
                    return (
                      <div key={id} className="group relative">
                        <div className="absolute rounded-2xl  pointer-events-none"></div>
                        <div className="relative rounded-xl h-full">
                          <FileCard
                            id={id}
                            title={name}
                            sizeLabel={'32 GB'}
                            updatedAt={updatedAt}
                            onDownload={() => console.log('Download', name)}
                            onPreview={() => console.log('Preview', name)}
                            getDirectories={getDirectory}
                            newFilename={newFilename}
                            setNewFilename={setNewFilename}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Empty State */}
            {directoriesList.length === 0 && filesList.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
                <div className="bg-white p-4 rounded-full shadow-sm mb-4">
                  <FiPlus className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-xl font-semibold text-slate-700">
                  It's a bit empty here
                </h3>
                <p className="text-slate-500 max-w-md text-center mt-2 mb-6">
                  This folder is empty. Use the buttons above to upload files or
                  create a new directory.
                </p>
                {user.isOwner && (
                  <button
                    onClick={() =>
                      document.querySelector('input[type="file"]')?.click()
                    } // Quick hack to trigger upload if FileUpload has an input
                    className="text-pink-500 font-medium hover:text-pink-600 transition-colors"
                  >
                    Upload a file now &rarr;
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </main>
      <SharedDirectoriesList />
    </div>
  );
};

export default DirectoryView;

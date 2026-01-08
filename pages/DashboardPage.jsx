import {
  useNavigate,
  useParams,
  useOutletContext,
  useLocation,
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { PuffLoader } from 'react-spinners';
import { FiFolder, FiFileText, FiPlus } from 'react-icons/fi';

import { useDirectory } from '../src/hooks/useDirectory';
import DirCard from '../components/DirCard';
import FileCard from '../components/FileCard';
import { useBreadcrumb } from '@/hooks/otherHooks';
import { shortenRoot } from '../utility/functions';
import { useEffect } from 'react';
import { useSectionStore } from '@/store/sectionStore';

const DashboardPage = () => {
  const { dirId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { shouldRefresh, setShouldRefresh } = useOutletContext();
  const setSection = useSectionStore((s) => s.setSection);
  useEffect(() => {
    if (!dirId) setSection('dashboard');
  }, [dirId]);

  // 🔥 React Query handles everything here
  const { data, isLoading, isError, error, refetch } = useDirectory(dirId);
  if (error == 'Not logged!') {
    window.location.href = '/login';
  }

  const { data: breadcrumb, isLoading: bcLoading } = useBreadcrumb(dirId);
  const breadcrumbPath = breadcrumb
    ? breadcrumb
        .map(
          (b, index) => (index === 0 ? shortenRoot(b.name) : b.name) // shorten root only
        )
        .join('/')
    : 'Home';

  // Get directory + files
  const directoriesList = data?.directories ?? [];
  const filesList = data?.files ?? [];
  const user = { isOwner: data?.isOwner ?? true };

  // 🔁 Refresh when AppLayout says so
  if (shouldRefresh) {
    refetch();
    setShouldRefresh(false);
  }
  function openDirectory(id) {
    navigate(`/directory/${id}`, {
      state: { fromStarred: location.state?.fromStarred || false },
    });
  }

  return (
    <div className="min-h-screen font-[Poppins] text-slate-800 relative overflow-x-hidden ">
      <Toaster position="top-center" />

      {/* Background Effects */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-pink-200/30 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-200/30 blur-[120px]" />
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-64 w-full">
            <PuffLoader color="#ec4899" size={60} />
            <p className="text-slate-400 mt-4 text-sm animate-pulse">
              Fetching your files...
            </p>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-center">
            {error.message}
          </div>
        )}

        {/* Content */}
        {!isLoading && !isError && (
          <div className="space-y-10  ">
            {/* Breadcrumb + Stats */}
            <div className="flex flex-col gap-3 lg:flex-row justify-between mb-6 ">
              {/* Breadcrumb */}

              <nav className="flex items-center text-sm font-medium text-slate-500 flex-wrap">
                <button
                  onClick={() => navigate(-1)}
                  className="mr-2 px-3 py-1.5 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-medium transition shadow-sm"
                >
                  ← Back
                </button>

                <span
                  className="cursor-pointer hover:text-pink-600"
                  onClick={() => {
                    const fromStarred = location.state?.fromStarred;
                    if (fromStarred) {
                      navigate('/starred');
                    } else {
                      navigate('/', {
                        state: { fromStarred: false },
                      });
                    }
                  }}
                >
                  Home
                </span>

                <span className="text-slate-400 mx-1">/</span>

                {bcLoading && (
                  <span className="animate-pulse text-slate-400">
                    Loading...
                  </span>
                )}

                {!bcLoading &&
                  breadcrumb?.slice(1).map((crumb, index) => {
                    const isLast = index === breadcrumb.slice(1).length - 1;

                    return (
                      <div key={crumb._id} className="flex items-center">
                        <span
                          className={
                            'cursor-pointer transition ' +
                            (isLast
                              ? 'text-pink-600 font-semibold'
                              : 'hover:text-pink-600')
                          }
                          onClick={() => {
                            if (!isLast)
                              navigate(`/directory/${crumb._id}`, {
                                state: {
                                  fromStarred:
                                    location.state?.fromStarred || false,
                                },
                              });
                          }}
                        >
                          {crumb.name}
                        </span>

                        {!isLast && (
                          <span className="text-slate-400 mx-1">/</span>
                        )}
                      </div>
                    );
                  })}
              </nav>

              {/* Directory Stats */}
              <div className="flex items-center gap-4">
                {/* Folders Badge */}
                <div className="flex items-center gap-2 bg-pink-100 text-pink-700 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm">
                  <FiFolder className="w-4 h-4" />
                  <span>{directoriesList.length} Folders</span>
                </div>

                {/* Files Badge */}
                <div className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium shadow-sm">
                  <FiFileText className="w-4 h-4" />
                  <span>{filesList.length} Files</span>
                </div>
              </div>
            </div>

            {/* Directories */}
            {directoriesList.length > 0 && (
              <section>
                <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                  <FiFolder className="text-yellow-500" />
                  Directories
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                  {directoriesList.map((dir) => (
                    <DirCard
                      key={dir._id}
                      id={dir._id}
                      name={dir.name}
                      isStarred={dir.isStarred}
                      details={{
                        createdAt: dir.createdAt,
                        updatedAt: dir.updatedAt,
                        size: dir.size,
                        path: breadcrumbPath, // ← ADD THIS
                      }}
                      onOpen={openDirectory}
                      refetch={refetch}
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
                  {filesList.map((file) => (
                    <FileCard
                      key={file._id}
                      id={file._id}
                      title={file.name}
                      extension={file.extension}
                      sizeLabel={file.size || 'Unknown'}
                      path={breadcrumbPath}
                      updatedAt={new Date(file.updatedAt).toLocaleString()}
                      refetch={refetch}
                    />
                  ))}
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

import { useEffect, useMemo } from 'react';
import {
  useNavigate,
  useParams,
  useOutletContext,
  useLocation,
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { PuffLoader } from 'react-spinners';
import {
  FiFolder,
  FiFileText,
  FiPlus,
  FiSearch,
  FiArrowLeft,
  FiHome,
  FiXCircle,
} from 'react-icons/fi';

import { useDirectory } from '../src/hooks/useDirectory';
import DirCard from '../components/DirCard';
import FileCard from '../components/FileCard';
import { useBreadcrumb } from '@/hooks/otherHooks';
import { shortenRoot } from '../utility/functions';
import { useSectionStore } from '@/store/sectionStore';

const DashboardPage = () => {
  const { dirId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    shouldRefresh,
    setShouldRefresh,
    searchQuery,
    searchResult,
    isSearching,
  } = useOutletContext();

  const setSection = useSectionStore((s) => s.setSection);

  useEffect(() => {
    if (!dirId) setSection('dashboard');
  }, [dirId, setSection]);

  // 🔥 Data Fetching
  const { data, isLoading, isError, error, refetch } = useDirectory(dirId);

  // Redirect if not logged in
  useEffect(() => {
    if (error === 'Not logged!') {
      window.location.href = '/login';
    }
  }, [error]);

  const { data: breadcrumb, isLoading: bcLoading } = useBreadcrumb(dirId);

  // 🧮 Derived State
  const breadcrumbPath = useMemo(() => {
    return breadcrumb
      ? breadcrumb
          .map((b, index) => (index === 0 ? shortenRoot(b.name) : b.name))
          .join('/')
      : 'Home';
  }, [breadcrumb]);

  const directoriesList = isSearching
    ? searchResult?.directories ?? []
    : data?.directories ?? [];

  const filesList = isSearching ? searchResult?.files ?? [] : data?.files ?? [];

  const totalItems = directoriesList.length + filesList.length;
  const user = { isOwner: data?.isOwner ?? true };

  // 🔁 Refresh Logic
  if (shouldRefresh) {
    refetch();
    setShouldRefresh(false);
  }

  function openDirectory(id) {
    navigate(`/directory/${id}`, {
      state: { fromStarred: location.state?.fromStarred || false },
    });
  }

  // Handle Search Clear (Ux Improvement)
  const handleClearSearch = () => {
    if (setSearchQuery) setSearchQuery('');
    // Alternatively, the search component in Parent controls this,
    // but visually we might want to exit search mode here.
  };

  return (
    <div className="font-[Poppins] text-slate-800 min-h-screen relative bg-slate-50/30">
      <Toaster position="top-center" />

      {/* ✨ Ambient Background */}
      <div className="fixed inset-0 overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40rem] h-[40rem] rounded-full bg-pink-200/20 blur-[100px] animate-pulse-slow" />
        <div className="absolute top-[20%] -right-[10%] w-[35rem] h-[35rem] rounded-full bg-blue-200/20 blur-[100px]" />
      </div>

      {/* 🟢 Header Section (Sticky) */}
      <header
        className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-white/50 shadow-sm
                   px-4 sm:px-6 lg:px-8 py-4 transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left Side: Search Banner OR Breadcrumbs */}
          <div className="flex-1 min-w-0">
            {isSearching ? (
              // 🔍 Search Mode Header
              <div className="flex items-center gap-3 animate-fadeIn">
                <div className="p-2 bg-pink-100 text-pink-600 rounded-lg">
                  <FiSearch className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-800 leading-tight">
                    Search Results
                  </h2>
                  <p className="text-sm text-slate-500 truncate">
                    Found {totalItems} matches for{' '}
                    <span className="font-medium text-slate-700">
                      "{searchQuery}"
                    </span>
                  </p>
                </div>
              </div>
            ) : (
              // 📂 Navigation Mode Header
              <nav className="flex items-center text-sm font-medium text-slate-500 overflow-x-auto no-scrollbar mask-gradient-right">
                <button
                  onClick={() => navigate(-1)}
                  className="mr-3 p-2 rounded-full hover:bg-slate-200/60 text-slate-600 transition-colors"
                  aria-label="Go Back"
                >
                  <FiArrowLeft size={18} />
                </button>

                <div className="flex items-center whitespace-nowrap">
                  <span
                    className="flex items-center gap-1 cursor-pointer hover:text-pink-600 transition-colors px-1"
                    onClick={() => {
                      const fromStarred = location.state?.fromStarred;
                      navigate(fromStarred ? '/starred' : '/', {
                        state: { fromStarred: false },
                      });
                    }}
                  >
                    <FiHome className="mb-0.5" /> Home
                  </span>

                  <span className="text-slate-300 mx-2">/</span>

                  {bcLoading ? (
                    <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                  ) : (
                    breadcrumb?.slice(1).map((crumb, index) => {
                      const isLast = index === breadcrumb.slice(1).length - 1;
                      return (
                        <div key={crumb._id} className="flex items-center">
                          <span
                            className={`px-1 py-0.5 rounded transition-colors ${
                              isLast
                                ? 'text-pink-600 font-semibold bg-pink-50'
                                : 'cursor-pointer hover:text-pink-600 hover:bg-slate-100'
                            }`}
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
                            <span className="text-slate-300 mx-2">/</span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </nav>
            )}
          </div>

          {/* Right Side: Stats Badges */}
          {!isLoading && totalItems > 0 && (
            <div className="flex items-center gap-3 shrink-0">
              {directoriesList.length > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                  <FiFolder /> {directoriesList.length} Folders
                </span>
              )}
              {filesList.length > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                  <FiFileText /> {filesList.length} Files
                </span>
              )}
            </div>
          )}
        </div>
      </header>

      {/* 🟢 Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-[50vh] w-full">
            <PuffLoader color="#ec4899" size={60} />
            <p className="text-slate-400 mt-6 text-sm font-medium animate-pulse">
              {isSearching ? 'Searching files...' : 'Loading contents...'}
            </p>
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="mx-auto max-w-lg mt-10 bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl text-center shadow-sm">
            <p className="font-semibold">Oops!</p>
            <p className="text-sm opacity-90">{error.message}</p>
          </div>
        )}

        {!isLoading && !isError && (
          <div className="space-y-12 animate-slideUp">
            {/* 📁 Directories Section */}
            {directoriesList.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4 pb-2">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                    Directories
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
                        path: isSearching ? 'Found in search' : breadcrumbPath,
                      }}
                      onOpen={openDirectory}
                      refetch={refetch}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 📄 Files Section */}
            {filesList.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4 pb-2">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                    Files
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filesList.map((file) => (
                    <FileCard
                      key={file._id}
                      id={file._id}
                      title={file.name}
                      extension={file.extension}
                      sizeLabel={file.size || 'Unknown'}
                      // If searching, ideally 'path' comes from the file object,
                      // otherwise we show a generic "Result" text
                      path={isSearching ? 'Search Result' : breadcrumbPath}
                      updatedAt={new Date(file.updatedAt).toLocaleString()}
                      refetch={refetch}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 🕸 Empty States (Dual Logic) */}
            {directoriesList.length === 0 && filesList.length === 0 && (
              <div className="flex flex-col items-center justify-center min-h-[40vh] text-center">
                {isSearching ? (
                  // Empty Search State
                  <div className="bg-white/60 p-8 rounded-3xl border border-dashed border-slate-300 backdrop-blur-sm max-w-md w-full">
                    <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-400">
                      <FiSearch className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      No results found
                    </h3>
                    <p className="text-slate-500 text-sm mt-2 mb-6">
                      We couldn't find any files matching{' '}
                      <span className="font-mono bg-slate-100 px-1 rounded">
                        "{searchQuery}"
                      </span>
                      .
                    </p>
                    <button
                      onClick={handleClearSearch}
                      className="text-sm font-medium text-pink-600 hover:text-pink-700 hover:underline"
                    >
                      Clear search
                    </button>
                  </div>
                ) : (
                  // Empty Directory State
                  <div
                    className="group cursor-pointer"
                    onClick={() =>
                      user.isOwner &&
                      document.querySelector('input[type="file"]')?.click()
                    }
                  >
                    <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-10 rounded-3xl transition-colors group-hover:border-pink-300 group-hover:bg-pink-50/30">
                      <div className="bg-white p-4 rounded-full shadow-sm w-16 h-16 mx-auto flex items-center justify-center mb-4 text-pink-500 group-hover:scale-110 transition-transform">
                        <FiPlus className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-semibold text-slate-700">
                        This folder is empty
                      </h3>
                      <p className="text-slate-500 max-w-xs mx-auto mt-2">
                        {user.isOwner
                          ? 'Upload files or create a directory to get started.'
                          : 'There are no files shared here yet.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Global CSS for custom animations if needed, strictly Tailwind classes used mostly */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .mask-gradient-right { mask-image: linear-gradient(to right, black 90%, transparent 100%); }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideUp { animation: slideUp 0.4s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default DashboardPage;

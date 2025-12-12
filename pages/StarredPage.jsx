import { useNavigate } from 'react-router-dom';
import DirCard from '../components/DirCard';
import { useStarred } from '../src/hooks/otherHooks';
import { Star, FolderOpen } from 'lucide-react';
import { useSectionStore } from '@/store/sectionStore';
import { useEffect } from 'react';

const StarredPage = () => {
  const navigate = useNavigate();
  const setSection = useSectionStore((s) => s.setSection);

  useEffect(() => setSection('starred'), []);

  const { data, isLoading } = useStarred();

  // ⭐ Static breadcrumb for starred items
  const breadcrumbPath = 'Home / Starred';

  if (isLoading) return <div className="p-6">Loading...</div>;

  const directories = data?.directories ?? [];

  function openDirectory(id) {
    navigate(`/directory/${id}`, { state: { fromStarred: true } });
  }

  return (
    <div className="p-6">
      {/* Directories */}
      {directories.length > 0 && (
        <>
          <h3 className="font-medium mb-3">Starred Folders</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-10">
            {directories.map((dir) => (
              <DirCard
                key={dir._id}
                id={dir._id}
                name={dir.name}
                isStarred={dir.isStarred}
                onOpen={openDirectory}
                refetch={() => {}} // optional
                details={{
                  createdAt: dir.createdAt,
                  updatedAt: dir.updatedAt,
                  size: dir.size,
                  path: breadcrumbPath, // 🔥 IMPORTANT
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Empty State */}
      {directories.length === 0 && (
        <div className="relative w-full flex flex-col items-center justify-center p-12 mt-6 overflow-hidden ">
          {/* Decorative Background Blobs */}
          <div className="absolute top-0 right-0 -mr-10 -mt-10 w-32 h-32 bg-purple-200 rounded-full blur-3xl opacity-40 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-32 h-32 bg-indigo-200 rounded-full blur-3xl opacity-40 animate-pulse delay-700"></div>

          {/* Main Icon Group */}
          <div className="relative z-10 mb-6 group">
            <div className="absolute inset-0 bg-pink-400 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="relative bg-white p-4 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.06)] ring-1 ring-black/5">
              <Star className="w-10 h-10 text-pink-400 fill-pink-400" />
              {/* Floating tiny folder */}
              <div className="absolute -bottom-2 -right-2 bg-pink-400 p-1.5 rounded-full border-2 border-white">
                <FolderOpen className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Text Content */}
          <h3 className="relative z-10 text-xl font-bold text-gray-800 mb-2 text-center">
            No Starred Folders Found
          </h3>
          <p className="relative z-10 text-gray-500 text-center max-w-xs text-sm leading-relaxed">
            Important directories will appear here. Mark your favorite folders
            with a star to access them quickly.
          </p>
        </div>
      )}
    </div>
  );
};

export default StarredPage;

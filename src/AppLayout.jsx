import { useState } from 'react';
import { useSectionStore } from '../src/store/sectionStore';
import {
  useNavigate,
  Link,
  useLocation,
  useParams,
  Outlet,
} from 'react-router-dom';
import AuthDropDown from '../components/AuthDropDown';
import {
  FiSearch,
  FiMenu,
  FiGrid,
  FiUsers,
  FiShare2,
  FiStar,
} from 'react-icons/fi';
import { BsInbox } from 'react-icons/bs';
import toast, { Toaster } from 'react-hot-toast';
import FileUpload from '../components/FileUpload';
import CreateDirectory from '../components/CreateDirectory';
import { formatFileSize } from '../utility/functions';
import { useCurrentUser } from './hooks/otherHooks';
import { MdSubscriptions, MdWorkspacePremium } from 'react-icons/md';

const AppLayout = ({ children }) => {
  const BASE_URL = 'http://localhost:3000';
  const navigate = useNavigate();
  const location = useLocation();
  const { dirId } = useParams();

  // Fetch Current User from React Query
  const { data: currentUser, isPending } = useCurrentUser();
  const currentSection = useSectionStore((s) => s.currentSection);

  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [folderName, setFolderName] = useState('');

  // Sidebar items
  const SidebarItem = ({ icon: Icon, label, to, section }) => {
    const currentSection = useSectionStore((s) => s.currentSection);

    const active = currentSection === section;

    return (
      <Link to={to}>
        <div
          className={`flex items-center gap-4 px-6 py-4 cursor-pointer transition-all duration-300 ${
            active
              ? 'text-rose-500 bg-rose-50 border-r-4 border-rose-500'
              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Icon className="w-5 h-5" />
          <span className="font-medium text-sm">{label}</span>
        </div>
      </Link>
    );
  };

  // -------------------- DIRECTORY CREATION --------------------
  async function handleCreateDirectory(e) {
    e.preventDefault();

    const URL = `${BASE_URL}/directory/${dirId || ''}`;
    const response = await fetch(URL, {
      method: 'POST',
      credentials: 'include',
      headers: { folderName },
    });

    const data = await response.json();
    setFolderName('');

    if (!response.ok) {
      toast.error(data.error || 'Something went wrong');
      return;
    }

    toast.success('Directory created!');
    setShouldRefresh(true);
  }

  return (
    <div className="flex h-screen bg-gray-50 font-[Poppins] overflow-hidden text-slate-800">
      <Toaster position="top-center" />

      {/* ------------------- SIDEBAR ------------------- */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white flex flex-col shadow-xl transition-transform duration-300 lg:translate-x-0 lg:static lg:shadow-none border-r border-slate-100 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div
          className="h-24 flex items-center px-8 gap-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <img src="/logo.svg" alt="logo" className="w-8 lg:w-10" />
          <span className="text-xl lg:text-2xl font-bold text-pink-400 tracking-tight">
            Storifyy
          </span>
        </div>
        <nav className="flex flex-col gap-1 py-4">
          <SidebarItem
            icon={FiGrid}
            label="Dashboard"
            to="/"
            section="dashboard"
          />

          {currentUser?.role === 'Admin' && (
            <SidebarItem
              icon={FiUsers}
              label="Application Users"
              to="/users"
              section="users"
            />
          )}

          <SidebarItem
            icon={BsInbox}
            label="Inbox"
            to="/inbox"
            section="inbox"
          />

          <SidebarItem
            icon={FiShare2}
            label="Shared"
            to="/shared"
            section="shared"
          />

          <SidebarItem
            icon={FiStar}
            label="Starred"
            to="/starred"
            section="starred"
          />
        </nav>

        <div className="mt-auto p-6 flex items-center justify-center">
          <img src="/Illustration.png" className="w-28" alt="" />
        </div>
      </aside>

      {/* MOBILE OVERLAY */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* ------------------- MAIN CONTENT ------------------- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-24 px-8 flex items-center justify-between bg-[#F3F4F8] shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-600"
            >
              <FiMenu className="w-6 h-6" />
            </button>

            <div className="hidden md:flex items-center bg-white px-5 py-3 rounded-3xl w-[400px] shadow-sm border border-slate-100">
              <FiSearch className="text-slate-400 mr-3 w-5 h-5" />
              <input
                type="text"
                placeholder="Search files..."
                className="bg-transparent border-none outline-none w-full text-sm font-medium text-slate-700 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate('/plans')}
              className="flex items-center gap-2 cursor-pointer  px-4 py-3 rounded-3xl bg-pink-400 text-white hover:shadow-sm transition"
            >
              <MdWorkspacePremium size={20} />
              <span className="text-sm font-medium">Upgrade Plan</span>
            </button>
            <div className="flex gap-4">
              <FileUpload setShouldRefresh={setShouldRefresh} />

              <CreateDirectory
                folderName={folderName}
                setfolderName={setFolderName}
                handleCreateDirectory={handleCreateDirectory}
              />
            </div>

            <div className="pl-4 border-l border-slate-300/50">
              <AuthDropDown BASEURL={BASE_URL} />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto custom-scrollbar pt-0">
            {children || (
              <Outlet context={{ shouldRefresh, setShouldRefresh }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;

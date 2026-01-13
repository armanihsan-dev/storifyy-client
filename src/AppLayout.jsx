import { useEffect, useState } from 'react';
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
import {
  useCurrentUser,
  useMySubscription,
  useSearch,
} from './hooks/otherHooks';
import GoogleDrivePicker from '../components/GoogleDrivePicker';
import { AccountHibernation } from '../components/DisabledAccount';
import FullPageLoader from '../components/FullPageLoader';

const AppLayout = () => {
  const BASE_URL = 'https://storifyy-backend.onrender.com';
  const navigate = useNavigate();
  const { dirId } = useParams();
  const { pathname } = useLocation();

  /* -------------------- DEBOUNCE -------------------- */
  function useDebounce(value, delay = 400) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
      const t = setTimeout(() => setDebounced(value), delay);
      return () => clearTimeout(t);
    }, [value, delay]);

    return debounced;
  }

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search);

  const { data: searchResult } = useSearch(debouncedSearch, dirId);

  /* -------------------- AUTH -------------------- */
  const { data: currentUser, isPending, isError } = useCurrentUser();
  const { data: subscriptionData } = useMySubscription();

  /* -------------------- UI STATE -------------------- */
  const currentSection = useSectionStore((s) => s.currentSection);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [folderName, setFolderName] = useState('');

  /* -------------------- AUTH REDIRECT -------------------- */
  useEffect(() => {
    if (!isPending && (isError || !currentUser)) {
      navigate('/login', { replace: true });
    }
  }, [isPending, isError, currentUser, navigate]);

  /* -------------------- LOADING -------------------- */
  if (isPending) {
    return <FullPageLoader />;
  }

  /* ⛔ stop render while redirecting */
  if (!currentUser) {
    return null;
  }

  /* -------------------- DISABLED ACCOUNT -------------------- */
  if (currentUser.isDisabled) {
    return (
      <AccountHibernation
        user={currentUser}
        subscriptionData={subscriptionData}
      />
    );
  }

  /* -------------------- SIDEBAR ITEM -------------------- */
  const SidebarItem = ({ icon: Icon, label, to, section }) => {
    const active = currentSection === section;

    return (
      <Link to={to} onClick={() => setMobileMenuOpen(false)}>
        <div
          className={`flex items-center gap-4 px-6 py-4 transition-all ${
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

  /* -------------------- CREATE DIRECTORY -------------------- */
  async function handleCreateDirectory(e) {
    e.preventDefault();

    const response = await fetch(`${BASE_URL}/directory/${dirId || ''}`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folderName }),
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

  /* ==================== RENDER ==================== */
  return (
    <div className="flex h-screen bg-gray-50 font-[Poppins] overflow-hidden">
      <Toaster position="top-center" />

      {/* ---------------- SIDEBAR ---------------- */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white flex flex-col justify-between border-r transition-transform lg:static lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          <div
            className="h-24 flex items-center px-8 gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img src="/logo.svg" className="w-14" />
            <span className="text-2xl font-bold text-pink-400">Storifyy</span>
          </div>

          <nav className="flex flex-col gap-1 py-4">
            <SidebarItem
              icon={FiGrid}
              label="Dashboard"
              to="/"
              section="dashboard"
            />

            {(currentUser.role === 'Admin' || currentUser.role === 'Owner') && (
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
        </div>

        <img
          src="/Illustration.png"
          className="w-32 self-center mb-12"
          alt=""
        />
      </aside>

      {/* ---------------- MAIN ---------------- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-24 px-8 flex items-center justify-between bg-[#F3F4F8]">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden"
            >
              <FiMenu className="w-6 h-6" />
            </button>

            {pathname === '/' && (
              <div className="hidden md:flex bg-white px-5 py-3 rounded-3xl items-center w-[400px]">
                <FiSearch className="mr-3" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search files..."
                  className="w-full outline-none bg-transparent"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            {pathname === '/' && (
              <>
                <GoogleDrivePicker />
                <FileUpload setShouldRefresh={setShouldRefresh} />
                <CreateDirectory
                  folderName={folderName}
                  setfolderName={setFolderName}
                  handleCreateDirectory={handleCreateDirectory}
                />
              </>
            )}
            <AuthDropDown BASEURL={BASE_URL} />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet
            context={{
              shouldRefresh,
              setShouldRefresh,
              searchQuery: debouncedSearch,
              searchResult,
              isSearching: !!debouncedSearch,
            }}
          />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

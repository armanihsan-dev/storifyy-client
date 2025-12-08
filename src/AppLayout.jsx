import { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import AuthDropDown from '../components/AuthDropDown';
import { FiSearch, FiMenu, FiGrid, FiUsers } from 'react-icons/fi';
import { BsInbox } from 'react-icons/bs';
import toast, { Toaster } from 'react-hot-toast';
import CurrentUserContext from '../Context/CurrentUserContent';
import FileUpload from '../components/FileUpload';
import CreateDirectory from '../components/CreateDirectory';
import { Outlet } from 'react-router-dom';

const AppLayout = ({ children }) => {
  const BASE_URL = 'http://localhost:3000';
  const navigate = useNavigate();
  const location = useLocation();

  const { currentUser } = useContext(CurrentUserContext);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [folderName, setFolderName] = useState('');

  const SidebarItem = ({ icon: Icon, label, to }) => {
    const active = location.pathname === to;

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

  const StorageWidget = () => (
    <div className="mx-6 mt-6 p-6 rounded-lg bg-pink-400 text-white ">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-full border-4 border-white/30 flex items-center justify-center">
          <span className="text-xs font-bold">65%</span>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/80 font-medium">Available Storage</p>
          <p className="text-lg font-bold">
            82GB <span className="text-xs opacity-70">/ 128GB</span>
          </p>
        </div>
      </div>

      <div className="w-full bg-black/10 rounded-full h-1.5 mt-2">
        <div className="bg-white h-1.5 rounded-full w-[65%]"></div>
      </div>
    </div>
  );

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
          <img src="../public/logo.svg" alt="logo" className="w-8 lg:w-10" />
          <span className="text-xl lg:text-2xl font-bold text-pink-400 tracking-tight">
            Storifyy
          </span>
        </div>

        {/* NAVIGATION */}
        <nav className="flex flex-col gap-1 py-4">
          <SidebarItem icon={FiGrid} label="Dashboard" to="/" />
          {currentUser?.role === 'Admin' && (
            <SidebarItem icon={FiUsers} label="Application Users" to="/users" />
          )}

          <SidebarItem icon={BsInbox} label="Inbox" to="/inbox" />
          <SidebarItem icon={BsInbox} label="Shared" to="/shared" />
        </nav>

        <div className="mt-auto pb-8">
          <StorageWidget />
        </div>
      </aside>

      {/* MOBILE OVERLAY */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* ------------------- MAIN AREA ------------------- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ------------------- HEADER / TOPBAR ------------------- */}
        <header className="h-24 px-8 flex items-center justify-between bg-[#F3F4F8] shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-slate-600"
            >
              <FiMenu className="w-6 h-6" />
            </button>

            <div className="hidden md:flex items-center bg-white px-5 py-3 rounded-lg w-[400px] shadow-sm border border-slate-100 focus-within:ring-2 focus-within:ring-rose-100 transition-all">
              <FiSearch className="text-slate-400 mr-3 w-5 h-5" />
              <input
                type="text"
                placeholder="Search files..."
                className="bg-transparent border-none outline-none w-full text-sm font-medium text-slate-700 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <FileUpload getDirectories={() => {}} />
            <CreateDirectory
              folderName={folderName}
              setfolderName={setFolderName}
              handleCreateDirectory={() => {}}
            />
            <div className="pl-4 border-l border-slate-300/50">
              <AuthDropDown BASEURL={BASE_URL} />
            </div>
          </div>
        </header>

        {/* ------------------- SCROLLABLE OUTLET AREA ------------------- */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto custom-scrollbar p-8 pt-0">
            {/* Render nested pages here */}
            {children || <Outlet />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppLayout;

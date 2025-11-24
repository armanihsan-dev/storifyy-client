import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { FaFolderPlus } from 'react-icons/fa';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const CreateDirectory = ({
  handleCreateDirectory,
  setfolderName,
  folderName,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCreateDirectory(e);
    setIsOpen(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <div className="border bg-pink-400 flex items-center gap-2 text-white font-medium rounded-full px-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setIsOpen(true)}
              className="cursor-pointer bg-pink-400 text-white rounded-full py-3 flex items-center space-x-2"
            >
              <FaFolderPlus size={20} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top" align="center">
            <p>Create Folder</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Modal using React Portal */}
      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-fadeIn">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Create New Folder
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  onChange={(e) => setfolderName(e.target.value)}
                  value={folderName}
                  placeholder="Enter folder name"
                  className="w-full border border-black text-black rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
                  required
                />

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-pink-400 text-white shadow"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}

      {/* Simple Fade-in animation */}
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
};

export default CreateDirectory;

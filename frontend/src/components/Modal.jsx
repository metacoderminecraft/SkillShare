import React from 'react';

const Modal = ({ render, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="flex flex-col bg-white p-4 rounded shadow-lg w-1/3 relative">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-2 right-2 bg-gray-200 p-2 rounded-full text-xl"
          aria-label="Close">
          &times;
        </button>

        {/* Modal Content */}
        <div className='m-3'>
          {render()}
        </div>
      </div>
    </div>
  );
};

export default Modal;

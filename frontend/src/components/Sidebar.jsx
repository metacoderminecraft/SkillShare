import React from 'react'

const Sidebar = ({ title, renderDisplay, className = "w-64 h-screen bg-white text-black " }) => {
  return (
    <div className="flex">
        <div className={`${className} flex-shrink-0`}>
            <div className="p-4">
                <h2 className="text-2xl font-semibold">{title}</h2>
            </div>
            
            <div className="overflow-y-auto h-full px-4 py-2">
                {renderDisplay()}
            </div>
        </div>
    </div>
  )
}

export default Sidebar
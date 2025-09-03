import React from 'react'

const AIChat = () => {
  return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-sky-100">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4 animate-pulse">Coming Soon...</h2>
        <div className="w-64 h-2 bg-blue-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-300 animate-loading-bar rounded-full"></div>
        </div>
      </div>
    );
}

export default AIChat
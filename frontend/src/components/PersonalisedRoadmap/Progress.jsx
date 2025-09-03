export const Progress = ({ value = 0, className = "" }) => (
  <div className={`relative h-1 w-full overflow-hidden rounded-full bg-gray-100 ${className}`}>
    <div
      className="h-full bg-blue-500 transition-all duration-300 ease-in-out"
      style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
    />
  </div>
)
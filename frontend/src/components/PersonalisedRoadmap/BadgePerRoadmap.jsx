export const Badge = ({ children, className = "", variant = "default" }) => {
  const variants = {
    default: "bg-gray-100 text-gray-900",
    outline: "border border-gray-200 bg-transparent text-gray-900",
  }

  return (
    <div
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${variants[variant]} ${className}`}
    >
      {children}
    </div>
  )
}
export const Button = ({ children, className = "", variant = "default", size = "default", onClick, ...props }) => {
  const variants = {
    default: "bg-gray-900 text-gray-50 hover:bg-gray-900/90",
    outline: "border border-gray-200 bg-white hover:bg-gray-100",
    ghost: "hover:bg-gray-100",
  }

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3 text-sm",
  }

  return (
    <button
      className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}
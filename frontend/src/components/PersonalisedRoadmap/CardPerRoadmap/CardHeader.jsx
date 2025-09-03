export const CardHeader = ({ children, className = "", onClick }) => (
  <div className={`p-6 ${className}`} onClick={onClick}>
    {children}
  </div>
)
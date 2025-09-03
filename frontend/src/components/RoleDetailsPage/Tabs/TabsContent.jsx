export const TabsContent = ({ children, value, activeTab, className = "" }) => {
  if (activeTab !== value) return null;
  
  return (
    <div className={`mt-2 ${className}`}>
      {children}
    </div>
  );
};
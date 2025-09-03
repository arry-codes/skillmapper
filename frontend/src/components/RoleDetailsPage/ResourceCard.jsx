import { iconMap } from "../../data/iconMap";
import { ExternalLink } from "lucide-react";
export const ResourceCard = ({ resource }) => {
  const getProviderColor = (provider) => {
    const colors = {
      freeCodeCamp: "text-green-600",
      Udemy: "text-purple-600",
      Coursera: "text-blue-600",
      YouTube: "text-red-600",
      Mozilla: "text-orange-600",
      Meta: "text-blue-500",
      default: "text-gray-600",
    };
    return colors[provider] || colors.default;
  };

  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors group cursor-pointer">
      <div className="flex-shrink-0 text-gray-600 group-hover:text-gray-800">
        {iconMap[resource.icon]}
      </div>
      <div className="flex-grow min-w-0">
        <h4 className="font-medium text-gray-900 truncate">{resource.title}</h4>
        <p className={`text-sm ${getProviderColor(resource.provider)}`}>
          {resource.provider}
        </p>
      </div>
      <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-gray-600 flex-shrink-0" />
    </div>
  );
};
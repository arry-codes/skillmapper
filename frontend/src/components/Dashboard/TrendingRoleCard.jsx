import Card from "../Card/Card";
import CardHeader from "../Card/CardHeader";
import CardTitle from "../Card/CardTitle";
import { Badge } from "../Badge/Badge";
import { TrendingUp,Star,ArrowRight,Code,Briefcase,Palette} from "lucide-react";
import CardContent from "../Card/CardContent";
import CardDescription from "../Card/CardDescription";
import { Button } from "../Button/Button";
import { iconMap } from "../../data/iconMap";


export const TrendingRoleCard = ({ role, onViewRoadmap }) => {
  return (
    <Card className="relative overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-5 pointer-events-none`} />
      <CardHeader className="relative">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${role.color} text-white`}>
              {iconMap[role.icon]}
            </div>
            <div>
              <CardTitle className="text-xl font-bold">{role.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {role.growth}
                </Badge>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="font-semibold">{role.popularity}</span>
            </div>
            <p className="text-xs text-gray-500">popularity</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm leading-relaxed mb-4">
          {role.description}
        </CardDescription>
        <Button 
          className="w-full group" 
          onClick={() => onViewRoadmap(role.id)}
        >
          View Roadmap
          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
};
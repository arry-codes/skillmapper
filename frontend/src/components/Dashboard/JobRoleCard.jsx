import Card from "../Card/Card";
import CardContent from "../Card/CardContent";
import CardHeader from "../Card/CardHeader";
import CardDescription from "../Card/CardDescription";
import CardTitle from "../Card/CardTitle";
import {ArrowRight} from "lucide-react";
import {Badge} from '../Badge/Badge';
import { Button } from "../Button/Button";
import { iconMap } from "../../data/iconMap";

export const JobRoleCard = ({ role, onLearnMore }) => {
  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
            {iconMap[role.icon]}
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">{role.name}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <CardDescription className="text-sm leading-relaxed">
          {role.description}
        </CardDescription>

        <div className="flex flex-wrap gap-1">
          {role.skills.map((skill, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>

        <Button 
          variant="outline" 
          className="w-full group"
          onClick={() => onLearnMore(role.id)}
        >
          Learn More
          <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </CardContent>
    </Card>
  );
};
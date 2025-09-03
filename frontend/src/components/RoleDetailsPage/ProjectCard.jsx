import Card from "../Card/Card";
import CardContent from "../Card/CardContent";
import CardTitle from "../Card/CardTitle";
import CardHeader from "../Card/CardHeader";
import { Badge } from "../Badge/Badge";
import { Clock } from "lucide-react";
export const ProjectCard = ({ project }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{project.title}</CardTitle>
          <Badge variant="outline" className="text-xs">
            {project.difficulty}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          {project.duration}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-600">{project.description}</p>
        <div className="flex flex-wrap gap-1">
          {project.skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
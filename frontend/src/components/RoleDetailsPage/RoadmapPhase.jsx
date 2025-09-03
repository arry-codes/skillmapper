import { useState, useEffect } from "react";
import axios from "axios";
import Card from "../Card/Card";
import CardHeader from "../Card/CardHeader";
import CardTitle from "../Card/CardTitle";
import { Badge } from "../Badge/Badge";
import { Clock } from "lucide-react";
import { ProgressBar } from "./ProgressBar";
import CardContent from "../Card/CardContent";
import { Checkbox } from "./Checkbox";
import { Tabs } from "./Tabs/Tabs";
import { TabsContent } from "./Tabs/TabsContent";
import { TabsTrigger } from "./Tabs/TabsTrigger";
import { TabsList } from "./Tabs/TabsList";
import { ResourceCard } from "./ResourceCard";
import { ProjectCard } from "./ProjectCard"

export const RoadmapPhase = ({ phase, roadmapId, isCompleted = false ,onProgressUpdate}) => {
  const [checkedTopics, setCheckedTopics] = useState({});
  const [checkedProjects, setCheckedProjects] = useState({});

  // Fetch progress on mount
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/staticRoles/progress/${roadmapId}`,
          {
            headers: {
              'authToken': token
            }
          }
        );
        const { completedTopics = [], completedProjects = [] } = res.data;

        const topics = {};
        completedTopics.forEach(
          ({ phaseId, topicId }) =>
            phaseId === phase.id && (topics[topicId] = true)
        );

        const projects = {};
        completedProjects.forEach(
          ({ phaseId, projectId }) =>
            phaseId === phase.id && (projects[projectId] = true)
        );

        setCheckedTopics(topics);
        setCheckedProjects(projects);
      } catch (err) {
        console.error("Error fetching progress", err);
      }
    };

    fetchProgress();
  }, [roadmapId, phase.id]);

  // Handle topic check toggle
  const handleTopicCheck = async (topic) => {
    const topicId = topic.id;
    const newState = !checkedTopics[topicId];

    setCheckedTopics((prev) => ({ ...prev, [topicId]: newState }));

    try {
      const token = localStorage.getItem('authToken')
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/staticRoles/progress/updateTopic`,
        {
          topicId,
          phaseId: phase.id,
          roadmapId,
          action: newState ? "add" : "remove",
        },
        {
          headers: {
            authToken: token, 
          },
        }
      );

    } catch (err) {
      console.error("Failed to update topic progress", err);
    }
  };

  // Handle project check toggle
  const handleProjectCheck = async (project) => {
    const projectId = project.id;
    const newState = !checkedProjects[projectId];

    setCheckedProjects((prev) => ({ ...prev, [projectId]: newState }));

    try {
      const token = localStorage.getItem('authToken')
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/staticRoles/progress/updateProject`,
        {
          projectId,
          phaseId: phase.id,
          roadmapId,
          action: newState ? "add" : "remove",
        },
        {
          headers: {
            authToken: token, // or Authorization: `Bearer ${token}` if your backend expects it
          },
        }
      );

    } catch (err) {
      console.error("Failed to update project progress", err);
    }
  };

const topicsInPhaseIds = new Set(phase.topics.map(t => t.id));
const projectsInPhaseIds = new Set(phase.projects.map(p => p.id));

const topicsCompleted = Object.entries(checkedTopics)
  .filter(([topicId, checked]) => checked && topicsInPhaseIds.has(Number(topicId)))
  .length;

const projectsCompleted = Object.entries(checkedProjects)
  .filter(([projectId, checked]) => checked && projectsInPhaseIds.has(Number(projectId)))
  .length;

const totalTopics = phase.topics.length;
const totalProjects = phase.projects.length;

const totalItems = totalTopics + totalProjects;
const overallProgress = totalItems === 0 ? 100 : ((topicsCompleted + projectsCompleted) / totalItems) * 100;


      useEffect(() => {
    onProgressUpdate(overallProgress);
  }, [overallProgress, onProgressUpdate]);

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`h-8 w-8 rounded-full flex items-center justify-center text-white font-semibold ${isCompleted ? "bg-green-500" : "bg-blue-500"
                  }`}
              >
                {phase.id}
              </div>
              <div>
                <CardTitle className="text-xl">{phase.title}</CardTitle>
                <div className="flex items-center gap-4 mt-1">
                  <Badge variant="outline">{phase.difficulty}</Badge>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {phase.duration}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-gray-600">{phase.description}</p>
          </div>
        </div>

        <div className="mt-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Overall Progress</span>
            <span>{Math.round(overallProgress)}%</span>
          </div>
          <ProgressBar value={overallProgress} className="h-2" />
        </div>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="topics" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="topics">
              Topics ({topicsCompleted}/{totalTopics})
            </TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="projects">
              Projects ({projectsCompleted}/{totalProjects})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="topics" className="mt-6">
            <div className="space-y-3">
              {phase.topics.map((topic) => (
                <div
                  key={topic.id}
                  className="flex items-center space-x-3 p-2 rounded hover:bg-gray-50"
                >
                  <Checkbox
                    id={`topic-${phase.id}-${topic.id}`}
                    checked={checkedTopics[topic.id] || false}
                    onChange={() => handleTopicCheck(topic)}
                  />
                  <label
                    htmlFor={`topic-${phase.id}-${topic.id}`}
                    className={`text-sm cursor-pointer flex-grow ${checkedTopics[topic.id] ? "line-through text-gray-500" : ""
                      }`}
                  >
                    {topic.name}
                  </label>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resources" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {phase.resources.map((resource, index) => (
                <ResourceCard key={index} resource={resource} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="projects" className="mt-6">
            <div className="space-y-4">
              {phase.projects.map((project) => (
                <div key={project.id} className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id={`project-${phase.id}-${project.id}`}
                      checked={checkedProjects[project.id] || false}
                      onChange={() => handleProjectCheck(project)}
                    />
                    <label
                      htmlFor={`project-${phase.id}-${project.id}`}
                      className={`font-medium cursor-pointer ${checkedProjects[project.id] ? "line-through text-gray-500" : ""
                        }`}
                    >
                      Mark as Complete
                    </label>
                  </div>
                  <ProjectCard project={project} />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

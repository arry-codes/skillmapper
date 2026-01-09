import React, { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { Card } from "./CardPerRoadmap/Card"
import { CardHeader } from "./CardPerRoadmap/CardHeader"
import { CardTitle } from "./CardPerRoadmap/CardTitle"
import { CardContent } from "./CardPerRoadmap/CardContent"
import { Badge } from "./BadgePerRoadmap"
import { Button } from "./ButtonPerRoadmap"
import { Progress } from "./Progress"
import { Code, BookOpen, Video, FileText, BookMarked, Globe, Sparkles, TrendingUp, BarChart3, Clock, Target, CheckCircle2, CheckCircle, Circle, CheckSquare, ExternalLink, ChevronDown } from "lucide-react"
import { AnimatedCounter } from "./AnimatedCounter"

import axios from "axios"

// Memoized Checkbox component
const Checkbox = React.memo(({ id, checked = false, onCheckedChange, className = "" }) => (
  <input
    type="checkbox"
    id={id}
    checked={checked}
    onChange={(e) => onCheckedChange && onCheckedChange(e.target.checked)}
    className={`h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 ${className}`}
  />
))

// Optimized scroll animation hook - debounced
const useScrollAnimation = (trigger) => {
  const [visibleElements, setVisibleElements] = useState(new Set());
  const observerRef = useRef(null);

  useEffect(() => {
    if (!trigger) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const newVisible = new Set();
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            newVisible.add(entry.target.id);
            observer.unobserve(entry.target);
          }
        });

        if (newVisible.size > 0) {
          setVisibleElements((prev) => new Set([...prev, ...newVisible]));
        }
      },
      { threshold: 0.1, rootMargin: "50px" }
    );

    observerRef.current = observer;

    // Reduced timeout and batch observe elements
    const timeout = setTimeout(() => {
      const elements = document.querySelectorAll("[data-animate]");
      elements.forEach((el) => observer.observe(el));
    }, 500); // Reduced from 1500ms

    return () => {
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [trigger]);

  return visibleElements;
};

// Utility functions (moved outside component to avoid recreating)
const getResourceIcon = (type) => {
  switch (type.toLowerCase()) {
    case "course":
      return <Video />
    case "documentation":
      return <FileText />
    case "tutorial":
      return <Video />
    case "practice":
      return <Code />
    case "book":
      return <BookMarked />
    case "video":
      return <Video />
    default:
      return <Globe />
  }
};

const getDifficultyColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case "beginner":
      return "bg-green-100 text-green-700 border-green-200"
    case "intermediate":
      return "bg-blue-100 text-blue-700 border-blue-200"
    case "advanced":
      return "bg-indigo-100 text-indigo-700 border-indigo-200"
    default:
      return "bg-gray-100 text-gray-700 border-gray-200"
  }
};

// Main Component
const PersonalizedRoadmap = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added error state
  const [activeStep, setActiveStep] = useState(null);
  const [checkedTopics, setCheckedTopics] = useState({});
  const [scrollProgress, setScrollProgress] = useState(0);
  const [data, setData] = useState(null);

  // Use refs to prevent unnecessary re-renders
  const pendingUpdates = useRef(new Set());
  const updateTimeoutRef = useRef(null);

  const visibleElements = useScrollAnimation(data);

  // Debounced scroll handler
  const handleScroll = useCallback(() => {
    const scrolled = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0;
    setScrollProgress(progress);
  }, []);

  // Throttled scroll event
  useEffect(() => {
    let ticking = false;

    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => window.removeEventListener("scroll", throttledScroll);
  }, [handleScroll]);

  // Optimized data fetching
  useEffect(() => {
    const fetchEverything = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          throw new Error("No authentication token found. Please login.");
        }

        // Parallel API calls
        const [roadmapResponse, progressResponse] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/personalisedRole/get-roadmap`,
            { headers: { authToken: token } }
          ),
          axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/personalisedRole/progress`,
            { headers: { authToken: token } }
          )
        ]);

        if (!roadmapResponse.data) {
          throw new Error("No roadmap data received");
        }

        setData(roadmapResponse.data);

        // Batch state update for checked topics
        const initialCheckedTopics = {};

        if (progressResponse.data.completedTopics?.length > 0) {
          progressResponse.data.completedTopics.forEach(({ phaseId, topicId }) => {
            const stepKey = `step-${phaseId}`;
            if (!initialCheckedTopics[stepKey]) {
              initialCheckedTopics[stepKey] = new Set();
            }
            initialCheckedTopics[stepKey].add(topicId);
          });
        }

        if (progressResponse.data.completedProjects?.length > 0) {
          initialCheckedTopics["capstone"] = new Set();
          progressResponse.data.completedProjects.forEach(({ topicId }) => {
            initialCheckedTopics["capstone"].add(topicId);
          });
        }

        setCheckedTopics(initialCheckedTopics);

      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load roadmap. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchEverything();
  }, []);

  // Debounced API updates
  const handleTopicCheck = useCallback(async (stepKey, phaseId, topicId, checked) => {
    // Optimistic UI update
    setCheckedTopics((prev) => {
      const next = { ...prev };
      if (!next[stepKey]) next[stepKey] = new Set();

      if (checked) {
        next[stepKey].add(topicId);
      } else {
        next[stepKey].delete(topicId);
      }
      return next;
    });

    // Add to pending updates
    const updateKey = `${stepKey}-${topicId}`;
    pendingUpdates.current.add(updateKey);

    // Clear existing timeout
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    // Debounce API calls
    updateTimeoutRef.current = setTimeout(async () => {
      if (!pendingUpdates.current.has(updateKey)) return;

      try {
        const token = localStorage.getItem("authToken");

        if (stepKey === "capstone") {
          await axios.patch(
            `${import.meta.env.VITE_BACKEND_URL}/api/personalisedRole/progress/updateProject`,
            { topicId, action: checked ? "add" : "remove" },
            { headers: { authToken: token } }
          );
        } else {
          await axios.patch(
            `${import.meta.env.VITE_BACKEND_URL}/api/personalisedRole/progress/updateTopic`,
            { phaseId, topicId, action: checked ? "add" : "remove" },
            { headers: { authToken: token } }
          );
        }

        pendingUpdates.current.delete(updateKey);
      } catch (err) {
        console.error("Progress update failed:", err);
        pendingUpdates.current.delete(updateKey);

        // Rollback on error
        setCheckedTopics((prev) => {
          const next = { ...prev };
          if (!next[stepKey]) next[stepKey] = new Set();

          if (checked) {
            next[stepKey].delete(topicId);
          } else {
            next[stepKey].add(topicId);
          }
          return next;
        });
      }
    }, 300); // 300ms debounce
  }, []);

  // Memoized calculations
  const getStepProgress = useCallback((stepKey, totalTopics) => {
    const checkedCount = checkedTopics[stepKey]?.size || 0;
    return Math.round((checkedCount / totalTopics) * 100);
  }, [checkedTopics]);

  const handleStepClick = useCallback((index) => {
    setActiveStep(activeStep === index ? null : index);
  }, [activeStep]);

  const overallProgress = useMemo(() => {
    if (!data) return 0;

    let totalTopics = 0;
    let checkedCount = 0;

    data.personalisedSteps.forEach((step, index) => {
      totalTopics += step.topicNames.length;
      checkedCount += checkedTopics[`step-${index}`]?.size || 0;
    });

    totalTopics += data.capstoneProject.topicNames.length;
    checkedCount += checkedTopics["capstone"]?.size || 0;

    return totalTopics > 0 ? Math.round((checkedCount / totalTopics) * 100) : 0;
  }, [data, checkedTopics]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-sky-100">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">Generating your roadmap...</h2>
        <div className="w-64 h-2 bg-blue-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-300 animate-pulse rounded-full"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-orange-100">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
        <p className="text-gray-700 mb-6">{error}</p>
        <Button
          onClick={() => window.location.reload()}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          Try Again
        </Button>
      </div>
    );
  }

  if (!data) {
    return null; // Should not happen if error is handled, but safe fallback
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-blue-50 via-white to-sky-50">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-blue-100 z-50">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-sky-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/3 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        {/* Hero Section */}
        <div
          id="hero"
          data-animate
          className={`mb-16 text-center transition-all duration-1000 ${visibleElements.has("hero") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-sky-500/10 blur-3xl rounded-full" />
            <div className="relative bg-white/95 backdrop-blur-xl border border-blue-200/50 rounded-3xl p-8 mb-8 shadow-2xl">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-sky-500 rounded-2xl shadow-lg">
                  <Sparkles />
                </div>
                <div>
                  <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
                    Your Learning Roadmap
                  </h1>
                  <p className="text-xl text-gray-700 mt-2">{data.role}</p>
                </div>
              </div>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">{data.description}</p>
            </div>
          </div>
        </div>

        {/* Stats Dashboard */}
        <div
          id="stats"
          data-animate
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 transition-all duration-1000 delay-200 ${visibleElements.has("stats") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
        >
          <Card className="bg-white/95 backdrop-blur-xl border-blue-200/50 hover:border-green-300 transition-all duration-300 group shadow-lg hover:shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <TrendingUp />
                </div>
                <div className="py-4">
                  <p className="text-sm text-gray-600">Target Salary</p>
                  <p className="text-xl font-bold text-gray-800">{data.salary}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-xl border-blue-200/50 hover:border-blue-300 transition-all duration-300 group shadow-lg hover:shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-sky-500 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <BarChart3 />
                </div>
                <div className="py-4">
                  <p className="text-sm text-gray-600">Progress</p>
                  <p className="text-xl font-bold text-gray-800">
                    <AnimatedCounter value={overallProgress} suffix="%" />
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-xl border-blue-200/50 hover:border-indigo-300 transition-all duration-300 group shadow-lg hover:shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Clock />
                </div>
                <div className="py-4">
                  <p className="text-sm text-gray-600">Total Duration</p>
                  <p className="text-xl font-bold text-gray-800">
                    <AnimatedCounter value={13} /> weeks
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-xl border-blue-200/50 hover:border-cyan-300 transition-all duration-300 group shadow-lg hover:shadow-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Target />
                </div>
                <div className="py-4">
                  <p className="text-sm text-gray-600">Topics</p>
                  <p className="text-xl font-bold text-gray-800">
                    <AnimatedCounter
                      value={Object.values(checkedTopics).reduce((acc, topics) => acc + topics.size, 0)}
                    />
                    /
                    {data.personalisedSteps.reduce((acc, step) => acc + step.topicNames.length, 0) +
                      data.capstoneProject.topicNames.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Overall Progress Section */}
        <div
          id="progress"
          data-animate
          className={`mb-16 transition-all duration-1000 delay-300 ${visibleElements.has("progress") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
        >
          <Card className="bg-white/95 backdrop-blur-xl border-blue-200/50 shadow-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-800">Learning Journey Progress</h3>
                <div className="text-right">
                  <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-sky-600 bg-clip-text text-transparent">
                    {overallProgress}%
                  </div>
                  <div className="text-sm text-gray-600">Complete</div>
                </div>
              </div>
              <div className="relative">
                <Progress value={overallProgress} className="h-1 bg-blue-100" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-sky-500 rounded-full opacity-20 animate-pulse" />
              </div>
              <div className="flex justify-between mt-4 text-sm text-gray-600">
                <span>
                  {Object.values(checkedTopics).reduce((acc, topics) => acc + topics.size, 0)} topics completed
                </span>
                <span>
                  {data.personalisedSteps.reduce((acc, step) => acc + step.topicNames.length, 0) +
                    data.capstoneProject.topicNames.length -
                    Object.values(checkedTopics).reduce((acc, topics) => acc + topics.size, 0)}{" "}
                  remaining
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Current Skills */}
        <div
          id="skills"
          data-animate
          className={`mb-16 transition-all duration-1000 delay-500 ${visibleElements.has("skills") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
        >
          <Card className="bg-white/95 backdrop-blur-xl border-blue-200/50 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-gray-800">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg shadow-lg">
                  <CheckCircle />
                </div>
                Current Skills Arsenal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {data.currentSkills.map((skill, index) => (
                  <Badge
                    key={index}
                    className="bg-green-100 text-green-700 border-green-200 px-4 py-2 text-sm hover:bg-green-200 transition-colors duration-300 shadow-sm"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Learning Path Timeline */}
        <div className="mb-16">
          <div
            id="timeline-header"
            data-animate
            className={`text-center mb-12 transition-all duration-1000 delay-600 ${visibleElements.has("timeline-header") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center gap-3">
              <BookOpen />
              Your Learning Timeline
            </h2>
            <p className="text-gray-600 text-lg">Follow this carefully crafted path to achieve your goals</p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-sky-500 to-indigo-500" />

            <div className="space-y-8">
              {data.personalisedSteps.map((step, index) => {
                const stepKey = `step-${index}`
                const stepProgress = getStepProgress(stepKey, step.topicNames.length)
                const isActive = activeStep === index

                return (
                  <div
                    key={index}
                    id={`step-${index}`}
                    data-animate
                    className={`relative transition-all duration-1000 ${visibleElements.has(`step-${index}`) ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
                      }`}
                    style={{ transitionDelay: `${700 + index * 100}ms` }}
                  >
                    {/* Timeline Node */}
                    <div className="absolute left-6 top-8 w-4 h-4 rounded-full border-4 border-white bg-gradient-to-r from-blue-500 to-sky-500 z-10 shadow-lg" />

                    <Card
                      className={`ml-16 bg-white/95 backdrop-blur-xl border-blue-200/50 hover:border-blue-300 transition-all duration-300 group shadow-lg hover:shadow-xl ${stepProgress === 100 ? "border-green-300 bg-green-50/50" : ""
                        }`}
                    >
                      <CardHeader
                        className="cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => handleStepClick(index)}
                      >
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1">
                            {stepProgress === 100 ? <CheckCircle2 /> : <Circle />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-3">
                              <CardTitle className="text-xl text-gray-800 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                                {step.title}
                                <ChevronDown
                                  className={`transition-transform duration-200 ${isActive ? "rotate-180" : ""}`}
                                />
                              </CardTitle>
                              <div className="flex items-center gap-2">
                                <Badge className={getDifficultyColor(step.difficulty || "")}>{step.difficulty}</Badge>
                                <Badge
                                  variant="outline"
                                  className="flex items-center gap-1 text-gray-600 border-gray-300"
                                >
                                  <Clock />
                                  {step.estimatedTime}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-gray-600 mb-4">{step.description}</p>

                            {/* Progress Bar - Made thinner */}
                            <div className="mb-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Progress</span>
                                <span className="text-sm text-gray-600">{stepProgress}%</span>
                              </div>
                              <Progress value={stepProgress} className="h-1 bg-blue-100" />
                            </div>

                            {/* Required Skills */}
                            <div className="flex flex-wrap gap-2">
                              {step.requiredSkills.map((skill, skillIndex) => (
                                <Badge
                                  key={skillIndex}
                                  variant="outline"
                                  className="text-gray-600 border-gray-300 hover:border-blue-400 transition-colors"
                                >
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardHeader>

                      {/* Expandable Content */}
                      {isActive && (
                        <CardContent className="border-t border-gray-200 bg-gray-50/50 animate-in slide-in-from-top-2 duration-300">
                          <div className="space-y-6">
                            {/* Topics Checklist */}
                            <div>
                              <h4 className="font-semibold mb-4 text-gray-800 flex items-center gap-2">
                                <CheckSquare />
                                Learning Topics ({checkedTopics[stepKey]?.size || 0}/{step.topicNames.length})
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {step.topicNames.map((topic, topicIndex) => (
                                  <div
                                    key={topicIndex}
                                    className="flex items-center space-x-3 p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors border"
                                  >
                                    <Checkbox
                                      id={`${stepKey}-${topicIndex}`}
                                      checked={checkedTopics[stepKey]?.has(topic.id) || false}
                                      onCheckedChange={(checked) =>
                                        handleTopicCheck(stepKey, index, topic.id, checked)
                                      }
                                      className="accent-blue-500"
                                    />

                                    <label
                                      htmlFor={`${stepKey}-${topicIndex}`}
                                      className={`text-sm cursor-pointer flex-1 ${checkedTopics[stepKey]?.has(topic.id)
                                        ? "line-through text-gray-500"
                                        : "text-gray-700"
                                        }`}

                                    >
                                      {topic.name}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Resources */}
                            <div>
                              <h4 className="font-semibold mb-4 text-gray-800 flex items-center gap-2">
                                <BookMarked />
                                Learning Resources
                              </h4>
                              <div className="grid gap-3">
                                {step.resources.map((resource, resourceIndex) => (
                                  <div
                                    key={resourceIndex}
                                    className="flex items-center gap-4 p-4 bg-white rounded-xl hover:bg-blue-50 transition-colors group border"
                                  >
                                    <div className="p-2 bg-gray-200 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors">
                                      {getResourceIcon(resource.type)}
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-medium text-gray-800">{resource.name}</p>
                                      <p className="text-sm text-gray-600 capitalize">{resource.type}</p>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="text-gray-600 hover:text-gray-800"
                                      onClick={() => window.open(resource.link, "_blank")}
                                    >
                                      <ExternalLink />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Capstone Project */}
        <div
          id="capstone"
          data-animate
          className={`mb-16 transition-all duration-1000 delay-1000 ${visibleElements.has("capstone") ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
        >
          <Card className="relative overflow-hidden bg-gradient-to-r from-blue-50 to-sky-50 backdrop-blur-xl border-blue-200 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-sky-500/5 animate-pulse" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-3 text-2xl text-gray-800">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-sky-500 rounded-xl shadow-lg text-white">🏆</div>
                Capstone Project
                <Badge className="bg-blue-100 text-blue-700 border-blue-200">Final Challenge</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">{data.capstoneProject.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{data.capstoneProject.description}</p>
                </div>

                {/* Progress - Made thinner */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700">Project Progress</span>
                    <span className="text-sm text-gray-600">
                      {getStepProgress("capstone", data.capstoneProject.topicNames.length)}%
                    </span>
                  </div>
                  <div className="relative">
                    <Progress
                      value={getStepProgress("capstone", data.capstoneProject.topicNames.length)}
                      className="h-1 bg-blue-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-sky-500 rounded-full opacity-20 animate-pulse" />
                  </div>
                </div>

                {/* Topics Checklist */}
                <div>
                  <h4 className="font-semibold mb-4 text-gray-800 flex items-center gap-2">
                    <CheckSquare />
                    Project Milestones ({checkedTopics["capstone"]?.size || 0}/{data.capstoneProject.topicNames.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                    {data.capstoneProject.topicNames.map((topic, topicIndex) => (
                      <div
                        key={topicIndex}
                        className="flex items-center space-x-3 p-3 bg-white rounded-lg hover:bg-blue-50 transition-colors border"
                      >
                        <Checkbox
                          id={`capstone-${topicIndex}`}
                          checked={checkedTopics["capstone"]?.has(topic.id) || false}
                          onCheckedChange={(checked) =>
                            handleTopicCheck("capstone", null, topic.id, checked)
                          }
                          className="accent-blue-500"
                        />

                        <label
                          htmlFor={`capstone-${topicIndex}`}
                          className={`text-sm cursor-pointer flex-1 ${checkedTopics["capstone"]?.has(topic.id)
                            ? "line-through text-gray-500"
                            : "text-gray-700"
                            }`}

                        >
                          {topic.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 text-gray-800">Skills You'll Master</h4>
                    <div className="flex flex-wrap gap-2">
                      {data.capstoneProject.skillsUsed.map((skill, index) => (
                        <Badge
                          key={index}
                          className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 transition-colors"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 text-gray-800">Project Resources</h4>
                    <div className="space-y-2">
                      {data.capstoneProject.resources.map((resource, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-gray-600 border-gray-300 hover:border-blue-400 hover:text-gray-800"
                          onClick={() => window.open(resource.link, "_blank")}
                        >
                          <ExternalLink />
                          <span className="ml-2">{resource.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock />
                    <span>Estimated time: {data.capstoneProject.estimatedTime}</span>
                  </div>
                  <Button className="bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white shadow-lg">
                    Start Project →
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>

  )
}

export default PersonalizedRoadmap

import React, { useState, useEffect } from 'react';
import { Clock, Users, DollarSign, TrendingUp} from 'lucide-react';
import { ProgressBar } from './ProgressBar';
import { Badge } from '../Badge/Badge';
import Card from '../Card/Card';
import CardHeader from '../Card/CardHeader';
import CardTitle from '../Card/CardTitle';
import CardDescription from '../Card/CardDescription';
import CardContent from '../Card/CardContent';
import { Button } from '../Button/Button';
import { RoadmapPhase } from './RoadmapPhase';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const RoleDetailPage = () => {
  const [overallProgress, setOverallProgress] = useState(0);
  const {id} = useParams()
  const [role, setRole] = useState([])
  useEffect(() => {
    const fetchRoleDetails = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/staticRoles/details/${id}`)
        setRole(res.data)
      }
      catch (error) {
        console.log("Error in getting trending roles:", error);
      }

    };
    fetchRoleDetails()
  }, [])

   if (!role[0]) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-sky-100">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4 animate-pulse">Loading Details...</h2>
        <div className="w-64 h-2 bg-blue-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-300 animate-loading-bar rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Role Overview */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{role[0].name} Roadmap</h1>
          <p className="text-xl text-gray-600 mb-6 max-w-4xl">{role[0].overview}</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 text-center">
                <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{role[0].salary}</p>
                <p className="text-sm text-gray-600">Average Salary</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{role[0].growth}</p>
                <p className="text-sm text-gray-600">Job Growth</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{role[0].demand}</p>
                <p className="text-sm text-gray-600">Market Demand</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-900">{role[0].timeToLearn}</p>
                <p className="text-sm text-gray-600">Time to Master</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Roadmap */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Complete Learning Path</h2>
              <p className="text-gray-600 mb-6">
                Follow this comprehensive roadmap to become a {role[0].name}. Each phase includes topics to learn,
                resources to study, and projects to build. Check off items as you complete them to track your progress.
              </p>
            </div>

            {role[0].roadmap.map((phase) => (
              <RoadmapPhase key={phase.id} phase={phase} isCompleted={false} roadmapId={id}
                  onProgressUpdate={setOverallProgress} />
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Key Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Essential Skills</CardTitle>
                <CardDescription>Master these technologies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {role[0].skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="mb-1">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Companies */}
            <Card>
              <CardHeader>
                <CardTitle>Top Hiring Companies</CardTitle>
                <CardDescription>Where you could work</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {role[0].companies.map((company, index) => (
                    <div key={index} className="flex items-center gap-3 text-sm">
                      <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                        {company.charAt(0)}
                      </div>
                      <span className="font-medium">{company}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Progress Summary */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900">Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Overall Completion</span>
                      <span>{overallProgress}%</span>
                    </div>
                    <ProgressBar value={overallProgress} className="h-2"  />
                  </div>
                  <p className="text-sm text-blue-800">
                    Start checking off topics and projects to see your progress!
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* CTA */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6 text-center">
                <h4 className="font-semibold text-green-900 mb-2">Ready to Start?</h4>
                <p className="text-sm text-green-700 mb-4">
                  Get personalized guidance and track your progress
                </p>
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Start Learning Path
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleDetailPage;
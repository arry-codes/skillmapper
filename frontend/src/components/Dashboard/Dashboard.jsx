import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../Button/Button.jsx';
import { TrendingRoleCard } from './TrendingRoleCard';
import axios from 'axios'
import { JobRoleCard } from './JobRoleCard';
import { fetchUser } from '../../utils/getUser.js';
import { TypewriterText } from './TypewriterEffect.jsx';
import { useAuth } from '../../utils/AuthProvider.jsx';

// Main Landing Page Component
const Dashboard = () => {
  const navigate = useNavigate()
  const [trendingRoles, setTrendingRoles] = useState([]);
  const [otherRoles, setOtherRoles] = useState([]);
  const [user, setUser] = useState({});
  const { isProfileCompleted,isLoggedIn } = useAuth();
  const [loading,setLoading] = useState(true)

  const options = [
    {
      message: "Complete Your Profile",
      path: "/complete-profile"
    },
    {
      message:"See Personalised Roadmap",
      path:"/personalised-roadmap"
    }
  ]

  // Dynamic greeting messages based on the career platform theme
  const greetingMessages = [
    `Welcome back, ${user?.username || 'Future Tech Leader'}! 🚀`,
    `Ready to level up, ${user?.username || 'Career Builder'}? 💪`,
    `Your journey continues, ${user?.username || 'Innovator'}! ✨`,
    `Time to grow, ${user?.username || 'Tech Explorer'}! 🌟`,
    `Let's build your future, ${user?.username || 'Developer'}! 🔥`
  ];

  useEffect(() => {
    const fetchTrendingRoles = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/staticRoles/get-trending-roles`);
        setTrendingRoles(res.data);
      } catch (error) {
        console.log("Error in getting trending roles:", error);
      }
    };

    fetchTrendingRoles();
  }, []);

  useEffect(() => {
    const fetchOtherRoles = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/staticRoles/other-roles`);
        setOtherRoles(res.data);
      } catch (error) {
        console.log("Error in getting other roles:", error);
      }
    };
    fetchOtherRoles();
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const res = await fetchUser();
      setUser(res.data);
      setLoading(false)
    };
    fetchUserDetails();
  }, []);

    if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-sky-100">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4 animate-pulse">Loading Roadmaps...</h2>
        <div className="w-64 h-2 bg-blue-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-300 animate-loading-bar rounded-full"></div>
        </div>
      </div>
    );
  }

  const handleViewRoadmap = (roleId) => {
    console.log(`Navigate to roadmap for: ${roleId}`);
    navigate(`/dashboard/details/${roleId}`)
  };

  const handleLearnMore = (roleId) => {
    console.log(`Learn more about: ${roleId}`);
    navigate(`/dashboard/details/${roleId}`)
  };

  const handleCompleteProfile = () => {
    if(isProfileCompleted){
      navigate('/personalised-roadmap')
    }
    else if(!isLoggedIn){
      navigate('/login')
    }
    else if(isLoggedIn && !isProfileCompleted){
      navigate('/complete-profile')
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Hero Section */}
      <section className="pt-10 pb-6 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Journey to
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Success</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Discover personalized learning paths for the most in-demand tech careers. Start your journey today with
            expert-curated roadmaps.
          </p>
        </div>
      </section>

      {/* Enhanced Greeting Section with Typewriter Effect */}
      <div className="text-center my-12 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 shadow-lg border border-blue-100">
            <h2 className="font-bold text-2xl md:text-3xl text-gray-800 mb-2">
              <TypewriterText
                texts={greetingMessages}
                speed={80}
                deleteSpeed={40}
                pauseTime={3000} 
              />
            </h2>
            <p className="text-gray-600 text-lg">Ready to take the next step in your tech career?</p>
            <div className="flex justify-center mt-4">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.1s' }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                  style={{ animationDelay: '0.2s' }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Roles Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4"> Trending Career Paths</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The most sought-after roles in tech right now. High demand, great salaries, and exciting opportunities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingRoles.map((role, index) => (
              <TrendingRoleCard
                key={role.id}
                role={role}
                onViewRoadmap={handleViewRoadmap}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Other Job Roles Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Other Career Paths</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore more career opportunities across different domains and find your perfect match.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherRoles.map((role, index) => (
              <JobRoleCard
                key={role.id}
                role={role}
                onLearnMore={handleLearnMore}
              />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Want a Personalized Roadmap?
          </h3>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Get a customized learning path based on your skills, interests, and career goals. Take our assessment to
            unlock your personalized journey.
          </p>
          <Button
            size="lg"
            variant="outline"
            className="border-gray-400 text-gray-300 hover:bg-gray-800 hover:text-white"
            onClick={handleCompleteProfile}
          >
            {!isProfileCompleted ? options[0].message :
              options[1].message}
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
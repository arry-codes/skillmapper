import { useState, useEffect } from "react"
import { ChevronRight, Map, User, MessageCircle, Zap, Target, ArrowRight, Sparkles, Play, Rocket, Compass } from 'lucide-react'
import { useNavigate } from "react-router-dom"

export default function Home() {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

const features = [
  {
    icon: Map,
    title: "Explore Roadmaps",
    description: "Discover curated learning paths for various technologies and skills",
    path: "/dashboard",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    hoverColor: "hover:bg-blue-500/20",
    delay: "delay-75",
  },
  {
    icon: User,
    title: "Get Personalized Roadmaps",
    description: "AI-powered roadmaps tailored to your goals and experience level",
    path: "/personalised-roadmap",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    hoverColor: "hover:bg-purple-500/20",
    delay: "delay-100",
  },
  {
    icon: MessageCircle,
    title: "Chat with AI",
    description: "Get instant answers to your doubts and learning questions",
    path: "/ai-chat", 
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    hoverColor: "hover:bg-green-500/20",
    delay: "delay-150",
  },
];


  return (
    <div className="min-h-screen bg-gradient-to-tr from-slate-900 via-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse">``</div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-400/10 rounded-full blur-3xl animate-pulse delay-1000">``</div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-spin-slow"></div>
        </div>
        <div className="relative container mx-auto px-8 py-24">
          <div className="text-center max-w-4xl mx-auto">
            {/* Main Heading with Animation */}
            <div
              className={`transform transition-all duration-1000 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            >
              <div className="inline-flex items-center gap-2 text-blue-400 font-semibold text-sm mb-6 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-green-400" />
                Welcome to SkillMap
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight">
                Bridge the Gap Between <span className="text-blue-500">Where You Are</span> and{" "}
                <span className="text-green-400">Where You Want to Be</span>
              </h1>
              <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
                SkillMap helps you build personalized roadmaps based on your current skills and your dream role. Start
                your journey today with AI-powered guidance.
              </p>
            </div>

            {/* CTA Buttons */}
            <div
              className={`flex flex-col sm:flex-row gap-4 justify-center items-center transform transition-all duration-1000 delay-300 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}
            >
              <button className="group bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2"
                  onClick={()=> navigate('/dashboard')}>
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="group border border-gray-500 hover:border-gray-300 text-gray-300 hover:text-white px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2">
                <Play className="w-5 h-5" />
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-white mb-6">
              Everything You Need to <span className="text-blue-500">Succeed</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Powerful features designed to accelerate your learning and help you achieve your goals faster
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto perspective-1000">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  onClick={() => navigate(feature.path)}
                  className={`group relative bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-200 ${feature.delay} border border-gray-700 hover:border-gray-600 ${activeFeature === index ? "ring-2 ring-blue-500/50" : ""} cursor-pointer ${feature.hoverColor}`}
                  onMouseEnter={() => setActiveFeature(index)}
                  style={{
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* Icon */}
                  <div className="mb-4">
                    <Icon
                      className={`w-8 h-8 ${feature.color} group-hover:scale-110 transition-transform duration-200`}
                    />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors duration-200">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">{feature.description}</p>

                  {/* Learn More Link */}
                  <div className="flex items-center text-blue-400 font-semibold group-hover:text-green-400 transition-colors duration-200">
                    Learn More
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-800/50 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.02'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] animate-pulse"></div>
        </div>

        <div className="container mx-auto px-8 relative">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-extrabold text-white mb-6">Why Choose SkillMap?</h2>
            <p className="text-xl text-gray-300 mb-12">
              Join the revolution in personalized learning and unlock your full potential
            </p>

            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:bg-gray-700/80 hover:border-gray-600 transition-all duration-200 cursor-pointer">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Skill Assessment</h3>
                <p className="text-gray-400">Analyze your current skill set to determine where you stand</p>
              </div>

              <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:bg-gray-700/80 hover:border-gray-600 transition-all duration-200 cursor-pointer">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Compass className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Smart Roadmaps</h3>
                <p className="text-gray-400">Generate dynamic roadmaps tailored to your strengths and goals</p>
              </div>

              <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:bg-gray-700/80 hover:border-gray-600 transition-all duration-200 cursor-pointer">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Rocket className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">Career Launchpad</h3>
                <p className="text-gray-400">Follow your roadmap and achieve your target role confidently</p>
              </div>

              <div className="bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700 hover:bg-gray-700/80 hover:border-gray-600 transition-all duration-200 cursor-pointer">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">AI-Powered Guidance</h3>
                <p className="text-gray-400">Get instant support and answers to accelerate your learning</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-green-400/20 text-green-400 px-6 py-3 rounded-full text-sm font-semibold mb-8 border border-green-400/30">
              <Zap className="w-4 h-4" />
              Start Your Journey Today
            </div>
            <h2 className="text-4xl font-extrabold text-white mb-6">
              Ready to Transform Your <span className="text-blue-500">Career Path?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-10">
              Take the first step towards mastering new skills with our intelligent learning platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="group bg-blue-500 hover:bg-blue-600 text-white px-10 py-4 rounded-lg font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center gap-2">
                <Target className="w-5 h-5" />
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-gray-400 text-sm">No credit card required • Free forever</p>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Chat Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="group bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 relative">
          <MessageCircle className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <div className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
        </button>
      </div>
    </div>)
};
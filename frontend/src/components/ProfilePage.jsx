import { useEffect, useRef, useState } from 'react';
import axios from 'axios';

// Avatar, Badge, ProgressBar, Icons – Keep as is from your original code

const ProfilePage = () => {
  const [animatedSections, setAnimatedSections] = useState(new Set());
  const [progressAnimations, setProgressAnimations] = useState(new Set());
  const observerRef = useRef(null);
  const progressObserverRef = useRef(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const { data: profile } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/get-profile`, {
          headers: { authToken: token },
        });
        console.log("Fetched Profile:", profile);
        setUser(profile);
      } catch (err) {
        console.error("Profile fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  // Intersection Observers
  useEffect(() => {
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setAnimatedSections((prev) => new Set([...prev, entry.target.dataset.section]));
        }
      });
    }, { threshold: 0.15 });

    progressObserverRef.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setProgressAnimations((prev) => new Set([...prev, entry.target.dataset.progress]));
          }, 300);
        }
      });
    }, { threshold: 0.6 });

    const sections = document.querySelectorAll('[data-section]');
    const bars = document.querySelectorAll('[data-progress]');

    sections.forEach((s) => observerRef.current?.observe(s));
    bars.forEach((b) => progressObserverRef.current?.observe(b));

    // Fallback for animation in case observer doesn't trigger
    const fallbackTimeout = setTimeout(() => {
      setAnimatedSections(new Set(['header', 'bio', 'skills', 'goal', 'social', 'stats']));
      setProgressAnimations(new Set(['profile', 'goal']));
    }, 10); 

    return () => {
      observerRef.current?.disconnect();
      progressObserverRef.current?.disconnect();
      clearTimeout(fallbackTimeout);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-sky-100">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4 animate-pulse">Loading Profile...</h2>
        <div className="w-64 h-2 bg-blue-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-300 animate-loading-bar rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-xl font-semibold">
        Failed to load profile data. Please try again.
      </div>
    );
  }

  const userData = {
    username: user?.username || '',
    email: user?.email || '',
    designation: user?.designation || '',
    bio: user?.bio || '',
    skills: user?.skills || [],
    goal: user?.goal || '',
    avatar: user?.avatar || '',
    isProfileCompleted: user?.isProfileCompleted || false,
    githubUrl:user?.githubUrl || '',
    followers:user?.followers || '0',
    projects:user?.projects || '0'
  };

  const goalDisplayNames = {
    frontend: 'Frontend Development',
    backend: 'Backend Development',
    fullstack: 'Full Stack Development',
    devops: 'DevOps Engineering',
    dsa: 'Data Structures & Algorithms',
    ml: 'Machine Learning',
    data_engineering: 'Data Engineering',
    ai: 'Artificial Intelligence',
    cloud: 'Cloud Computing',
    open_source: 'Open Source Contribution',
    internship: 'Internship Preparation',
    system_design: 'System Design',
    blockchain: 'Blockchain Development',
    android: 'Android Development',
    ios: 'iOS Development',
    web3: 'Web3 Development',
    cybersecurity: 'Cybersecurity',
    product_based: 'Product Based Companies',
    startup_preparation: 'Startup Preparation',
    freelancing: 'Freelancing',
  };

  const skillColors = [
    'from-blue-500 to-blue-600',
    'from-green-500 to-green-600',
    'from-purple-500 to-purple-600',
    'from-orange-500 to-orange-600',
    'from-red-500 to-red-600',
    'from-cyan-500 to-cyan-600',
    'from-indigo-500 to-indigo-600',
    'from-yellow-500 to-yellow-600',
    'from-pink-500 to-pink-600',
    'from-teal-500 to-teal-600',
  ];

  const calculateProfileCompletion = () => {
    let completed = 0;
    const total = 7;
    if (userData.username) completed++;
    if (userData.email) completed++;
    if (userData.bio) completed++;
    if (userData.designation) completed++;
    if (userData.skills?.length) completed++;
    if (userData.goal) completed++;
    if (userData.avatar) completed++;
    return Math.round((completed / total) * 100);
  };

  const profileCompletion = calculateProfileCompletion();

  /* --------------------------- SMALL COMPONENTS --------------------------- */
  const ProgressBar = ({ value, className = '', ...rest }) => (
    <div className={`w-full bg-gray-200 rounded-full h-2.5 ${className}`} {...rest}>
      <div
        className="bg-gradient-to-r from-blue-500 to-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${value}%` }}
      />
    </div>
  );

  const Badge = ({ children, className = '' }) => (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${className}`}>{children}</span>
  );

  const Avatar = ({ src, alt }) => (
    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl bg-gradient-to-br from-blue-400 to-blue-700">
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white text-4xl">
          <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </div>
      )}
    </div>
  );

  /* ICONS */


  // Social Media Icons
  const GithubIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );

  const LinkedinIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );

  const TwitterIcon = () => (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
    </svg>
  );

  const MailIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );

  const TargetIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  );

  const CodeIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  );

  const UserIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const LinkIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
    </svg>
  );

  const ChartIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );

  const TrophyIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  );

  const FolderIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  );

  const AwardIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  );

  const UsersIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  );
  /* Main Component */
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-slate-100 font-sans">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* HEADER*/}
        <div
          data-section="header"
          className={`mb-8 bg-white rounded-lg shadow-lg overflow-hidden border border-blue-100 transition-all duration-700 ${animatedSections.has('header') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
          <div className="relative">
            <div className="h-40 bg-gradient-to-r from-blue-500 via-blue-500 to-blue-600 relative overflow-hidden">
              {/* darker overlay */}
              <div className="absolute inset-0 bg-black opacity-20" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-y-2" />
            </div>

            <div className="relative p-8">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between">
                <div className="flex flex-col lg:flex-row lg:items-end">
                  <div className="relative -mt-16 mb-4 lg:mb-0 lg:mr-6">
                    <Avatar src={userData.avatar} alt={userData.username} />
                  </div>

                  <div className="lg:mb-4">
                    <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-2 capitalize">
                      {userData.username}
                    </h1>
                    <p className="text-xl text-slate-600 mb-2">{userData.designation}</p>
                    <p className="text-slate-500 flex items-center text-sm">
                      <MailIcon />
                      <span className="ml-2 break-all">{userData.email}</span>
                    </p>
                  </div>
                </div>

                {/* Profile completion */}
                <div className="mt-4 lg:mt-0">
                  <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 w-56">
                    <div className="flex items-center justify-between mb-2 text-sm font-medium text-slate-600">
                      <span>Profile Complete</span>
                      <span className="font-bold text-blue-600">{profileCompletion}%</span>
                    </div>
                    <ProgressBar value={progressAnimations.has('profile') ? profileCompletion : 0} data-progress="profile" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/*MAIN GRID*/}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN  */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio */}
            <div
              data-section="bio"
              className={`bg-white rounded-lg shadow-lg p-6 border border-slate-100 transition-all duration-700 ${animatedSections.has('bio') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center">
                <UserIcon />
                <span className="ml-3 text-blue-500">About Me</span>
              </h2>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{userData.bio}</p>
            </div>

            {/* Skills */}
            <div
              data-section="skills"
              className={`bg-white rounded-lg shadow-lg p-6 border border-slate-100 transition-all duration-700 ${animatedSections.has('skills') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                <CodeIcon />
                <span className="ml-3 text-blue-500">Technical Skills</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {userData.skills.map((skill, idx) => (
                  <Badge
                    key={skill}
                    className={`bg-gradient-to-r ${skillColors[idx % skillColors.length]} text-white px-4 py-2 shadow-md hover:shadow-lg transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 cursor-pointer`}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Goal */}
            <div
              data-section="goal"
              className={`bg-white rounded-lg shadow-lg p-6 border border-slate-100 transition-all duration-700 ${animatedSections.has('goal') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
            >
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                <TargetIcon />
                <span className="ml-3 text-blue-500">Current Learning Goal</span>
              </h2>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 capitalize">
                      {goalDisplayNames[userData.goal] || userData.goal}
                    </h3>
                    <p className="text-slate-600 mt-1">Mastering modern development practices</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-blue-600">75%</div>
                    <div className="text-sm text-slate-500">Progress</div>
                  </div>
                </div>
                <ProgressBar value={progressAnimations.has('goal') ? 75 : 0} data-progress="goal" className="mb-4" />
                <div className="flex justify-between text-xs text-slate-500 font-mono">
                  <span>Started: Jan 2024</span>
                  <span>Target: Dec 2024</span>
                </div>
              </div>
            </div>
          </div>

          {/*RIGHT COLUMN */}
          <div className="space-y-8">
            {/* Social card placeholder */}
            <div
              data-section="social"
              className={`bg-white rounded-lg shadow-lg p-6 border border-slate-100 transition-all duration-600 delay-100 ${animatedSections.has('social')
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
                }`}
            >
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                <LinkIcon />
                <span className="ml-3 text-blue-500">Connect With Me</span>
              </h3>

              <div className="space-y-3">
                <a
                  href={userData.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200 group"
                >
                  <GithubIcon />
                  <div className="ml-3">
                    <div className="font-medium text-gray-800">{userData.username}</div>
                    <div className="text-sm text-gray-600">GitHub Profile</div>
                  </div>
                </a>

                <a
                  href={`https://linkedin.com/in/${userData.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors duration-200 group"
                >
                  <LinkedinIcon />
                  <div className="ml-3">
                    <div className="font-medium text-blue-800">{userData.username}</div>
                    <div className="text-sm text-blue-600">LinkedIn Profile</div>
                  </div>
                </a>

                <a
                  href={`https://twitter.com/${userData.username}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 rounded-lg bg-sky-50 hover:bg-sky-100 transition-colors duration-200 group"
                >
                  <TwitterIcon />
                  <div className="ml-3">
                    <div className="font-medium text-sky-800">@{userData.username}</div>
                    <div className="text-sm text-sky-600">Twitter Profile</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Quick Stats */}
            <div
              data-section="stats"
              className={`bg-white rounded-lg shadow-lg p-6 border border-slate-100 transition-all duration-600 delay-200 ${animatedSections.has('stats')
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
                }`}
            >
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                <ChartIcon />
                <span className="ml-3 text-blue-500">Quick Stats</span>
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center">
                    <TrophyIcon />
                    <span className="ml-3 text-slate-700">Followers</span>
                  </div>
                  <span className="font-bold text-slate-800">{userData.followers}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <FolderIcon />
                    <span className="ml-3 text-slate-700">Projects</span>
                  </div>
                  <span className="font-bold text-slate-800">{userData.projects}</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center">
                    <AwardIcon />
                    <span className="ml-3 text-slate-700">Certificates</span>
                  </div>
                  <span className="font-bold text-slate-800">5</span>
                </div>

                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center">
                    <UsersIcon />
                    <span className="ml-3 text-slate-700">Connections</span>
                  </div>
                  <span className="font-bold text-slate-800">127</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
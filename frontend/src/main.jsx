import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './components/Home.jsx'
import LoginForm from './components/LoginForm.jsx'
import Signup from './components/SignUpForm.jsx'
import { AuthProvider } from './utils/AuthProvider.jsx'
import PrivateRoute from './utils/PrivateRoute.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import RoleDetailPage from './components/RoleDetailsPage/RoleDetailPage.jsx'
import PersonalizedRoamap from './components/PersonalisedRoadmap/PersonalizedRoadmap.jsx'
import CompleteProfileForm from './components/CompleteProfileForm.jsx'
import ProfileAndLoginValidation from './utils/ProfileAndLoginValidation.jsx'
import ProfilePage from './components/ProfilePage.jsx'
import AIChat from './components/AIChat.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />}>
      <Route path='' element={<Home />} />
      <Route path='login' element={<LoginForm />} />
      <Route path='signup' element={<Signup />} />
      <Route path = 'profile' element = {<ProfilePage/>}/>
      <Route path = 'ai-chat' element = {<AIChat/>}/>

      {/* Public dashboard route */}
      <Route path='dashboard' element={<Dashboard />} />

      {/* Protected details route */}
      <Route element={<PrivateRoute />}>
        <Route path='dashboard/details/:id' element={<RoleDetailPage />} />
        <Route path='complete-profile' element={<CompleteProfileForm />} />
      </Route>
      <Route element={<ProfileAndLoginValidation />}>
        <Route path='personalised-roadmap' element={<PersonalizedRoamap/>}></Route>
      </Route>
    </Route>
  )
);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
)

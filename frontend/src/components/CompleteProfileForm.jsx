import React from "react"
import { useForm, Controller } from "react-hook-form"
import { Link } from "react-router-dom"
import { ToastContainer, toast, Bounce } from "react-toastify"
import Select from "react-select"
import roleData from "../data/roles.json"
import designationData from "../data/designation.json"
import axios from "axios"
import { useAuth } from "../utils/AuthProvider"
import { useNavigate,useLocation } from "react-router-dom"

const CompleteProfileForm = () => {
  const [loading, setLoading] = React.useState(false)
  const [avatarPreview, setAvatarPreview] = React.useState(null)
  const {isProfileCompleted,setIsProfileCompleted} = useAuth()
  const location = useLocation();
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm()

  const selectedRole = watch("Role")
  const skillOptions = selectedRole ? roleData[selectedRole].map((skill) => ({ value: skill, label: skill })) : []

  const designationOptions = designationData["designations"]

  // Handle avatar file change
  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (data) => {
    setLoading(true)

    const token = localStorage.getItem("authToken")
    const formData = new FormData()
    formData.append("targetRole", data.Role)
    formData.append("timeCanGive", data.time)
    formData.append("designation", data.Designation)
    formData.append("bio", data.bio)
    formData.append("githubUsername",data.githubUsername)

    const skills = data.Skill.map((skill) => skill.value)
    formData.append("skillSet", JSON.stringify(skills))

    if (data.avatar && data.avatar[0]) {
      formData.append("avatar", data.avatar[0])
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/complete-profile`, formData, {
        headers: {
          authToken: token,
          "Content-Type": "multipart/form-data",
        },
      })

      const { message } = res.data
      setIsProfileCompleted(true)
      const from = location.state?.from?.pathname || "/";
      toast.success(message,{
        onClose: () => navigate(from, { replace: true }),
      })

    } catch (error) {
      toast.error("Something went wrong")
      console.log(error.message)
    } finally {
      setLoading(false)
    }
  }

  const selectStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "#1f2937",
      borderColor: "#374151",
      minHeight: "42px",
      boxShadow: "none",
      "&:hover": { borderColor: "#3b82f6" },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#1f2937",
      zIndex: 50,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? "#3b82f6" : state.isFocused ? "#374151" : "#1f2937",
      color: "white",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#3b82f6",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "white",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "white",
      "&:hover": { backgroundColor: "#2563eb" },
    }),
    input: (base) => ({ ...base, color: "white" }),
    placeholder: (base) => ({ ...base, color: "#9ca3af" }),
    singleValue: (base) => ({ ...base, color: "white" }),
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 justify-center via-gray-900 to-slate-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-4xl font-bold text-white mb-2">Complete Your Profile</h1>
          <p className="text-gray-300">Let's set up your professional profile</p>
        </div>

        {/* Main Form Container */}
        <div className="bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700/50 max-w-4xl overflow-hidden py-5">
          <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            {/* Avatar Section */}
<div className="flex items-center justify-center">
  <div className="flex flex-col items-center gap-3">
    <label htmlFor="avatar" className="cursor-pointer group">
      <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center border-4 border-gray-600 group-hover:border-blue-500 transition-all duration-300 overflow-hidden shadow-md">
        {avatarPreview ? (
          <img
            src={avatarPreview || "/placeholder.svg"}
            alt="Avatar preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <svg
            className="w-8 h-8 text-gray-400 group-hover:text-blue-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        )}
      </div>
    </label>

    {/* Upload Button */}
    <label htmlFor="avatar">
      <span className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-1.5 rounded-lg shadow-sm transition duration-200">
        {avatarPreview ? "Change Photo" : "Upload Photo"}
      </span>
    </label>

    {/* Remove Button */}
    {avatarPreview && (
      <button
        type="button"
        onClick={() => setAvatarPreview(null)}
        className="text-red-400 text-sm hover:underline"
      >
        Remove Photo
      </button>
    )}

    <input
      type="file"
      accept="image/*"
      id="avatar"
      {...register("avatar", {
        onChange: handleAvatarChange,
      })}
      className="hidden"
    />
  </div>
</div>


            {/* Form Fields */}
            <div className="p-6 space-y-6">
              {/* Row 1: Role and Designation */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Target Role</label>
                  <select
                    {...register("Role", { required: "Role is required" })}
                    className="w-full h-11 px-4 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors"
                  >
                    <option value="">Select a role</option>
                    {Object.keys(roleData).map((role, idx) => (
                      <option key={idx} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  {errors.Role && <p className="text-red-400 text-sm mt-1">{errors.Role.message}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Current Designation</label>
                  <select
                    {...register("Designation", { required: "Designation is required" })}
                    className="w-full h-11 px-4 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors"
                  >
                    <option value="">Select designation</option>
                    {designationOptions.map((role, idx) => (
                      <option key={idx} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  {errors.Designation && <p className="text-red-400 text-sm mt-1">{errors.Designation.message}</p>}
                </div>
              </div>

              {/* Row 2: Skills and Time */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Current Skills</label>
                  <Controller
                    name="Skill"
                    control={control}
                    rules={{ required: "Please select at least one skill" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        isMulti
                        options={skillOptions}
                        styles={selectStyles}
                        placeholder="Select skills"
                        isDisabled={!selectedRole}
                      />
                    )}
                  />
                  {errors.Skill && <p className="text-red-400 text-sm mt-1">{errors.Skill.message}</p>}
                  {!selectedRole && <p className="text-amber-400 text-xs mt-1">Select a role first</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Daily Hours</label>
                  <input
                    type="number"
                    {...register("time", {
                      required: { value: true, message: "Time is required" },
                      min: { value: 1, message: "Min 1 hr required" },
                      max: { value: 18, message: "Max 18 hrs allowed" },
                    })}
                    className="w-full h-11 px-4 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors"
                    placeholder="Hours"
                  />
                  {errors.time && <p className="text-red-400 text-sm mt-1">{errors.time.message}</p>}
                </div>
              </div>

              {/* Row 3: Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
                <textarea
                  rows="3"
                  {...register("bio")}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors resize-none"
                  placeholder="Tell us about yourself..."
                />
                {errors.bio && <p className="text-red-400 text-sm mt-1">{errors.bio.message}</p>}
              </div>
              <label htmlFor="githubUsername" className="block text-sm mb-1 text-white">Github Username</label>
              <input
              type="text"
              id="githubUsername"
              {...register("githubUsername",
                {
                  required: "githubusername is required",
                  minLength: {
                    value: 2,
                    message: "Enter valid username"
                  }

                })}
              className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            </div>

            {/* Submit Section */}
            <div className="bg-gray-700/30 px-6 py-4 border-t border-gray-700/50">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

                <button
                  type="submit"
                  disabled={loading}
                  className={`px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-200 ${
                    loading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg hover:shadow-blue-500/25"
                  } text-white`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Complete Profile
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
      />
    </div>
  )
}

export default CompleteProfileForm

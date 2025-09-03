import mongoose from "mongoose";

const allowedSkills = [
  'JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'Express.js',
  'MongoDB', 'HTML', 'CSS', 'Git', 'SQL', 'Machine Learning', 'Docker',
  'Data Structures', 'Algorithms', 'System Design', 'Operating Systems',
  'Firebase', 'AWS', 'Linux'
];
const allowedGoals = [
  'frontend','backend','fullstack',
  'devops','dsa','ml','data_engineering','ai',
  'cloud','open_source','internship','system_design','blockchain','android',
  'ios','web3','cybersecurity','product_based','startup_preparation','freelancing',''
];

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        lowercase:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    skills: {
    type: [String],
    enum: allowedSkills,
    default:[]
  },
    goal:{
        type:String,
        enum:allowedGoals,
        default:''
    },
    designation:{
        type:String,
        default:""
    },
    currentStreak:{
      type:Number,
      default:0,
    },
    bio:{
      type:String,
      default:""
    },
    avatar:{
      type:String,
      default:""
    },
    isProfileCompleted:{
      type:Boolean,
      default:false
    },
    time:{
      type:String,
      default:""
    },
    githubUsername:{
      type:String,
      default:""
    },
    linkedinUsername:{
      type:String,
      default:""
    },
    twitterLink:{
      type:String,
      default:""
    },
    isProfileEdited:{
      type:Boolean,
      default:false
    }
},{timestamps:true})

export const User = mongoose.model('User',userSchema);
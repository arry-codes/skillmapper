import mongoose, { Schema } from "mongoose";
import { User } from "./user.model.js";

const TopicSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    id:{
        type:Number,
        required:true,
    },
    completed:{
        type:Boolean,
        default:false
    }
},{ _id: false })

const ResourceSchema = new mongoose.Schema({
    name:{
        type:String,
    },
    type:{
        type:String,
        default:""
    },
    link:{
        type:String,
        default:""
    }
},{ _id: false })

const capstoneProjectSchema = new mongoose.Schema({
    title:{
        type:String,
    },
    description:{
        type:String,
        default:""
    },
    skillsUsed:[{
        type:String
    }],
    estimatedTime:{
        type:String,
        default:"",
    },
    completed:{
        type:Boolean,
        default:false,
    },
    progress:{
        type:Number,
        default:0,
    },
    topicNames:[TopicSchema],
    resources:[ResourceSchema],
},{ _id: false })

const PhaseSchema = new mongoose.Schema({
    title:{
        type:String,
    },
    requiredSkills:{
        type:[String],
        default:[]
    },
    description:{
        type:String,
        default:""
    },
    topicNames:[TopicSchema],
    resources:[ResourceSchema],
    estimatedTime:{
        type:String,
        default:"",
    },
    completed:{
        type:Boolean,
        default:false,
    },
    progress:{
        type:Number,
        default:0,
    },
    difficulty:{
        type:String,
        default:"Beginner"
    }
},{ _id: false })

const PersonalizedRoadmapSchema = new mongoose.Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    role:{
        type:String,
    },
    currentSkills:{
        type:[String],
        default:[]
    },
    salary:{
        type:String,
        default:""
    },
    description:{
        type:String,
        default:"",
    },
    growth:{
        type:String,
        default:""
    },
    title:{
        type:String,
        default:""
    },
    personalisedSteps:[PhaseSchema],
    capstoneProject:capstoneProjectSchema
})

export const PersonalizedRoadmap = new mongoose.model('PersonalizedRoadmap',PersonalizedRoadmapSchema);
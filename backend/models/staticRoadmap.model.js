import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
    id:Number,
    title:String,
    description:String,
    difficulty:String,
    duration:String,
    skills:[String]
},{ _id: false })

const ResourceSchema = new mongoose.Schema({
    type:String,
    title:String,
    provider:String,
    url:String,
    icon:String,
},{ _id: false })

const PhaseSchema = new mongoose.Schema({
    id:Number,
    phase:String,
    title:String,
    duration:String,
    difficulty:String,
    description:String,
    topics:[{
        id:Number,
        name:String
    }],
    resources:[ResourceSchema],
    projects:[ProjectSchema]
},{ _id: false })

const staticRoadmapSchema = new mongoose.Schema({
    roadmapId:{
        type:Number,
        unique:true,
        required:true
    },
    name:String,
    description:String,
    salary:String,
    demand:String,
    growth:String,
    timeToLearn:String,
    overview:String,
    roadmap:[PhaseSchema],
    skills:[String],
    companies:[String]
})

export const StaticRoadmap = new mongoose.model('StaticRoadmap',staticRoadmapSchema)
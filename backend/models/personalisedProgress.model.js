import mongoose, { Schema } from "mongoose";

const personalizedProgressSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  completedTopics: [
    {
      phaseId: Number,     
      topicId: Number        
    }
  ],
  completedCapstoneTopics: [
    {
      topicId: Number
    }
  ],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export const PersonalizedProgress = mongoose.model(
  "PersonalizedProgress",
  personalizedProgressSchema
);

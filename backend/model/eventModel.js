import mongoose from "mongoose";

const { Schema } = mongoose;

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
  },
  notifMessage: {
    type: String,
  },
  notifTime: {
    type: Date,
  },
  tags: {
    type: [Schema.Types.ObjectId],
    ref: "Tag",
    default: [],
  },
  imageUrl: {
    type: String,
  },
  attachmentUrls: {
    type: [String],
    default: [],
  },

  // organizer who created this event
  organizer: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },

  // volunteers who applied
  applicants: {
    type: [Schema.Types.ObjectId],
    ref: "Users",
    default: [],
  },

  // volunteers who were accepted
  participants: {
    type: [Schema.Types.ObjectId],
    ref: "Users",
    default: [],
  },
});

export default mongoose.model("Events", eventSchema);

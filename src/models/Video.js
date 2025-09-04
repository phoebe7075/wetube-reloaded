import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: {type:String, required: true, trim: true, maxLength: 60},
    fileUrl: {type:String, required: true},
    thumbUrl: {type:String, required: true},
    description: {type:String, default: "", trim: true, maxLength: 500},
    createdAt: {type:Date, required: true, default: Date.now()},
    hashtags: [{type:String}],
    meta: {
        views: {type:Number, default: 0},
        rating: {type:Number, default: 0},
    },
    comments: [{type:mongoose.Schema.Types.ObjectId, ref:"Comment"}],
    owner: {type:mongoose.Schema.Types.ObjectId, required:true, ref:"User"},
});

videoSchema.static('formatHashtags', function(hashtags) {
    return hashtags.split(",").map(tag => tag.trim())
        .filter(tag => tag !== "")
        .map(tag => tag.startsWith("#") ? tag : `#${tag}`);
});

const videoModel = mongoose.model("Video", videoSchema);

export default videoModel;
import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: {type:String, required: true, trim: true, maxLength: 60},
    description: {type:String, default: "", trim: true, maxLength: 500},
    createdAt: {type:Date, required: true, default: Date.now()},
    hashtags: [{type:String}],
    meta: {
        views: {type:Number, default: 0},
        rating: {type:Number, default: 0},
    },
});


const videoModel = mongoose.model("Video", videoSchema);

export default videoModel;
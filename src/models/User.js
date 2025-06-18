import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    email: {type:String, required:true, unique:true},
    socialOnly: {type: Boolean, default:false},
    username: {type: String, required:true, unique: true},
    password: {type: String, required:false, unique: true},
    name: {type: String, required:true},
    location: String,
    avatarUrl: String,
    videos: [{type:mongoose.Schema.Types.ObjectId, ref:"Video"}],
})

userSchema.pre('save', async function() {
    this.password = await bcrypt.hash(this.password, 5);
})

const User = mongoose.model('User', userSchema);

export default User;
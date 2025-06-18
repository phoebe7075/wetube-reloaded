import Video from "../models/Video";
import User from "../models/User";

export const home = async (req, res) => {
    try {
        const videos = await Video.find({}).sort({createdAt:"desc"}); //db에서 결과를 받을때까지 대기
        return res.render("home", {pageTitle : "Home", videos});
    } catch {
        return res.render("server-error");
    }
    
 }
export const watch = async (req, res) => {
    const { id } = req.params;
    
    const videoItem = await Video.findById(id).populate("owner");
    //const owner = videoItem.owner;
    if(!videoItem) {
        return res.status(404).render("404", {pageTitle : "Video not found"});
    }
    return res.render("watch", {pageTitle : videoItem.title, video: videoItem});
    
};
export const getEdit = async (req, res) => {
    const { id } = req.params;
    const { user: {_id} } = req.session;
    const videoItem = await Video.findById(id);
    if(!videoItem) {
        return res.status(404).render("404", {pageTitle : "Video not found"});
    }
    if(String(videoItem.owner) !== String(_id)) {
        return res.status(403).redirect("/");
    }
    return res.render("edit", {pageTitle : `Edit : ${videoItem.title}`, video: videoItem});
    
};

export const postEdit = async (req, res) => {
    const { id } = req.params;
    const { user: {_id} } = req.session;
    const { title, description, hashtags } = req.body
    const videoItem = await Video.exists({_id:id});
    if(!videoItem) {
        return res.status(404).render("404", {pageTitle : "Video not found"});
    }
    if(String(videoItem.owner) !== String(_id)) {
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndUpdate(id, {
        title,
        description,
        hashtags: Video.formatHashtags(hashtags),
    });

    return res.redirect(`/videos/${id}`);
}

export const getUpload= (req, res) => {
    return res.render("upload", {pageTitle: "Upload Video"})
}

export const postUpload = async (req, res) => {
    const {user: {_id},} = req.session;
    const file = req.file;
    const { title, description, hashtags } = req.body

    try {
        const newVideo = await Video.create({
            title,
            description,
            fileUrl: file.path,
            owner:_id,
            hashtags: Video.formatHashtags(hashtags),
        });

        const user = await User.findById(_id);
        user.videos.push(newVideo._id);
        user.save();
        req.session.user = user;
        return res.redirect("/")
    } catch(err) {
        return res.status(400).render("upload", {
            pageTitle: "Upload Video",
            errorMessage: err._message,
        });
    }
}

export const deleteVideo = async (req, res) => {
    const { id } = req.params
    const { user: {_id} } = req.session;
    const videoItem = await Video.findById(id);
    if(!videoItem) {
        return res.status(404).render("404", {pageTitle : "Video not found"});
    }
    if(String(videoItem.owner) !== String(_id)) {
        return res.status(403).redirect("/");
    }
    await Video.findByIdAndDelete(id);
    return res.redirect("/");
}

export const search = async (req, res) => {
    const {keyword} = req.query;
    let videos = [];
    if(keyword) {
        videos = await Video.find({
            title: {
                $regex: new RegExp(keyword, "i")
            },
        })
    }
    
    return res.render("search", {pageTitle:"Search", videos});
}
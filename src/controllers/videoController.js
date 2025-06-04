import Video from "../models/Video";


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
    
    const videoItem = await Video.findById(id);
    if(!videoItem) {
        return res.render("404", {pageTitle : "Video not found"});
    }
    return res.render("watch", {pageTitle : videoItem.title, video: videoItem});
    
};
export const getEdit = async (req, res) => {
    const { id } = req.params;
    
    const videoItem = await Video.findById(id);
    if(!videoItem) {
        return res.render("404", {pageTitle : "Video not found"});
    }
    return res.render("edit", {pageTitle : `Edit : ${videoItem.title}`, video: videoItem});
    
};

export const postEdit = async (req, res) => {
    const { id } = req.params;
    const { title, description, hashtags } = req.body
    const videoItem = await Video.exists({_id:id});
    if(!videoItem) {
        return res.render("404", {pageTitle : "Video not found"});
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
    // here we will add a video to the videos array.
    const { title, description, hashtags } = req.body

    try {
        await Video.create({
            title,
            description,
            hashtags: Video.formatHashtags(hashtags),
        });
        return res.redirect("/")
    } catch(err) {
        return res.render("upload", {
            pageTitle: "Upload Video",
            errorMessage: err._message,
        });
    }
}

export const deleteVideo = async (req, res) => {
    const { id } = req.params

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
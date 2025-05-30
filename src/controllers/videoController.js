import Video from "../models/Video";


export const home = async (req, res) => {
    try {
        const videos = await Video.find({}); //db에서 결과를 받을때까지 대기
        return res.render("home", {pageTitle : "Home", videos});
    } catch {
        return res.render("server-error");
    }
    
 }
export const watch = (req, res) => {
    const { id } = req.params;
    
    return res.render("watch", {pageTitle : `Watch `});
};
export const getEdit = (req, res) => {
    const { id } = req.params;
    
    return res.render("edit", {pageTitle : `Editing: `});
};

export const postEdit = (req, res) => {
    const { id } = req.params;
    const { title } = req.body
    
    

    return res.redirect(`/videos/${id}`)
}

export const getUpload= (req, res) => {
    return res.render("upload", {pageTitle: "Upload Video"})
}

export const postUpload = (req, res) => {
    // here we will add a video to the videos array.
    const { title, description, hashtags } = req.body

    const video = new Video({
        title: title,
        description: description,
        createdAt: Date.now(),
        hashtags: hashtags.split(",").map(tag => {
            const tagWithoutHashes = tag.replaceAll("#", "");

            const trimmedTag = tagWithoutHashes.trim();
            return trimmedTag;
        })
        .filter(tag => tag !== "")
        .map(tag => `#${tag}`),
        meta: {
            views: 0,
            rating: 0,
        },
    });
    console.log(video);
    return res.redirect("/")
}
let videos = [
    {
        title: "First Video",
        rating:5,
        comments:2,
        createdAt: "2 minutes ago",
        views: 1,
        id: 1,
    },
    {
        title: "Second Video",
        rating:4.5,
        comments:1,
        createdAt: "1 minutes ago",
        views: 51,
        id: 2,
    },
    {
        title: "Third Video",
        rating:5,
        comments:0,
        createdAt: "0 minutes ago",
        views: 45,
        id: 3,
    }
];

export const trending = (req, res) => {
    
    return res.render("home", {pageTitle : "Home", videos});
 } //pug 파일을 렌더하게 함. 5.1
export const watch = (req, res) => {
    const { id } = req.params;
    const video = videos[id-1]
    return res.render("watch", {pageTitle : `Watch ${video.title}`, video});
};
export const getEdit = (req, res) => {
    const { id } = req.params;
    const video = videos[id-1]
    return res.render("edit", {pageTitle : `Editing: ${video.title}`, video});
};

export const postEdit = (req, res) => {
    const { id } = req.params;
    const { title } = req.body
    
    videos[id-1].title = title;
    
    return res.redirect(`/videos/${id}`)
}
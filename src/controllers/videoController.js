let videos = [
    {
        title: "First Video",
        rating:5,
        comments:2,
        createdAt: "2 minutes ago",
        views: 59,
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
export const see = (req, res) => {
    const { id } = req.params;
    const video = videos[id-1]
    return res.render("watch", {pageTitle : `Watch ${video.title}`, video});
};
export const edit = (req, res) => {
    return res.render("edit", {pageTitle : "Edit", videos});
};
export const search = (req, res) => res.send("Search");
export const upload = (req, res) => res.send("upload");
export const remove = (req, res) => {
    console.log(req.params);
    return res.send("Remove Video");
};
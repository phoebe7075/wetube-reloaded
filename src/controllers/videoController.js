
export const trending = (req, res) => {
    const videos = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const videos2 = [];
    return res.render("home", {pageTitle : "Home", videos2});
 } //pug 파일을 렌더하게 함. 5.1
export const see = (req, res) => {
    return res.render("watch", {pageTitle : "Watch"});
};
export const edit = (req, res) => {
    return res.render("edit", {pageTitle : "Edit"});
};
export const search = (req, res) => res.send("Search");
export const upload = (req, res) => res.send("upload");
export const remove = (req, res) => {
    console.log(req.params);
    return res.send("Remove Video");
};
export const trending = (req, res) => res.render("home", {pageTitle : "Home"}); //pug 파일을 렌더하게 함. 5.1
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
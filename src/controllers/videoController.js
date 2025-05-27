export const trending = (req, res) => res.render("home"); //pug 파일을 렌더하게 함. 5.1
export const see = (req, res) => {
    return res.render("watch");
};
export const edit = (req, res) => {
    return res.render("edit");
};
export const search = (req, res) => res.send("Search");
export const upload = (req, res) => res.send("upload");
export const remove = (req, res) => {
    console.log(req.params);
    return res.send("Remove Video");
};
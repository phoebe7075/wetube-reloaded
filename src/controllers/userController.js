import User from "../models/User"

export const getJoin = (req, res) => res.render("join", {pageTitle: "Join"});

export const postJoin = async (req, res) => {
    const {name, username, email, password, password2, location} = req.body;
    
    if(password !== password2) {
        return res.render("join", {
            pageTitle: "Join", 
            errMsg:"Password confirmation does not match."
        });
    }
    
    const exists = await User.exists({$or: [{username}, {email}]});
    if(exists) {
        return res.render("join", {
            pageTitle: "Join", 
            errMsg:"This Username/Email is already Exist."
        });
    }

    

    await User.create({
        name, username, email, password, location
    });
    console.log("user join success!");
    return res.redirect("/login");
}

export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const login = (req, res) => res.send("login");
export const logout = (req, res) => res.send("logout");
export const see = (req, res) => res.send("See User");
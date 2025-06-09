import User from "../models/User"
import bcrypt from "bcrypt";

export const getJoin = (req, res) => res.render("join", {pageTitle: "Join"});

export const postJoin = async (req, res) => {
    const {name, username, email, password, password2, location} = req.body;
    
    if(password !== password2) {
        return res.status(400).render("join", {
            pageTitle: "Join", 
            errMsg:"Password confirmation does not match."
        });
    }
    
    const exists = await User.exists({$or: [{username}, {email}]});
    if(exists) {
        return res.status(400).render("join", {
            pageTitle: "Join", 
            errMsg:"This Username/Email is already Exist."
        });
    }

    
    try {
        await User.create({
            name, username, email, password, location
        });
        console.log("user join success!");
        return res.redirect("/login");
    } catch (error) {
        return res.status(400).render("join", {
            pageTitle: "Join",
            errMsg: error._message,
        })
    }
    
}
export const getLogin = (req, res) => res.render("login", {pageTitle:"Login"});

export const postLogin = async (req, res) => {
    const {username, password} = req.body;

    const user = await User.findOne({username});

    if(!user) {
        return res.status(400).render("login", {
            pageTitle:"Login", 
            errMsg:"An account with this username does not exists."
        });
    }

    console.log(user.password);
    if(!bcrypt.compare(password, user.password)) {
        return res.status(400).render("login", {
            pageTitle:"Login",
            errMsg:"Password not correct. Please Retry one more.",
        });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
};

export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");

export const logout = (req, res) => res.send("logout");
export const see = (req, res) => res.send("See User");
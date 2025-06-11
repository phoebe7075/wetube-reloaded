import User from "../models/User"
import bcrypt from "bcrypt";
import fetch from "node-fetch";

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

export const startGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id:process.env.GITHUB_CLIENT_ID,
        allow_signup:false,
        scope:"read:user user:email",
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
}

export const finishGithubLogin = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id:process.env.GITHUB_CLIENT_ID,
        client_secret:process.env.GITHUB_CLIENT_SECRET,
        code: req.query.code
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;

    const tokenRequest = await ( 
        await fetch(finalUrl, {
            method:"POST",
            headers:{
                Accept: "application/json",
            },
        })
    ).json();

    if("access_token" in tokenRequest) {
        const {access_token} = tokenRequest;
        const apiUrl = "https://api.github.com";
        const userData = await ( 
            await fetch(`${apiUrl}/user`, {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();
        console.log(userData);
        const userEmail = await ( 
            await fetch(`${apiUrl}/user/emails`, {
                headers: {
                    Authorization: `token ${access_token}`,
                },
            })
        ).json();
        const email = userEmail.find(
            (email) => email.primary === true && email.verified === true
        );
        if(!email) {
            return res.redirect("/login");
        }
    }else {
        return res.redirect("/login");
    }

};

export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");

export const logout = (req, res) => res.send("logout");
export const see = (req, res) => res.send("See User");
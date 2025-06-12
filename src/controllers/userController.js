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

    const user = await User.findOne({username, socialOnly:false});

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
        const emailOBj = userEmail.find(
            (email) => email.primary === true && email.verified === true
        );
        if(!emailOBj) {
            return res.redirect("/login");
        }
        let user = await User.findOne({email: emailOBj.email});
        if(!user) {
            user = await User.create({
                name:userData.name,
                username:userData.login,
                email:emailOBj.email,
                password:"",
                socialOnly: true,
                location:userData.location,
                avatarUrl:userData.avatarUrl,
            });
        }
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/");
    }else {
        return res.redirect("/login");
    }

};
export const logout = (req, res) => {
    req.session.destroy();
    return res.redirect("/");
};

export const getEdit = (req, res) => {
    return res.render("edit-profile", {pageTitle:"Edit Profile"});
};

export const postEdit = async (req, res) => {
    const {
        session: {
            user: {_id},
        },
        body: {name, email, username, location},
    } = req;
    
    
    const exists = await User.exists({$or: [{username}, {email}]});

    if(exists) {
        return res.status(400).render("edit-profile", {
                pageTitle:"Update Profile", 
                errorMessage:"Check Username or Email. already have an Username or Email."
            } 
        )
    }
    

    const updatedUser = await User.findByIdAndUpdate(_id, {name, email, username, location}, {new:true});
    
    req.session.user = updatedUser;

    return res.redirect("/users/edit");
};


export const see = (req, res) => res.send("See User");
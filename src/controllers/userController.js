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
    const checkPassword = await bcrypt.compare(password, user.password);

    if(!checkPassword) {
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
            req.flash("error", "Github 이메일이 정상적이지 않습니다. 다시 시도해주세요.");
            return res.redirect("/login");
        }
        console.log(emailOBj);
        let user = await User.findOne({email: emailOBj.email});

        const existingUserByUsername = await User.findOne({ username: userData.login });
        if(!existingUserByUsername && !user) {
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
        if(existingUserByUsername && !user) {
            req.flash("error", `GitHub 사용자 이름('${userData.login}')이 이미 다른 이메일로 등록된 계정에서 사용 중입니다. 해당 계정으로 로그인하시거나 다른 방법을 시도해주세요.`);
            return res.redirect("/login");
        }
        
        req.session.loggedIn = true;
        req.session.user = user;

        return res.redirect("/");
    }else {
        req.flash("error", "GitHub 인증에 실패했습니다. 다시 시도해주세요.");
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
            user: {_id, avatarUrl},
        },
        body: {name, email, username, location},
        file,
    } = req;
    
    if(req.session.user.email !== email) {
        const existEqualEmail = await User.findOne({email});
        if(existEqualEmail) {
            return res.status(400).render("edit-profile", {
                    pageTitle:"Edit Profile", 
                    errorMessage:"Check Email. already have an Same Email."
                } 
            )
        }
    }

    if(req.session.user.username !== username) {
        const existEqualUsername = await User.findOne({username});
        if(existEqualUsername) {
            return res.status(400).render("edit-profile", {
                    pageTitle:"Edit Profile", 
                    errorMessage:"Check Username. already have an Same Username."
                } 
            )
        }
    }

    const updatedUser = await User.findByIdAndUpdate(_id, 
        {
            avatarUrl: file ? file.path : avatarUrl,
            name, 
            email, 
            username, 
            location
        }, {new:true});
    
    req.session.user = updatedUser;

    return res.redirect("/users/edit");
};

export const getChangePassword = (req, res) => {
    if(req.session.user.socialOnly) {
        return res.redirect("/");
    }
    return res.render("users/change-password", {pageTitle:"Change Password"});
}

export const postChangePassword = async (req, res) => {
    const {
        session: {
            user: {_id, password},
        },
        body: {oldPassword, newPassword, newPassword2},
    } = req;

    const checkPassword = await bcrypt.compare(oldPassword, password);

    if(!checkPassword) {
        return res.status(400).render("users/change-password", {
            pageTitle:"Change Password", 
            errorMessage:"Old Password not correct. Please Retry.",
        });
    }

    if(newPassword !== newPassword2) {
        return res.status(400).render("users/change-password", {
                pageTitle:"Change Password", 
                errorMessage:"Password confirmation does not match."
            } 
        );
    }

    if(oldPassword === newPassword) {
        return res.status(400).render("users/change-password", {
                pageTitle:"Change Password", 
                errorMessage:"Old Password and New Password is same. Please Use another Password."
            }
        );
    }
    
    const user = await User.findById(_id);
    user.password = newPassword;
    await user.save();
    req.session.user.password = user.password;


    return res.redirect("/users/logout");
}

export const see = (req, res) => res.send("See User");
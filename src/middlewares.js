import multer from "multer";

export const localsMiddleware = (req, res, next) => {
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.siteName="Wetube";
    res.locals.loggedInUser = req.session.user || {};
    console.log(res.locals);
    next();
}

export const protectorMiddleware = (req, res, next) => {
    if(req.session.loggedIn) {
        return next();
    } else {
        return res.redirect("/login");
    }
}

export const publicOnlyMiddleware = (req, res, next) => {
    if(!req.session.loggedIn) {
        return next();
    } else {
        return res.redirect("/");
    }
}

export const flashMiddleware = (req, res, next) => {
    res.locals.messages = req.flash(); // req.flash()는 { success: [...], error: [...] } 형태의 객체를 반환
    next();
}

export const avatarUpload = multer({
    dest: "uploads/avatars/",
    limits: {
        fileSize: 3000000,
    },
})

export const videoUpload = multer({
    dest:"uploads/videos/",
    limits: {
        fileSize: 10000000,
    },
})
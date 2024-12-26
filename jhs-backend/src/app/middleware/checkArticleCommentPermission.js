// third party import
const jwt = require('jsonwebtoken');

// import models
const { User } = require('../models/user');

// import utils (helper functions)
const catchAsync = require('../utils/catchAsync');
const { Response } = require('../../framework');

// import config information
const clientSecret = require("../config/clientSecret.config");
const { Article } = require('../models/article/article');
var mongoose = require('mongoose');
const { ArticleComment } = require('../models/article/articleComment');

// export middleware
module.exports = () => {
    return catchAsync(async (req, res, next) => {
        const authHeader = req.get('Authorization');
        if (!authHeader) {
            // return error
            return res.status(401).json(
                Response.unauthorize({ message: `Unauthorized.` })
            );
        }
        const token = authHeader.split(' ')[1];

        let decodedToken;
        try {
            decodedToken = jwt.verify(token, clientSecret.key);
        } catch (err) {
            // return error
            return res.status(401).json(
                Response.unauthorize({ message: `Token expired` })
            );
        } // catch
        
        req.userId = decodedToken.userId;
        const result = await User.findById(
            decodedToken.userId,
        ).select({ role: 1 });

        let permission = false;
        const articleInfo = await Article.findById(req.params.articleId);
        if(!articleInfo){
            // return error
            return res.status(403).json(
                Response.forbidden({ message: `Access Denied You don't have permission to access` })
            );
        }

        const commentInfo = await ArticleComment.findOne({
            "_id": req.params.commentId,
            "addBy": req.userId
        });
        if(!commentInfo){
            // return error
            return res.status(403).json(
                Response.forbidden({ message: `Access Denied You don't have permission to access` })
            );
        }

        if(articleInfo?._author == mongoose.Types.ObjectId(req.userId) ){
            permission = true;
            req.userType = "Author";
        } // end if

        if(articleInfo?.authorList.includes(mongoose.Types.ObjectId(req.userId))){
            permission = true;
            req.userType = "Author";
        } // end if

        if(articleInfo?.reviewerList.includes(mongoose.Types.ObjectId(req.userId))){
            permission = true;
            req.userType = "Reviewer";
        } // end if
        if((articleInfo?.assignedTo)  == mongoose.Types.ObjectId(req.userId) ){
            permission = true;
            req.userType = "Editor";
        } // end if
        
        if(!permission){
            // return error
            return res.status(403).json(
                Response.forbidden({ message: `Access Denied You don't have permission to access` })
            );
        }

        // create JWT for next response
        const newToken = jwt.sign(
            {
                email: decodedToken.email,
                userId: decodedToken.userId
            },
            clientSecret.key,
            { expiresIn: '1h' }
        );
        req.token = newToken;
        next();
    });
}

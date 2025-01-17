// third party import
const jwt = require('jsonwebtoken');

// import models
const { User } = require('../../models/user');

// import utils (helper functions)
const catchAsync = require('../../utils/catchAsync');
const { Response } = require('../../../framework');

// import config information
const clientSecret = require("../../config/clientSecret.config");
const { ArticlePublished } = require('../../models/article/articlePublished');
const { Role } = require('../../models/role');

// export middleware
module.exports = (permission, feature) => {
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

        const permissionList = await Role.find(
            {
                slug: result.role
            },
        ).select({ rolePermission: 1 });

        let authorPermission = false;
        const articleInfo = await ArticlePublished.findById(req.params.articleId);
        if (!articleInfo) {
            // return error
            return res.status(403).json(
                Response.forbidden({ message: `Access Denied You don't have permission to access` })
            );
        }

        if (articleInfo?.authorList.includes(req.userId) || articleInfo?._author == req.userId) {
            authorPermission = true;
            req.userType = "Author";
        } // end if

        if (articleInfo?.reviewerList.includes(req.userId)) {
            // return error
            return res.status(403).json(
                Response.forbidden({ message: `Access Denied You don't have permission to access` })
            );
        } // end if

        if (!authorPermission) { // if user have not reviewer permission then check for his role permission
            if (permissionList.length > 0) {
                if (!(permissionList[0].rolePermission).includes(permission + '-' + feature)) {
                    // return error
                    return res.status(403).json(
                        Response.forbidden({ message: `Access Denied You don't have permission to access` })
                    );
                } // end if
            } else {
                // return error
                return res.status(403).json(
                    Response.forbidden({ message: `Access Denied You don't have permission to access` })
                );
            } // end if
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

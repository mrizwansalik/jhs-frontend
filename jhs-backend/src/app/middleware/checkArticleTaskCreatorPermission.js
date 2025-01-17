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
const { Role } = require('../models/role');
const { ArticleTask } = require('../models/article/articleTask');

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

        let editorPermission = false;
        const taskInfo = await ArticleTask.findById(req.params.taskId);
        if (!taskInfo) {
            // return error
            return res.status(403).json(
                Response.forbidden({ message: `Access Denied You don't have permission to access` })
            );
        }

        if (taskInfo?.addBy == req.userId) {
            editorPermission = true;
            req.userType = "Manager";
        } // end if

        if (!editorPermission) { // if user have not editor permission then check for his role permission
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

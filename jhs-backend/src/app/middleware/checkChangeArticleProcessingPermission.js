// third party import
const jwt = require('jsonwebtoken');

// import models
const { User } = require('../models/user');

// import utils (helper functions)
const catchAsync = require('../utils/catchAsync');
const { Response } = require('../../framework');

// import config information
const { Article } = require('../models/article/article');
const { ArticleStatus } = require('../models/article/articleStatus');
const clientSecret = require("../config/clientSecret.config");
const { ArticleTask } = require('../models/article/articleTask');

// export middleware
module.exports = () => {
    return catchAsync(async (req, res, next) => {
        const articleInfo = await Article.findById(req.params.articleId).populate('articleStatus');
        if(!articleInfo){
            // return error
            return res.status(403).json(
                Response.forbidden({ message: `Access Denied You don't have permission to access` })
            );
        }

        const articleTasks = await ArticleTask.find({
            isDone: false,
            article: req.params.articleId,
            taskType: articleInfo?.articleStatus,
        });
        if(articleTasks.length != 0){// return error
            return res.status(403).json(
                Response.forbidden({ message: `Article Tasks are pending in ${articleInfo?.articleStatus?.name}` })
            );
        }
        next();
    });
}

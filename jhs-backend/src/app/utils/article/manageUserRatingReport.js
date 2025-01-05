
const { UserReport } = require("../../models/userReport");

const { PublicationRating } = require("../../models/rating/publicationRating");
const { ReviewRating } = require("../../models/rating/reviewRating");
const { EditorRating } = require("../../models/rating/editorRating");
const { ArticlePublished } = require("../../models/article/articlePublished");
const { ArticleRating } = require("../../models/rating/articleRating");

exports.addPublicationRating = async (data) => {
        // create new Rating Status object
        const publicationRating = new PublicationRating({
                article_id: data.article_id,
                rater_id: data.rater_id,
                score: data.score,
                comment: data.comment,
        });
        const publicationRatingResult = await publicationRating.save();

        const updatedUserReport = await UserReport.findOneAndUpdate(
                { user_id: data.user_id },
                {
                        $push: { [`ratings.publication_rating_list`]: publicationRatingResult._id },
                },
                { new: true }
        );

        // Fetch all scores for the user's editor ratings
        const ratingIds = updatedUserReport.ratings.editor_rating_list;
        const ratings = await PublicationRating.find({ _id: { $in: ratingIds } }, 'score');

        // Calculate average score
        const averageScore = ratings.reduce((sum, rating) => sum + rating.score, 0) / ratings.length;

        // Update UserReport with the new average score
        return await UserReport.findOneAndUpdate(
                { user_id: data.user_id },
                {
                        $set: { [`ratings.average_publication_rating`]: averageScore },
                }
        );
};

exports.addReviewRating = async (data) => {
        // create new Rating Status object
        const reviewRating = new ReviewRating({
                article_id: data.article_id,
                rater_id: data.rater_id,
                score: data.score,
                comment: data.comment,
        });
        const reviewRatingResult = await reviewRating.save();

        const updatedUserReport = await UserReport.findOneAndUpdate(
                { user_id: data.user_id },
                {
                        $push: { [`ratings.review_rating_list`]: reviewRatingResult._id },
                },
                { new: true }
        );

        // Fetch all scores for the user's editor ratings
        const ratingIds = updatedUserReport.ratings.editor_rating_list;
        const ratings = await ReviewRating.find({ _id: { $in: ratingIds } }, 'score');

        // Calculate average score
        const averageScore = ratings.reduce((sum, rating) => sum + rating.score, 0) / ratings.length;

        // Update UserReport with the new average score
        return await UserReport.findOneAndUpdate(
                { user_id: data.user_id },
                {
                        $set: { [`ratings.average_reviewer_rating`]: averageScore },
                }
        );

};

exports.addEditorRating = async (data) => {
        // create new Rating Status object
        const editorRating = new EditorRating({
                article_id: data.article_id,
                rater_id: data.rater_id,
                score: data.score,
                comment: data.comment,
        });
        const editorRatingResult = await editorRating.save();

        const updatedUserReport = await UserReport.findOneAndUpdate(
                { user_id: data.user_id },
                {
                        $push: { [`ratings.editor_rating_list`]: editorRatingResult._id },
                },
                { new: true }
        );

        // Fetch all scores for the user's editor ratings
        const ratingIds = updatedUserReport.ratings.editor_rating_list;
        const ratings = await EditorRating.find({ _id: { $in: ratingIds } }, 'score');

        // Calculate average score
        const averageScore = ratings.reduce((sum, rating) => sum + rating.score, 0) / ratings.length;

        // Update UserReport with the new average score
        return await UserReport.findOneAndUpdate(
                { user_id: data.user_id },
                {
                        $set: { [`ratings.average_editor_rating`]: averageScore },
                }
        );
};

exports.addArticleRating = async (data) => {

        const existingRating = await ArticleRating.findOne({
                article_id: data.article_id,
                rater_id: data.rater_id,
            });
            
        if (existingRating) {
                return {
                        message: 'This user has already rated this article.',
                        success: false,
                }
        }

        // create new Rating Status object
        const articleRating = new ArticleRating({
                article_id: data.article_id,
                rater_id: data.rater_id,
                score: data.score,
                comment: data.comment,
                rating_list: data.rating_list,
        });
        const articleRatingResult = await articleRating.save();

        // Rating
        return await ArticlePublished.findOneAndUpdate(
                { _id: data.article_id },
                {
                        $push: { [`rating`]: articleRatingResult._id },
                }
        );

};
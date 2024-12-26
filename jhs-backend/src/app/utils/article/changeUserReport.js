
const { UserReport } = require("../../models/userReport");

// Increase Pending article on payment done
exports.incrementPendingArticleReport = async (userId, articleId) => {
        return await UserReport.findOneAndUpdate(
                { user_id: userId },
                {
                        $inc: { [`articles.pending_count`]: 1 }, // Increment the count
                        $push: { [`articles.pending_list`]: articleId }, // remove article form pending
                },
                { new: true }
        );
};

// Increase rejected article
exports.incrementRejectedArticleReport = async (userId, articleId) => {

        // Proceed with the update operation
        await UserReport.updateOne(
                { user_id: userId },
                { $inc: { "articles.pending_count": -1 } }
        );
        
        return await UserReport.findOneAndUpdate(
                { user_id: userId },
                {
                        $inc: { [`articles.rejected_count`]: 1 }, // Increment the count
                        $pull: { [`articles.pending_list`]: articleId }, // remove article form pending
                        $push: { [`articles.rejected_list`]: articleId }, // Add article to publish list
                },
                { new: true }
        );
};

exports.incrementRevisionArticleReport = async (userId, articleId) => {

        // Proceed with the update operation
        await UserReport.updateOne(
                { user_id: userId },
                { $inc: { "articles.rejected_count": -1 } }
        );
        return await UserReport.findOneAndUpdate(
                { user_id: userId },
                {
                        $inc: { [`articles.revision_count`]: 1 }, // Increment the count
                        $pull: { [`articles.rejected_list`]: articleId }, // remove article form pending
                        $push: { [`articles.revision_list`]: articleId }, // Add article to publish list
                },
                { new: true }
        );
};

exports.acceptRevisionArticleReport = async (userId, articleId) => {
        return await UserReport.findOneAndUpdate(
                { user_id: userId },
                {
                        $inc: { [`articles.pending_count`]: 1 }, // Increment the count
                        $push: { [`articles.pending_list`]: articleId }, // Add article to publish list
                },
                { new: true }
        );
};

exports.incrementPublishedArticleReport = async (userId, articleId, publishArticleId) => {

        // Proceed with the update operation
        await UserReport.updateOne(
                { user_id: userId },
                { $inc: { "articles.pending_count": -1 } }
        );

        return await UserReport.findOneAndUpdate(
                { user_id: userId },
                {
                        $inc: { [`articles.published_count`]: 1 }, // Increment the count
                        $pull: { [`articles.pending_list`]: articleId }, // remove article form pending
                        $push: { [`articles.published_list`]: publishArticleId }, // Add article to publish list
                },
                { new: true }
        );
};

exports.incrementPublishedCollaborationArticleReport = async (authorList, publishArticleId) => {
        const updates = authorList.map(authorId => {
                return UserReport.findOneAndUpdate(
                    { user_id: authorId },
                    {
                        $inc: { "articles.collaboration_count": 1 }, // Increment published count
                        $push: { "articles.collaboration_list": publishArticleId } // Add article to published list
                    },
                    { new: true, upsert: true } // Return updated document; create if not found
                ).exec();
            });
        
            return Promise.all(updates); // Wait for all updates to complete
};

exports.incrementPendingReviewArticleReport = async (userId, articleId) => {
        return await UserReport.findOneAndUpdate(
                { user_id: userId },
                {
                        $inc: { [`articles.pending_reviewed_count`]: 1 }, // Increment the count
                        $push: { [`articles.pending_reviewed_list`]: articleId }, // Add article to publish list
                },
                { new: true }
        );
};

exports.incrementReviewArticleReport = async (userId, articleId) => {
        return await UserReport.findOneAndUpdate(
                { user_id: userId },
                {
                        $inc: { "articles.pending_reviewed_count": -1 },
                        $inc: { [`articles.reviewed_count`]: 1 }, // Increment the count
                        $pull: { [`articles.pending_reviewed_list`]: articleId }, // remove article form pending
                        $push: { [`articles.reviewed_list`]: articleId }, // Add article to publish list
                },
                { new: true }
        );
};

exports.incrementReviewArticleOnAssigningReport = async (userId, articleId) => {
        return await UserReport.findOneAndUpdate(
                { user_id: userId },
                {
                        $inc: { [`articles.reviewed_count`]: 1 }, // Increment the count
                        $push: { [`articles.reviewed_list`]: articleId }, // Add article to publish list
                },
                { new: true }
        );
};

exports.decreaseReviewArticleOnUnAssigningReport = async (userId, articleId) => {
        return await UserReport.findOneAndUpdate(
                { user_id: userId },
                {
                        $inc: { [`articles.reviewed_count`]: -1 }, // Increment the count
                        $pull: { [`articles.reviewed_list`]: articleId }, // Add article to publish list
                },
                { new: true }
        );
};

exports.incrementCompleteReviewArticleReport = async (reviewerList, articleId, publishArticleId) => {
        const updates = reviewerList.map(reviewerId => {
                return UserReport.findOneAndUpdate(
                    { user_id: reviewerId },
                    {
                        $inc: { [`articles.reviewed_count`]: -1 }, // Decrement the count
                        $inc: { [`articles.completed_reviewed_count`]: 1 }, // Increment the count
                        $pull: { [`articles.reviewed_list`]: articleId }, // remove article form pending
                        $push: { [`articles.completed_reviewed_list`]: publishArticleId }, // Add article to publish list
                    },
                    { new: true, upsert: true } // Return updated document; create if not found
                ).exec();
            });
        
            return Promise.all(updates); // Wait for all updates to complete
};

exports.updateTotalCitations = async (userId, citationChange) => {
        return await UserReport.findOneAndUpdate(
                { user_id: userId },
                {
                        $inc: { total_citations: citationChange },
                },
                { new: true }
        );
};

const { ArticleStatus } = require('../../app/models/article/articleStatus');

class ArticleStatusSeeder {
    static async run() {
        try {
            const existingStatuses = await ArticleStatus.countDocuments();
            
            // Early return if statuses already exist
            if (existingStatuses > 0) {
                console.log("Article statuses already seeded.");
                return;
            }

            const statuses = [
                { name: "Draft", slug: "draft", type: "Draft", message: "Article Draft is created" },
                { name: "Submitted", slug: "submitted", type: "Initial Evaluation", message: "Article is submitted" },
                { name: "Pending Payment", slug: "pendingpayment", type: "Initial Evaluation", message: "Article payment is pending" },
                { name: "Revision Request", slug: "revisionrequest", type: "Requested for Article revision", message: "Author requested for article revision" },
                { name: "In Revision", slug: "inrevision", type: "Article in revision", message: "Request for Article revision is approved" },
                { name: "Revision Submitted", slug: "revisionsubmitted", type: "Article revision submitted", message: "Article Revision is submitted" },
                { name: "Language Check", slug: "languagecheck", type: "Editor Review", message: "Article is in language check" },
                { name: "Pending Correction Service", slug: "pendingcorrectionservice", type: "Editor Review", message: "Article is ready for language correction service" },
                { name: "Language Correction Service", slug: "languagecorrectionservice", type: "Editor Review", message: "Article is assigned for language check service" },
                { name: "Peer Review", slug: "peerreview", type: "Peer Review", message: "Article is in peer review" },
                { name: "Gallery Proof Send", slug: "galleryproofsend", type: "Gallery Proof Send", message: "Article Gallery Proof Sent to Corresponding author" },
                { name: "Ready for Publish", slug: "readyforpublish", type: "Ready for Publish", message: "Article is ready for publish" },
            ];

            const articleStatus = await ArticleStatus.insertMany(statuses);
            console.log("Article statuses seeded successfully.");

            return articleStatus;
        } catch (error) {
            console.error("Error seeding article statuses:", error);
            throw error;
        }
    }
}

module.exports = ArticleStatusSeeder;

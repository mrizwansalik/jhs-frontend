var moment = require('moment');
const { Journal } = require('../../models/journal');
const { ArticleMeta } = require('../../models/article/articleMeta');

// Helper function to generate invoice HTML using custom template
exports.setArticleMetaInfo = async (article) => {
        const articleMetaInfo = await ArticleMeta.findOne({
                year: moment().format('YYYY'),
                issue: moment().format('M'),
        });
        
        const journalInfo = await Journal.findOne().populate('_manageBy');

        let result;
        if (!articleMetaInfo) {
                // create new Article Meta object
                const articleMeta = new ArticleMeta({
                        name: "Volume "+moment().format('Y').slice(-1)+" Issue "+moment().format('M')+" "+moment().format('YYYY'),
                        slug: "volume"+(moment().format('Y').slice(-1))+"issue "+moment().format('M')+""+moment().format('YYYY'),
                        volume: moment().format('Y'),
                        year: moment().format('YYYY'),
                        issue: moment().format('M'),  
                });
                // adding article Status in db using mongoes articleMeta Object
                result = await articleMeta.save();

                journalInfo.update({ nextDoiNumberSequence: 1});
                journalInfo.save();
        } else {
                result = articleMetaInfo;
        }

        const articleInfo = {        
                articleNumber: journalInfo.shortName+result.year+(journalInfo.nextArticleNumberSequence.toString().padStart(6, '0')),
                journal_info: { "_id": journalInfo._id },
                articleMetaInfo: { "_id": result._id },
        }
        
        article.set(articleInfo);
        await article.save();

        const updatedJournalInfo = {
                nextArticleNumberSequence: journalInfo.nextArticleNumberSequence + 1
        }
        journalInfo.set(updatedJournalInfo);
        await journalInfo.save();
}
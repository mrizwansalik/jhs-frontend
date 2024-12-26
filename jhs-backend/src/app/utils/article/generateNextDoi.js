var moment = require('moment');
const { Journal } = require('../../models/journal');
const { ArticleMeta } = require('../../models/article/articleMeta');

// Helper function to generate invoice HTML using custom template
exports.generateNextDoi = async (volume) => {
        
        const journalInfo = await Journal.findOne();

        const articleMetaInfo = await ArticleMeta.findOne({
                year: moment().format('YYYY'),
                issue: moment().format('M'),
        });
        
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

        const doiInfo = journalInfo.doiPrefix + "/JOHS." + moment().format('YYYY') + "." + volume  + moment().format('MM') + ""+journalInfo.nextDoiNumberSequence.toString().padStart(2, '0');

        const updatedJournalInfo = {
                nextDoiNumberSequence: journalInfo.nextDoiNumberSequence + 1
        }
        journalInfo.set(updatedJournalInfo);
        await journalInfo.save();

        return doiInfo.toString();
}
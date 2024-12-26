const { ArticleType } = require('../../app/models/article/articleType');

class ArticleTypeSeeder {
    static async run() {
        try {
            const existingTypes = await ArticleType.countDocuments();

            // Early return if article types are already seeded
            if (existingTypes > 0) {
                console.log("Article types already seeded.");
                return;
            }

            // Reusable elements for types
            const commonElements = [
                "introduction",
                "methodology",
                "result",
                "discussion",
                "conclusion",
                "acknowledgement",
                "disclosure",
                "supplementary"
            ];

            const articleTypes = [
                { name: "Original Article", elements: commonElements },
                { name: "Review Article", elements: commonElements },
                {
                    name: "Case Report",
                    elements: [
                        "introduction",
                        "case_presentation",
                        "discussion",
                        "conclusion",
                        "disclosure",
                    ]
                },
                {
                    name: "Technical Report",
                    elements: [
                        "introduction",
                        "case_presentation",
                        "discussion",
                        "conclusion",
                        "acknowledgement",
                    ]
                },
                {
                    name: "Editorial",
                    elements: [
                        "introduction",
                        "result",
                        "methodology",
                    ]
                },
            ];

            const articleType = await ArticleType.insertMany(articleTypes);
            console.log("Article types seeded successfully.");

            return articleType;
        } catch (error) {
            console.error("Error seeding article types:", error);
            throw error;
        }
    }
}

module.exports = ArticleTypeSeeder;
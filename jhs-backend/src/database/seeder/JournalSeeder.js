const { Journal } = require('../../app/models/journal');

class JournalSeeder {
    static async run() {
        try {
            const existingJournals = await Journal.countDocuments();

            // Early return if journals are already seeded
            if (existingJournals > 0) {
                console.log("Journals already seeded.");
                return;
            }

            const journals = [
                {
                    name: "Journal of Healthcare Sciences",
                    shortName: "JOHS",
                    logo: null,
                    type: "Medical Billing",
                    eISSN: "4567890-8765",
                    pISSN: "4567890-8765",
                    doiPrefix: "http://dx.doi.org/10.52533",
                    nextDoiNumberSequence: "00001",
                },
            ];

            const journal = await Journal.insertMany(journals);
            console.log("Journals seeded successfully.");

            return journal;
        } catch (error) {
            console.error("Error seeding journals:", error);
            throw error;
        }
    }
}

module.exports = JournalSeeder;

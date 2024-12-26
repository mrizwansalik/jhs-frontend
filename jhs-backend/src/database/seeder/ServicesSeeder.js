const { Services } = require('../../app/models/services/services');

class ServicesSeeder {
    static async run() {
        try {
            const existingServices = await Services.countDocuments();

            // Early return if services are already seeded
            if (existingServices > 0) {
                console.log("Services already seeded.");
                return;
            }

            const services = [
                {
                    nickTitle: 'Article Processing',
                    title: 'Article Processing',
                    slug: 'articleprocessing',
                    description: 'Article Processing',
                    price: 120,
                },
                {
                    nickTitle: 'Article Correction',
                    title: 'Article Correction',
                    slug: 'articlecorrection',
                    description: 'Article Correction',
                    price: 50,
                },
            ];

            const insertedServices = await Services.insertMany(services);
            console.log("Services seeded successfully.");

            return insertedServices;
        } catch (error) {
            console.error("Error seeding services:", error);
            throw error;
        }
    }
}

module.exports = ServicesSeeder;

const { Company } = require('../../app/models/company');

class CompanySeeder {
    static async run() {
        try {
            const existingCompanies = await Company.countDocuments();

            // Early return if companies are already seeded
            if (existingCompanies > 0) {
                console.log("Companies already seeded.");
                return;
            }

            const companies = [
                {
                    name: "Onnmed LLC",
                    description: null,
                    email: "info@onnmed.com",
                    phone: "+97148790755",
                    address: "The One Tower, 24th Floor, Sheikh Zayed Road, PO BOX 390114",
                    city: "Dubai",
                    country: "United Arab Emirates",
                },
            ];

            const company = await Company.insertMany(companies);
            console.log("Companies seeded successfully.");

            return company;
        } catch (error) {
            console.error("Error seeding companies:", error);
            throw error;
        }
    }
}

module.exports = CompanySeeder;

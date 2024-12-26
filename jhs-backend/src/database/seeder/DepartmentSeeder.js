const { Department } = require('../../app/models/department');

class DepartmentSeeder {
    static async run() {
        try {
            const existingDepartments = await Department.countDocuments();

            // Early return if departments are already seeded
            if (existingDepartments > 0) {
                console.log("Departments already seeded.");
                return;
            }

            const baseInfo = {
                phone: "+97148790755",
                address: "The One Tower, 24th Floor, Sheikh Zayed Road, PO BOX 390114",
                city: "Dubai",
                country: "United Arab Emirates",
            };

            const departments = [
                { name: "Admin", email: "info@onnmed.com", ...baseInfo },
                { name: "System", email: "system@onnmed.com", ...baseInfo },
                { name: "IT", email: "it@onnmed.com", ...baseInfo },
                { name: "Operations", email: "operation@onnmed.com", ...baseInfo },
                { name: "Bio stats", email: "bisats@onnmed.com", ...baseInfo },
            ];

            const department = await Department.insertMany(departments);
            console.log("Departments seeded successfully.");

            return department;
        } catch (error) {
            console.error("Error seeding departments:", error);
            throw error;
        }
    }
}

module.exports = DepartmentSeeder;

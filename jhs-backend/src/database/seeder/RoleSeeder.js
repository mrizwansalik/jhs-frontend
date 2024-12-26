const { Role } = require('../../app/models/role');

class RoleSeeder {
    static async run() {
        try {
            const existingRoles = await Role.countDocuments();

            // Early return if roles are already seeded
            if (existingRoles > 0) {
                console.log("Roles already seeded.");
                return;
            }

            const roles = [
                {
                    name: 'Administration',
                    slug: 'administration',
                    rolePermission: [],
                },
                {
                    name: 'Admin',
                    slug: 'admin',
                    rolePermission: [],
                },
                {
                    name: 'Employee',
                    slug: 'employee',
                    rolePermission: [],
                },
                {
                    name: 'Editor',
                    slug: 'editor',
                    rolePermission: [],
                },
            ];

            const insertedRoles = await Role.insertMany(roles);
            console.log("Roles seeded successfully.");

            return insertedRoles;
        } catch (error) {
            console.error("Error seeding roles:", error);
            throw error;
        }
    }
}

module.exports = RoleSeeder;

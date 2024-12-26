const { Permission } = require('../../app/models/permission');
const { Role } = require('../../app/models/role');

class AdministrationPermissionSeeder {
    static async run() {
        try {
            const permissions = await Permission.find();

            // Check if permissions exist
            if (!permissions || permissions.length === 0) {
                console.log("No permissions found to seed.");
                return;
            }

            // Create a list of permission slugs concatenated with feature slugs
            const permissionList = permissions.flatMap(permission => 
                permission.feature.map(feature => `${permission.slug}-${feature.slug}`)
            );

            // Find and update the 'administration' role
            const role = await Role.findOneAndUpdate(
                { slug: 'administration' },
                { rolePermission: permissionList },
                { new: true, runValidators: true }
            );

            // Check if role was found and updated
            if (!role) {
                console.log("Role 'administration' not found.");
                return;
            }

            console.log("Role permissions updated successfully.");
            return role;
        } catch (error) {
            console.error("Error seeding permissions for administration role:", error);
            throw error;
        }
    } // end function run
}

// export class
module.exports = AdministrationPermissionSeeder;

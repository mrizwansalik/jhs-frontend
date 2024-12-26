const { Permission } = require('../../app/models/permission');

class PermissionSeeder {
    static async run() {
        try {
            const existingPermissions = await Permission.countDocuments();

            // Early return if permissions are already seeded
            if (existingPermissions > 0) {
                console.log("Permissions already seeded.");
                return;
            }

            const permissions = [
                {
                    name: "Company",
                    slug: "company",
                    feature: [
                        { name: "Add", slug: "add" },
                        { name: "Update", slug: "update" },
                        { name: "Delete", slug: "delete" },
                        { name: "View", slug: "view" },
                    ],
                },
                {
                    name: "User",
                    slug: "user",
                    feature: [
                        { name: "Add", slug: "add" },
                        { name: "Update", slug: "update" },
                        { name: "Delete", slug: "delete" },
                        { name: "View", slug: "view" },
                    ],
                },
                {
                    name: "Department",
                    slug: "department",
                    feature: [
                        { name: "Add", slug: "add" },
                        { name: "Update", slug: "update" },
                        { name: "Delete", slug: "delete" },
                        { name: "View", slug: "view" },
                    ],
                },
                {
                    name: "Journal",
                    slug: "journal",
                    feature: [
                        { name: "Add", slug: "add" },
                        { name: "Update", slug: "update" },
                        { name: "Delete", slug: "delete" },
                        { name: "View", slug: "view" },
                    ],
                },
                {
                    name: "Category",
                    slug: "category",
                    feature: [
                        { name: "Add", slug: "add" },
                        { name: "Update", slug: "update" },
                        { name: "Delete", slug: "delete" },
                        { name: "View", slug: "view" },
                    ],
                },
                {
                    name: "Services",
                    slug: "services",
                    feature: [
                        { name: "Add", slug: "add" },
                        { name: "Update", slug: "update" },
                        { name: "Delete", slug: "delete" },
                        { name: "View", slug: "view" },
                    ],
                },
                {
                    name: "Invoice",
                    slug: "invoice",
                    feature: [
                        { name: "Add", slug: "add" },
                        { name: "Update", slug: "update" },
                        { name: "Delete", slug: "delete" },
                        { name: "View", slug: "view" },
                    ],
                },
                {
                    name: "Payment",
                    slug: "payment",
                    feature: [
                        { name: "Add", slug: "add" },
                        { name: "Update", slug: "update" },
                        { name: "Delete", slug: "delete" },
                        { name: "View", slug: "view" },
                    ],
                },
                {
                    name: "Refund",
                    slug: "refund",
                    feature: [
                        { name: "Add", slug: "add" },
                        { name: "Update", slug: "update" },
                        { name: "Delete", slug: "delete" },
                        { name: "View", slug: "view" },
                    ],
                },
                {
                    name: "Employee",
                    slug: "employee",
                    feature: [
                        { name: "Add", slug: "add" },
                        { name: "Update", slug: "update" },
                        { name: "Delete", slug: "delete" },
                        { name: "View", slug: "view" },
                    ],
                },
                {
                    name: "Article Status",
                    slug: "articlestatus",
                    feature: [
                        { name: "Add", slug: "add" },
                        { name: "Update", slug: "update" },
                        { name: "Delete", slug: "delete" },
                        { name: "View", slug: "view" },
                    ],
                },
                {
                    name: "Article Type",
                    slug: "articletype",
                    feature: [
                        { name: "Add", slug: "add" },
                        { name: "Update", slug: "update" },
                        { name: "Delete", slug: "delete" },
                        { name: "View", slug: "view" },
                    ],
                },
                {
                    name: "Article Meta",
                    slug: "articlemeta",
                    feature: [
                        { name: "Add", slug: "add" },
                        { name: "Update", slug: "update" },
                        { name: "Delete", slug: "delete" },
                        { name: "View", slug: "view" },
                    ],
                },
                {
                    name: "Article",
                    slug: "article",
                    feature: [
                        { name: "Add", slug: "add" },
                        { name: "Update", slug: "update" },
                        { name: "Delete", slug: "delete" },
                        { name: "View", slug: "view" },
                        { name: "Approve", slug: "approve" },
                        { name: "Reject", slug: "reject" },
                        { name: "Assign", slug: "assign" },
                        { name: "Unassign", slug: "unassign" },
                        { name: "Change Status", slug: "changestatus" },
                    ],
                },
                {
                    name: "Task",
                    slug: "task",
                    feature: [
                        { name: "Add", slug: "add" },
                        { name: "Update", slug: "update" },
                        { name: "Delete", slug: "delete" },
                        { name: "View", slug: "view" },
                        { name: "Complete", slug: "complete" },
                        { name: "Done", slug: "done" },
                        { name: "Approve", slug: "approve" },
                        { name: "Reject", slug: "reject" },
                        { name: "Assign", slug: "assign" },
                        { name: "Unassign", slug: "unassign" },
                    ],
                },
                {
                    name: "Article Published",
                    slug: "articlepublished",
                    feature: [
                        { name: "Add", slug: "add" },
                        { name: "Update", slug: "update" },
                        { name: "Delete", slug: "delete" },
                        { name: "View", slug: "view" },
                        { name: "Assign", slug: "assign" },
                        { name: "Unassign", slug: "unassign" },
                        { name: "Change Status", slug: "changestatus" },
                    ],
                },
            ];

            const insertedPermissions = await Permission.insertMany(permissions);
            console.log("Permissions seeded successfully.");

            return insertedPermissions;
        } catch (error) {
            console.error("Error seeding permissions:", error);
            throw error;
        }
    }
}

module.exports = PermissionSeeder;

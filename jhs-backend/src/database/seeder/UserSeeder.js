const { User } = require('../../app/models/user');
const bcrypt = require('bcryptjs');

class UserSeeder {
    static async run() {
        try {
            const existingUsersCount = await User.countDocuments();

            // Early return if users are already seeded
            if (existingUsersCount > 0) {
                console.log("Users already seeded.");
                return;
            }

            const users = [
                {
                    first_name: "Shahbaz",
                    middle_name: "Bin",
                    last_name: "Tahir",
                    full_name: "Shahbaz Bin Tahir",
                    email: "shahbaz@onnmed.com",
                    password: await bcrypt.hash("Shahbaz@123", 12),
                    role: "administration"
                },
                {
                    first_name: "Anas",
                    last_name: "Abdullah",
                    full_name: "Anas Abdullah",
                    email: "anas@onnmed.com",
                    password: await bcrypt.hash("Anas@123", 12),
                    role: "administration"
                },
                {
                    first_name: "Ahmed",
                    last_name: "Hamdy",
                    full_name: "Ahmed Hamdy",
                    email: "ahmedhamdy@onnmed.com",
                    password: await bcrypt.hash("Ahmed@123", 12),
                    role: "administration"
                },
                {
                    first_name: "Muhammed",
                    last_name: "Elgemeie",
                    full_name: "Muhammed Elgemeie",
                    email: "muhammed@onnmed.com",
                    password: await bcrypt.hash("Muhammed@123", 12),
                    role: "administration"
                },
                {
                    first_name: "Ali",
                    last_name: "Raza",
                    full_name: "Ali Raza",
                    email: "ali@onnmed.com",
                    password: await bcrypt.hash("Ali@123", 12),
                    role: "admin"
                },
                {
                    first_name: "Hassan",
                    last_name: "Ajmal",
                    full_name: "Hassan Ajmal",
                    email: "hassan@onnmed.com",
                    password: await bcrypt.hash("Hassan@123", 12),
                    role: "employee"
                },
                {
                    first_name: "Umer",
                    last_name: "Ajmal",
                    full_name: "Umer Ajmal",
                    email: "umer@onnmed.com",
                    password: await bcrypt.hash("Umer@123", 12),
                    role: "editor"
                },
                {
                    first_name: "Ahmed",
                    last_name: "Ajmal",
                    full_name: "Ahmed Ajmal",
                    email: "ahmad@onnmed.com",
                    password: await bcrypt.hash("Ahmad@123", 12),
                    role: "editor"
                },
            ];

            for (const userData of users) {
                const user = new User(userData);
                await user.save();
            }

            console.log("Users seeded successfully.");

            return "Done";
        } catch (error) {
            console.error("Error seeding users:", error);
            throw error;
        }
    }
}

module.exports = UserSeeder;

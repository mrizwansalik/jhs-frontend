const catchAsync = require('../../app/utils/catchAsync');

const PermissionSeeder = require('./PermissionSeeder');
const RoleSeeder = require('./RoleSeeder');
const UserSeeder = require('./UserSeeder');
const AdministrationPermissionSeeder = require('./AdministrationPermissionSeeder');
const ArticleTypeSeeder = require('./ArticleTypeSeeder');
const DepartmentSeeder = require('./DepartmentSeeder');
const CompanySeeder = require('./CompanySeeder');
const JournalSeeder = require('./JournalSeeder');
const ArticleStatusSeeder = require('./ArticleStatusSeeder');
const ServicesSeeder = require('./ServicesSeeder');
const CategorySeeder = require('./CategorySeeder');

// add run database seed
exports.runSeed = catchAsync(async (req, res) => {
    // Run seeders in sequence
    await PermissionSeeder.run();
    await RoleSeeder.run();
    await UserSeeder.run();
    await DepartmentSeeder.run();
    await CompanySeeder.run();
    await JournalSeeder.run();
    await ArticleTypeSeeder.run();
    await ArticleStatusSeeder.run();
    await ServicesSeeder.run();
    await CategorySeeder.run();
    await AdministrationPermissionSeeder.run();

    return res.status(200).json({
        status: 'Success',
        message: 'DB Seed Added successfully',
    });
});

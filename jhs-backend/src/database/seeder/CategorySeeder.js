const { Category } = require('../../app/models/category');

class CategorySeeder {
    static async run() {
        try {
            const categoryCount = await Category.countDocuments();

            if (categoryCount === 0) {
                const categories = await Category.insertMany([
                    { name: 'Allergy and Immunology', description: 'Diagnosis and treatment of allergic and immune system disorders.' },
                    { name: 'Anaesthesia', description: 'Use of anaesthetic drugs to relieve pain during surgeries and other procedures.' },
                    { name: 'Cardiology', description: 'Medical specialty dealing with heart and blood vessel disorders.' },
                    { name: 'Community Medicine', description: 'Study and improvement of community health and preventive medicine.' },
                    { name: 'Critical Care and Intensive Care Unit', description: 'Specialized care for critically ill patients requiring intensive monitoring.' },
                    { name: 'Dentistry', description: 'Medical care focused on oral health, including teeth, gums, and mouth.' },
                    { name: 'Dermatology', description: 'Diagnosis and treatment of skin, hair, and nail conditions.' },
                    { name: 'Emergency Medicine and Critical Care', description: 'Immediate medical attention for urgent and critical conditions.' },
                    { name: 'Endocrinology', description: 'Treatment of hormone-related diseases, including diabetes and thyroid disorders.' },
                    { name: 'Epidemiology / Public Health', description: 'Study of disease distribution and health policy in populations.' },
                    { name: 'Family Medicine', description: 'Comprehensive healthcare for individuals and families across all ages and genders.' },
                    { name: 'Forensic Medicine', description: 'Application of medical knowledge to legal investigations.' },
                    { name: 'Gastroenterology', description: 'Study and treatment of digestive system disorders.' },
                    { name: 'General Medicine', description: 'Primary care and internal medicine, addressing a wide range of conditions.' },
                    { name: 'Geriatrics', description: 'Healthcare focused on elderly individuals and age-related conditions.' },
                    { name: 'Healthcare Administration', description: 'Management of healthcare systems and organizations.' },
                    { name: 'Hematology', description: 'Diagnosis and treatment of blood and blood-related disorders.' },
                    { name: 'Infectious Disease', description: 'Specialized care for infections caused by bacteria, viruses, and other pathogens.' },
                    { name: 'Internal Medicine', description: 'Medical specialty dealing with prevention, diagnosis, and treatment of adult diseases.' },
                    { name: 'Neurology', description: 'Diagnosis and treatment of nervous system disorders, including brain and spinal cord.' },
                    { name: 'Nursing', description: 'Healthcare profession focused on patient care and recovery.' },
                    { name: 'Obstetrics and Gynecology', description: 'Care for pregnant women and female reproductive health.' },
                    { name: 'Ophthalmology', description: 'Medical care for eye disorders and vision care.' },
                    { name: 'Orthopaedics', description: 'Diagnosis and treatment of musculoskeletal system disorders.' },
                    { name: 'Otolaryngology', description: 'Specialized care for ear, nose, and throat (ENT) conditions.' },
                    { name: 'Pediatrics', description: 'Medical care for infants, children, and adolescents.' },
                    { name: 'Physiotherapy and Rehabilitation', description: 'Restoring function and mobility through physical therapy and rehabilitation.' },
                    { name: 'Plastic Surgery', description: 'Surgical specialty involving reconstruction or alteration of the body.' },
                    { name: 'Psychiatry', description: 'Diagnosis and treatment of mental health disorders.' },
                    { name: 'Pulmonology', description: 'Medical specialty dealing with lung and respiratory system diseases.' },
                    { name: 'Radiology', description: 'Medical imaging for diagnosis and treatment using X-rays, MRIs, and CT scans.' },
                    { name: 'Rheumatology', description: 'Diagnosis and treatment of autoimmune and musculoskeletal diseases.' },
                    { name: 'Surgery', description: 'Medical specialty involving operative techniques to treat diseases or injuries.' },
                    { name: 'Urology', description: 'Specialized care for urinary tract and male reproductive system disorders.' }
                ]);

                console.log(`${categories.length} categories inserted successfully.`);
                return categories;
            } else {
                console.log('Categories already exist.');
                return;
            }
        } catch (error) {
            console.error('Error seeding categories:', error);
        }
    } // end function run
} // end class CategorySeeder

// export class
module.exports = CategorySeeder;
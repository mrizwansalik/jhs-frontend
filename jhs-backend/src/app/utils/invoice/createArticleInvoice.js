const { Services } = require('../../models/services/services');
const { Invoice } = require('../../models/invoice/invoice');
var moment = require('moment');

// Helper function to generate invoice HTML using custom template
exports.createArticleInvoice = async (article) => {
        let total = 0;
        let totalTax = 0;
        let grandtotal = 0;

        const services = [];

        if (article.isInvoiceCreated !== 1) {
                let service = await Services.findOne({ slug: "articleprocessing" });

                let amount = service.price;
                let tax_per_row = (1 + (service.tax / 100));
                let tax_amount = amount - (amount / tax_per_row);
                let total_amount = (amount / tax_per_row);
                let total_per_row = tax_amount + total_amount;

                services.push({
                        "title": service.title,
                        "description": service.description,
                        "price": total_amount,
                        "taxPercentage": service.tax,
                        "tax": tax_amount,
                        "total": total_per_row,
                })

                total += total_amount;
                totalTax += tax_amount
                grandtotal += total_per_row
        }

        if (article.languageCorrectionService === true && article.languageCorrectionServiceInvoice === false) {
                let service = await Services.findOne({ slug: "articlecorrection" });
                let amount = service.price;
                let tax_per_row = (1 + (service.tax / 100));
                let tax_amount = amount - (amount / tax_per_row);
                let total_amount = (amount / tax_per_row);
                let total_per_row = tax_amount + total_amount;

                services.push({
                        "title": service.title,
                        "description": service.description,
                        "price": total_amount,
                        "taxPercentage": service.tax,
                        "tax": tax_amount,
                        "total": total_per_row,
                })
                
                total += total_amount;
                totalTax += tax_amount;
                grandtotal += total_per_row;
        }

        if(article.length !== 0) {
                const invoiceData = {
                        invoiceNumber: moment().format('YYYYMMDD/kkmmssSSS'),
                        date: new Date(),
                        currency: 'sar',
                        taxNotation: 'vat',
                        services: services,
                        invoiceTermAndConditions: 'Payment is not refundable',
                        client: article._author,
                        total: total,
                        totalTax: totalTax,
                        grandTotal: grandtotal,
                }

                // create new Invoice object
                const invoice = new Invoice(invoiceData);
                // adding article in db using mongoes article Object
                const invoiceResult = await invoice.save();

                article.invoice.addToSet(invoiceResult);
                await article.save();
        } // end if 
}
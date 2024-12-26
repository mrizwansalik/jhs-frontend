const { encodeBase64 } = require('bcryptjs');
const { btoa } = require('buffer');
var easyinvoice = require('easyinvoice');
var fs = require('fs');

// Helper function to generate invoice HTML using custom template
exports.generateInvoiceHTML = async (invoice) => {
  const template = `

  <html>
  <head>
  <!--    <link rel="stylesheet" type="text/css" href="style.css">-->
  </head>
  <body>
  <style>
      @font-face {
          font-family: "Futura Md BT", sans-serif;
          font-weight: normal;
          font-style: normal;
  
      }
  
      @font-face {
          font-family: "Futura Md BT", sans-serif;
          font-weight: bold;
          font-style: normal;
      }

      @font-face {
          font-family: "Futura Md BT", sans-serif;
          font-weight: normal;
          font-style: italic;
      }
  
      @font-face {
          font-family: "Futura Md BT", sans-serif;
          font-weight: bold;
          font-style: italic;
      }
  
      body{
          font-family: "Futura Md BT", sans-serif;
          /*letter-spacing: 0.0mm !important;*/
          /*text-align: justify;*/
          /*font-kerning: auto;*/
          /*line-height: 80%;*/
      }
  
      table{
          width: 100%;
      }
  
      tr{
          line-height: 70%;
      }
  
      td{
          /*border: 1px black solid;*/
          font-size: x-small;
      }

      hr {
        border-top: 1px solid black;
      }

      #header-col-1{
          width: 39%;
      }
  
      #header-col-2 {
          width: 61%;
      }
  
      /*#header-col-3 {*/
      /*    width: 44%;*/
      /*}*/
  
      #logo-wrapper{
          vertical-align: top;
          text-align: left;
      }
  
      #logo{
          max-width: 200px;
          max-height: 75px;
      }
  
      #document-type-wrapper{
          text-align: right;
          line-height: 1.2;
          vertical-align: top;
      }
  
      #document-type{
          font-size: 20px;
      }
  
      #receiver-details-wrapper td{
          vertical-align: top;
      }
  
      #receiver-details-wrapper td:nth-child(2) {
          text-align: right;
      }
  
      #receiver-details-wrapper-col-1{
          width: 50%;
      }
  
      #receiver-details-wrapper-col-2{
          width: 35%;
      }
  
      #receiver-details-wrapper-col-3{
          width: 15%;
      }
  
      #services-table-col-1{
          width: 52%;
      }
  
      #services-table-col-2{
          width: 16%;
      }
  
      #services-table-col-3{
          width: 16%;
      }
  
      #services-table-col-4{
          width: 16%;
      }
  
      #services-table thead tr td:nth-child(2), #services-table thead tr td:nth-child(2) { {
          text-align: center;
      }
  
      #services-table thead tr td:nth-child(3), #services-table thead tr td:nth-child(3) {
          text-align: center;
      }
  
      #services-table tbody tr td:nth-child(3), #services-table tbody tr td:nth-child(4) {
          text-align: center;
      }
  
      #total-wrapper-col-1{
          width: 60%;
      }
  
      #total-wrapper-col-2{
          width: 24%;
      }
  
      #total-wrapper-col-3{
          width: 16%;
      }
  
      #total-wrapper td{
          text-align: right;
      }
  
      #bottom-notice-wrapper-col-1{
          width: 100%;
      }
  
      #bottom-notice-wrapper tbody tr td{
          text-align: center;
      }
  </style>
  <table id="header">
      <tr>
          <th id="header-col-1"></th>
          <th id="header-col-2"></th>
      </tr>
      <tr>
          <td id="logo-wrapper">

          </td>
          <td id="document-type-wrapper">
              
          </td>
      </tr>
  </table>
  <br/>
  <hr/>
  <table id="receiver-details-wrapper">
      <tr>
          <th id="receiver-details-wrapper-col-1"></th>
          <th id="receiver-details-wrapper-col-2"></th>
          <th id="receiver-details-wrapper-col-3"></th>
      </tr>
      <tr>
          <td>
              <b>QRCODE HERE</b>
          </td>
          <td id="details-label-wrapper">
              <b>Invoice Number</b><br/>
              <b>Invoice Date</b><br/>
              <b>Invoice Date</b><br/>
          </td>
          <td>
              ${invoice.invoiceNumber}<br/>
              ${invoice.date}<br/>
              ${invoice.client.full_name}<br/>
          </td>
      </tr>
  </table>
  <table id="services-table">
      <thead>
      <tr>
          <td><b>#</b></td>
          <td><b>Description</b></td>
          <td><b>Price</b></td>
          <td><b>Tax</b></td>
      </tr>
      <tr>
          <td colspan="3">
              <hr/>
          </td>
      </tr>
      </thead>
      <tbody>
      ${
        invoice.services.map((items, index) => {
            return `<tr>
              <td>${index+1}</td>
              <td>${items.description}</td>
              <td>${items.price}</td>
              <td>${items.tax}</td>
            </tr>`;
        })
      }
      </tbody>
      <tfoot>
      <tr>
          <td colspan="4">
              <hr/>
          </td>
      </tr>
      </tfoot>
  </table>
  <br/>
  <table id="total-wrapper">
      <thead>
      <tr>
          <th id="total-wrapper-col-1"></th>
          <th id="total-wrapper-col-2"></th>
          <th id="total-wrapper-col-3"></th>
      </tr>
      <tr>
          <td></td>
          <td><b>-</b></td>
          <td>-</td>
      </tr>
      </thead>
      <tbody>
      <tax>
          <tr>
              <td></td>
              <td><b>-</b></td>
              <td>-</td>
          </tr>
      </tax>
      </tbody>
      <tfoot>
      <tr>
          <td></td>
          <td colspan="2">
              <hr/>
          </td>
      </tr>
      <tr>
          <td></td>
          <td><b>-</b></td>
          <td>-</td>
      </tr>
      </tfoot>
  </table>
  <br/>
  <br/>
  <table id="bottom-notice-wrapper">
      <thead>
      <tr>
          <th id="bottom-notice-wrapper-col-1"></th>
      </tr>
      </thead>
      <tbody>
      <tr>
          <td>${invoice.invoiceTermAndConditions}</td>
      </tr>
      </tbody>
  </table>
  </body>
  </html>
          `;

  const data = {
    "images": {
      "background": "https://public.easyinvoice.cloud/pdf/sample-background.pdf"
    },
    customize: {
      // btoa === base64 encode
      template: btoa(template) // Your template must be base64 encoded
    },
    "settings": {
      "margin-top": 100,
      "margin-right": 50,
      "margin-left": 50,
      "margin-bottom": 25
    }
  };

  const result = await easyinvoice.createInvoice(data);
  const file = fs.writeFileSync("invoice.pdf", result.pdf, 'base64');
  return file;
}
/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': { view: 'pages/homepage' },
  'GET /BillLogin': 'UserLoginController.getLogin',
  'GET /ClientList': 'UserLoginController.getClientData',
  'POST /ClientList': 'UserLoginController.getClientData',
  'POST /Quotation': 'UserLoginController.generateQuotation',
  'GET /Quotation': 'UserLoginController.generateQuotation',
  'POST /DcEntry': 'UserLoginController.generateDc',
  'GET /DcEntry': 'UserLoginController.generateDc',
  'POST /DataSaveUrl': 'UserLoginController.gettingBillUrls',
  'GET /DataSaveUrl': 'UserLoginController.gettingBillUrls',
  'POST /SiteWork': 'UserLoginController.gettingSiteWork',
  'GET /SiteWork': 'UserLoginController.gettingSiteWork',
  'POST /Payment': 'UserLoginController.gettingPayment',
  'GET /Payment': 'UserLoginController.gettingPayment',
  'GET /PipeStock': 'UserLoginController.gettingStock',
  'POST /PipeStock': 'UserLoginController.gettingStock',
  'POST /Original': 'UserLoginController.gettingOriginal',
  'GET /Original': 'UserLoginController.gettingOriginal',
  'POST /Expense': 'UserLoginController.gettingExpance',
  'GET /Expense': 'UserLoginController.gettingExpance',
  'POST /Transport': 'UserLoginController.gettingTransport',
  'GET /Transport': 'UserLoginController.gettingTransport',
  'POST /AddSupplier': 'UserLoginController.getSupplierData',
  'GET /AddSupplier': 'UserLoginController.getSupplierData',
  'POST /Supplier': 'UserLoginController.gettingSupplier',
  'GET /Supplier': 'UserLoginController.gettingSupplier',
  'POST /UpdateSupplierBalance': 'UserLoginController.updateSupplierBalance',
  'POST /DeleteRecord': 'UserLoginController.deleteRecord',
  'POST /UpdateDcEntry': 'UserLoginController.updateDcEntry',
  'POST /UpdateBill': 'UserLoginController.updateBill',
  'GET /SelfPay': 'UserLoginController.selfPay',
  'POST /SelfPay': 'UserLoginController.selfPay',

  // Dashboard
  'GET /DashboardWidgets': 'UserLoginController.getDashboard',

  // Chatbot
  'POST /chat': 'ChatController.sendMessage',




  /***************************************************************************
  *                                                                          *
  * More custom routes here...                                               *
  * (See https://sailsjs.com/config/routes for examples.)                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the routes in this file, it   *
  * is matched against "shadow routes" (e.g. blueprint routes).  If it does  *
  * not match any of those, it is matched against static assets.             *
  *                                                                          *
  ***************************************************************************/


};

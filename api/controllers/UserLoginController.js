/**
 * UserLoginController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const loginUsers = require("../Services/loginUsers");

module.exports = {

    getLogin: async function (req, res) {
        sails.log.info("request received getLogin");
        try {
            var inputData = req.allParams();
            var result = await loginUsers.loginUser(inputData);
            res.send(result);
        } catch (err) {
            sails.log.error("Error in getImage:", err);
            res.status(400).send({ message: err.message || 'Server error' })
        }
    },
    getClientData: async function (req, res) {
        sails.log.info("request received getClientData");
        try {
            var inputData = req.allParams();
            var result = await loginUsers.addClientService(inputData);
            res.send(result);
        } catch (err) {
            sails.log.error("Error in getImage:", err);
            res.status(400).send({ message: err.message || 'Server error' })
        }
    },
    generateQuotation: async function (req, res) {
        sails.log.info("request received generateQuotation");
        try {
            var inputData = req.allParams();
            var result = await loginUsers.getQuotationService(inputData);
            res.send(result);
        } catch (err) {
            sails.log.error("Error in getImage:", err);
            res.status(400).send({ message: err.message || 'Server error' })
        }
    },
    generateDc: async function (req, res) {
        sails.log.info("request received generateDc");
        try {
            var inputData = req.allParams();
            var result = await loginUsers.getDcService(inputData);
            res.send(result);
        } catch (err) {
            sails.log.error("Error in generateDc:", err);
            res.status(400).send({ message: err.message || 'Failed to create DC/RC entry' });
        }
    },
    gettingClientData: async function (req, res) {
        sails.log.info("request received gettingClientData");
        try {
            var inputData = req.allParams();
            var result = await loginUsers.getClientDetails(inputData);
            res.send(result);
        } catch (err) {
            sails.log.error("Error in gettingClientData:", err);
            res.status(400).send({ message: err.message || 'Server error' })
        }
    },
    gettingQuotation: async function (req, res) {
        sails.log.info("request received gettingQuotation");
        try {
            var inputData = req.allParams();
            var result = await loginUsers.allQuotationService(inputData);
            res.send(result);
        } catch (err) {
            sails.log.error("Error in gettingQuotation:", err);
            res.status(400).send({ message: err.message || 'Server error' })
        }
    },
    gettingBillUrls: async function (req, res) {
        sails.log.info("request received gettingQuotation");
        try {
            var inputData = req.allParams();
            var result = await loginUsers.billingUrlService(inputData);
            res.send(result);
        } catch (err) {
            sails.log.error("Error in gettingBillUrls:", err);
            res.status(400).send({ message: err.message || 'Server error' })
        }
    },
    gettingSiteWork: async function (req, res) {
        sails.log.info("request received gettingSiteWork");
        try {
            var inputData = req.allParams();
            var result = await loginUsers.siteWorkDetails(inputData);
            res.send(result);
        } catch (err) {
            sails.log.error("Error in gettingSiteWork:", err);
            res.status(400).send({ message: err.message || 'Server error' })
        }
    },
    gettingPayment: async function (req, res) {
        sails.log.info("request received gettingPayment");
        try {
            var inputData = req.allParams();
            var result = await loginUsers.paymentDetails(inputData);
            res.send(result);
        } catch (err) {
            sails.log.error("Error in gettingPayment:", err);
            res.status(400).send({ message: err.message || 'Server error' })
        }
    },
    gettingStock: async function (req, res) {
        sails.log.info("request received gettingStock");
        try {
            var inputData = req.allParams();
            var result = await loginUsers.gettingStockService(inputData);
            res.send(result);
        } catch (err) {
            sails.log.error("Error in gettingStock:", err);
            res.status(400).send({ message: err.message || 'Server error' })
        }
    },
    gettingOriginal: async function (req, res) {
        sails.log.info("request received gettingOriginal");
        try {
            var inputData = req.allParams();
            var result = await loginUsers.gettingOriginalService(inputData);
            res.send(result);
        } catch (err) {
            sails.log.error("Error in gettingOriginal:", err);
            res.status(400).send({ message: err.message || 'Server error' })
        }
    },
    gettingExpance: async function (req, res) {
        sails.log.info("request received gettingExpance");
        try {
            var inputData = req.allParams();
            var result = await loginUsers.gettingExpanceService(inputData);
            res.send(result);
        } catch (err) {
            sails.log.error("Error in gettingExpance:", err);
            res.status(400).send({ message: err.message || 'Server error' })
        }
    },
    gettingTransport: async function (req, res) {
        sails.log.info("request received gettingTransport");
        try {
            var inputData = req.allParams();
            sails.log.info("Input data for gettingTransport:", inputData);
            var result = await loginUsers.gettingTransportService(inputData);
            res.send(result);
        } catch (err) {
            sails.log.error("Error in gettingTransport:", err);
            res.status(400).send({ message: err.message || 'Server error' })
        }
    },
    gettingSupplier: async function (req, res) {
        sails.log.info("request received gettingSupplier");
        try {
            var inputData = req.allParams();
            var result = await loginUsers.gettingSupplierService(inputData);
            res.send(result);
        } catch (err) {
            sails.log.error("Error in gettingSupplier:", err);
            res.status(400).send({ message: err.message || 'Server error' })
        }
    },
    getSupplierData: async function (req, res) {
        sails.log.info("request received getSupplierData");
        try {
            var inputData = req.allParams();
            var result = await loginUsers.getSupplierDetails(inputData);
            res.send(result);
        } catch (err) {
            sails.log.error("Error in getSupplierData:", err);
            res.status(400).send({ message: err.message || 'Server error' })
        }
    },
    updateSupplierBalance: async function (req, res) {
        sails.log.info("request received updateSupplierBalance");
        try {
            var inputData = req.allParams();
            var result = await loginUsers.updateSupplierBalanceService(inputData);
            res.send(result);
        } catch (err) {
            sails.log.error("Error in updateSupplierBalance:", err);
            res.status(400).send({ message: err.message || 'Server error' })
        }
    },
    deleteRecord: async function (req, res) {
        sails.log.info("request received deleteRecord");
        try {
            var inputData = req.allParams();
            var result = await loginUsers.deleteRecordService(inputData);
            res.send(result);
        } catch (err) {
            sails.log.error("Error in deleteRecord:", err);
            res.status(400).send({ message: err.message || 'Server error' })
        }
    },
    updateBill: async function (req, res) {
        sails.log.info("request received updateBill");
        try {
            var inputData = req.allParams();
            var result = await loginUsers.updateBillingUrlService(inputData);
            res.send(result);
        } catch (err) {
            sails.log.error("Error in updateBill:", err);
            res.status(400).send({ message: err.message || 'Server error' })
        }
    },
    selfPay: async function (req, res) {
        sails.log.info("request received selfPay");
        try {
            var inputData = req.allParams();
            var result = await loginUsers.selfPayService(inputData);
            res.send(result);
        } catch (err) {
            sails.log.error("Error in selfPay:", err);
            res.status(400).send({ message: err.message || 'Server error' })
        }
    },
    getDashboard: async function (req, res) {
        sails.log.info("request received getDashboard");
        try {
            var result = await loginUsers.getDashboardWidgetsService();
            res.send(result);
        } catch (err) {
            sails.log.error("Error in getDashboard:", err);
            res.status(400).send({ message: err.message || 'Server error' })
        }
    },
    updateDcEntry: async function (req, res) {
        sails.log.info("request received updateDcEntry");
        try {
            var inputData = req.allParams();
            var result = await loginUsers.updateDcEntryService(inputData);
            res.send(result);
        } catch (err) {
            sails.log.error("Error in updateDcEntry:", err);
            res.status(400).send({ message: err.message || 'Server error' })
        }
    },
};


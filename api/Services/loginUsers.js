const axios = require('axios');

module.exports = {

    loginUser: async function (inputData) {
        sails.log.info("loginUser service called", inputData);
        try {
            let userToLogin = await BillLogin.find({
                status: 'active',
            });
            return userToLogin;
        } catch (err) {
            sails.log.error(err);
            throw err;
        }
    },
    allQuotationService: async function (inputData) {
        sails.log.info("allQuotationService called", inputData);
        try {
            let allQuotations = await Quotation.find({});
            return allQuotations;
        } catch (err) {
            sails.log.error(err);
            throw err;
        }
    },
    getClientDetails: async function (inputData) {
        sails.log.info("getClientDetails service called", inputData);
        try {
            if (!inputData) return;
            let clientDataaas = await ClientList.find({
                clientId: inputData.clientFindId,
            });
            return clientDataaas;
        } catch (err) {
            sails.log.error(err);
            throw err;
        }
    },
    getQuotationService: async function (inputData) {
        sails.log.info("getQuotationService service called", inputData);
        try {
            if (!inputData || Object.keys(inputData).length === 0) {
                sails.log.info("GET request detected → returning all clients");
                let allClients = await Quotation.find();
                return allClients;
            }
            let findClient = await ClientList.find({
                clientId: inputData.clientID,
            })
            if (findClient.length === 1) {
                let formData = {}
                formData.date = inputData.date;
                formData.constructionName = inputData.constructionName;
                formData.clientId = inputData.clientID;
                formData.ApArea = inputData.ApArea;
                formData.ApSoft = inputData.ApSoft;
                formData.value = inputData.value;
                formData.runningSqft = inputData.runningSqft;
                formData.productType = inputData.productType;
                formData.client = findClient[0].id
                sails.log.info("formData:", formData);

                let addQuotation = await Quotation.create(formData).fetch();
                let updateClient = await ClientList.find({
                    clientId: inputData.clientID,
                })
                updateClient[0].quotations.push(addQuotation.id);
                let updatedClientDetails = await ClientList.updateOne({ clientId: inputData.clientID }).set({
                    quotations: updateClient[0].quotations
                })
            }
            let findClientDetails = await ClientList.find({
                clientId: inputData.clientID,
            })
            return findClientDetails;
        } catch (err) {
            sails.log.error(err);
            throw err;
        }
    },
    getDcService: async function (inputData) {
        sails.log.info("getDcService service called", inputData);
        try {
            if (!inputData || Object.keys(inputData).length === 0) {
                sails.log.info("GET request detected → returning all DcEntries");
                let allClients = await DcEntry.find().sort('date ASC');
                return allClients;
            }
            let dcGenerate = await ClientList.find({
                clientId: inputData.clientID,
            });
            if (dcGenerate) {
                await EmailService.sendDcMail(inputData);
            }
            if (dcGenerate.length === 1) {

                // RC validation: restrict return qty to total DC qty per product for this client
                if (inputData.varient === 'RC') {
                    const allEntries = await DcEntry.find({ clientId: inputData.clientID });
                    const sentMap = {};
                    const returnedMap = {};
                    for (const entry of allEntries) {
                        if (Array.isArray(entry.product) && Array.isArray(entry.Quantity)) {
                            entry.product.forEach((prod, i) => {
                                const qty = Number(entry.Quantity[i]) || 0;
                                if (entry.varientName === 'DC') {
                                    sentMap[prod] = (sentMap[prod] || 0) + qty;
                                } else if (entry.varientName === 'RC') {
                                    returnedMap[prod] = (returnedMap[prod] || 0) + qty;
                                }
                            });
                        }
                    }
                    const errors = [];
                    for (let i = 0; i < inputData.product.length; i++) {
                        const prod = inputData.product[i];
                        const qty = Number(inputData.quantity[i]) || 0;
                        const totalDC = sentMap[prod] || 0;
                        const alreadyReturned = returnedMap[prod] || 0;
                        const available = totalDC - alreadyReturned;
                        if (qty > available) {
                            errors.push(`${prod}: only ${available} available to return, you entered ${qty}`);
                        }
                    }
                    if (errors.length > 0) {
                        throw new Error('Return exceeds DC quantity: ' + errors.join('; '));
                    }
                }

                let formData = {}
                formData.date = inputData.date;
                formData.varientName = inputData.varient;
                formData.clientId = inputData.clientID;
                formData.name = inputData.constructionName;
                formData.product = inputData.product;
                formData.Quantity = inputData.quantity;
                formData.ActualDcNumber = inputData.actualDcNumber;
                formData.vehicleNumber = inputData.vehicle;
                formData.DcNumber = inputData.dcNumber;
                formData.client = dcGenerate[0].id
                sails.log.info("formData:", formData);

                let addDcEntery = await DcEntry.create(formData).fetch();
                let updateDcEntry = await ClientList.find({
                    clientId: inputData.clientID,
                })
                updateDcEntry[0].dcVarient.push(addDcEntery.id);
                let updatedClientDetails = await ClientList.updateOne({ clientId: inputData.clientID }).set({
                    dcVarient: updateDcEntry[0].dcVarient
                }).fetch();
            }
            let findDcClient = await ClientList.find({
                status: 'active'
            })
            return findDcClient;
        } catch (err) {
            sails.log.error(err);
            throw err;
        }
    },
    addClientService: async function (inputData) {
        sails.log.info("addClientService service called", inputData);
        try {
            if (!inputData || Object.keys(inputData).length === 0) {
                sails.log.info("GET request detected → returning all clients");
                let allClients = await ClientList.find().sort('clientId ASC');
                return allClients;
            }
            if (!inputData) return;
            let clientDatas = await ClientList.find({
                uniqueId: inputData.uniqueId
            });
            if (clientDatas.length > 0) {
                let formData = {}
                formData.name = inputData.name;
                formData.clientId = inputData.clientId;
                formData.uniqueId = inputData.uniqueId;
                formData.phone = inputData.phone;
                formData.company = inputData.company;
                formData.address = inputData.address;
                formData.status = "active";
                sails.log.info("formData:", formData);

                let addClientn = await ClientList.create(formData).fetch();
            }
            let clientFilter = await ClientList.find({
                uniqueId: inputData.uniqueId,
                status: 'active'
            });
            return clientFilter;
        } catch (err) {
            sails.log.error(err);
            throw err;
        }
    },
    billingUrlService: async function (inputData) {
        sails.log.info("billingUrlService called", inputData);
        try {
            if (!inputData || Object.keys(inputData).length === 0) {
                sails.log.info("GET request detected → returning all billing URLs");
                let allBillingUrls = await DataSaveUrl.find();
                return allBillingUrls;
            }
            let billGenerateClient = await ClientList.find({
                clientId: inputData.clientID,
            });
            if (billGenerateClient) {
                await EmailService.sendBillMail(inputData);
            }
            if (billGenerateClient.length == 1) {
                let formData = {}
                formData.billingType = inputData.billType;
                formData.date = inputData.date;
                formData.constructionName = inputData.constructionName;
                formData.clientId = inputData.clientID;
                formData.Amount = inputData.Amount;
                formData.url = inputData.billUrl;
                formData.approximateArea = inputData.approximateArea;
                formData.runningSqft = inputData.runningSqft;
                formData.approximateSoft = inputData.approximateSoft;
                formData.fromDate = inputData.fromDate;
                formData.toDate = inputData.toDate;
                formData.billNum = inputData.billNumber;
                formData.BillNoteNumber = inputData.billNoteNumber;
                formData.status = "active";
                formData.client = billGenerateClient[0].id
                let addBillingUrl = await DataSaveUrl.create(formData).fetch();
                let updateBilling = await ClientList.find({
                    clientId: inputData.clientID,
                })
                updateBilling[0].billing.push(addBillingUrl.id);
                let updatedClientDetails = await ClientList.updateOne({ clientId: inputData.clientID }).set({
                    billing: updateBilling[0].billing
                })
            }
            let billingUrls = await DataSaveUrl.find({
                status: 'active',
            });
            sails.log.info("billingUrls:", billingUrls);
            return billingUrls;
        } catch (err) {
            sails.log.error(err);
            throw err;
        }
    },
    updateBillingUrlService: async function (inputData) {
        sails.log.info("updateBillingUrlService called", inputData);
        try {
            const { id, billType, date, constructionName, clientId, Amount, approximateArea, runningSqft, approximateSoft, fromDate, toDate, billNum, billNoteNumber } = inputData;
            if (!id) {
                throw new Error("id is required to update a bill record.");
            }
            let updateData = {};
            if (billType !== undefined) updateData.billingType = billType;
            if (date !== undefined) updateData.date = date;
            if (constructionName !== undefined) updateData.constructionName = constructionName;
            if (clientId !== undefined) updateData.clientId = clientId;
            if (Amount !== undefined) updateData.Amount = Amount;
            if (approximateArea !== undefined) updateData.approximateArea = approximateArea;
            if (runningSqft !== undefined) updateData.runningSqft = runningSqft;
            if (approximateSoft !== undefined) updateData.approximateSoft = approximateSoft;
            if (fromDate !== undefined) updateData.fromDate = fromDate;
            if (toDate !== undefined) updateData.toDate = toDate;
            if (billNum !== undefined) updateData.billNum = billNum;
            if (billNoteNumber !== undefined) updateData.BillNoteNumber = billNoteNumber;
            const updated = await DataSaveUrl.updateOne({ id }).set(updateData);
            sails.log.info(`Updated DataSaveUrl ${id}`, updated);
            return updated;
        } catch (err) {
            sails.log.error(err);
            throw err;
        }
    },
    siteWorkDetails: async function (inputData) {
        sails.log.info("siteWorkDetails service called", inputData);
        try {
            if (!inputData || Object.keys(inputData).length === 0) {
                sails.log.info("GET request detected → returning all site work details");
                let allSiteWork = await SiteWork.find();
                return allSiteWork;
            }
            let siteDetail = await ClientList.find({
                clientId: inputData.clientID,
            });
            if (siteDetail.length === 1) {
                let formData = {}
                formData.date = inputData.date;
                formData.constructionName = inputData.constructionName;
                formData.clientId = inputData.clientID;
                formData.place = inputData.siteAddress;
                formData.workDetails = inputData.workDetail;
                formData.status = 'active';
                formData.client = siteDetail[0].id
                sails.log.info("formData:", formData);

                let addSiteWork = await SiteWork.create(formData).fetch();
                let updateSiteWork = await ClientList.find({
                    clientId: inputData.clientID,
                })
                updateSiteWork[0].siteWorkList.push(addSiteWork.id);
                let updatedClientDetails = await ClientList.updateOne({ clientId: inputData.clientID }).set({
                    siteWorkList: updateSiteWork[0].siteWorkList
                })
            }
            let siteWorkGet = await ClientList.find({
                status: 'active'
            })
            return siteWorkGet;
        } catch (err) {
            sails.log.error(err);
            throw err;
        }
    },
    paymentDetails: async function (inputData) {
        sails.log.info("paymentDetails service called", inputData);
        try {
            if (!inputData || Object.keys(inputData).length === 0) {
                sails.log.info("GET request detected → returning all payment details");
                let payment = await Payment.find();
                return payment;
            }
            let isPayment = await ClientList.find({
                clientId: inputData.clientID,
            });
            if (isPayment) {
                await EmailService.sendPaymentMail(inputData);
            }
            if (isPayment.length === 1) {
                let formData = {}
                formData.date = inputData.date;
                formData.constructionName = inputData.constructionName;
                formData.clientId = inputData.clientID;
                formData.method = inputData.Method;
                // Normalize Amount for Payment (store as string for the Payment model)
                let payAmount = inputData.Amount;
                if (Array.isArray(payAmount)) {
                    payAmount = payAmount.reduce((s, v) => s + (Number(v) || 0), 0);
                } else {
                    payAmount = Number(payAmount) || 0;
                }
                formData.amount = String(payAmount);
                formData.status = 'active';
                formData.client = isPayment[0].id
                sails.log.info("formData:", formData);

                let addPayment = await Payment.create(formData).fetch();
                let updatePayment = await ClientList.find({
                    clientId: inputData.clientID,
                })
                updatePayment[0].payment.push(addPayment.id);
                let updatedClientDetails = await ClientList.updateOne({ clientId: inputData.clientID }).set({
                    payment: updatePayment[0].payment
                })
                const mailBody = `
Payment Confirmation

Date           : ${inputData.date}
Client ID      : ${inputData.clientID}
Construction   : ${inputData.constructionName}
Payment Method : ${inputData.Method}
Amount         : ₹${payAmount}

Thank you for your payment.
`;

                try {
                    await axios.post('http://127.0.0.1:5001/send-mail', {
                        to: isPayment[0].email,   // make sure email exists in ClientList
                        subject: 'Payment Confirmation',
                        body: mailBody
                    });
                    sails.log.info("Payment mail sent successfully");
                } catch (mailErr) {
                    sails.log.error("Mail sending failed:", mailErr);
                    // ❗ Do NOT throw error – payment is already saved
                }
            }
            // }
            let paymentGet = await ClientList.find({
                status: 'active'
            })
            sails.log.info("paymentGet:", paymentGet);
            return paymentGet;
        } catch (err) {
            sails.log.error(err);
            throw err;
        }
    },

    gettingStockService: async function (inputData) {
        sails.log.info("gettingStockService called", inputData);
        try {
            // Fetch stock for UI
            const stockDetails = await PipeStock.find({
                status: 'Active',
            });
            // Only update stock when clientID exists
            if (inputData.clientID) {
                const isproduct = await ClientList.find({
                    clientId: inputData.clientID,
                });
                if (isproduct.length === 1) {
                    const { product, quantity, varient } = inputData;
                    if (!Array.isArray(product) || product.length === 0 || !Array.isArray(quantity) || quantity.length === 0) {
                        sails.log.info('No PipeStock update required: regular product list empty');
                    } else {
                        // NOTE: Validation already done in getDcService.
                        // Re-validating here would include the just-created RC entry
                        // and falsely reject valid returns.

                        // LOOP because product & quantity are arrays
                        for (let i = 0; i < product.length; i++) {
                            const itemCode = product[i];
                            const qty = Number(quantity[i]) || 0;
                            const allStock = await PipeStock.find();
                            const stock = allStock.find(s => s.item_code.toLowerCase() === String(itemCode).toLowerCase());
                            if (!stock) {
                                throw new Error(`Stock item not found: ${itemCode}`);
                            }
                            let updatedQty = stock.quantity;
                            if (['RC', 'Purchase'].includes(varient)) {
                                updatedQty += qty;
                            }
                            if (['DC', 'Rent'].includes(varient)) {
                                updatedQty -= qty;
                            }
                            if (updatedQty < 0) {
                                throw new Error(`Insufficient stock for ${itemCode}`);
                            }
                            await PipeStock.updateOne({ id: stock.id })
                                .set({ quantity: updatedQty });
                            sails.log.info(`Stock updated → ${itemCode}: ${updatedQty}`);
                        }
                    }
                }
            }
            return stockDetails;
        } catch (err) {
            sails.log.error(err);
            throw err;
        }
    },
    gettingOriginalService: async function (inputData) {
        sails.log.info("gettingOriginalService service called", inputData);
        try {
            if (!inputData || Object.keys(inputData).length === 0) {
                sails.log.info("GET request detected → returning all gettingOriginalService");
                let allSiteWork = await Original.find();
                return allSiteWork;
            }

            // Support filtered GET via query params (e.g. ?transaction_type=RENT&status=Active)
            if (inputData._method === 'GET' || inputData.filterOnly) {
                var filter = {};
                if (inputData.transaction_type) filter.transaction_type = inputData.transaction_type;
                if (inputData.status) filter.status = inputData.status;
                var results = await Original.find(filter);
                return results;
            }

            if (inputData.clientId === "Arun2002") {
                let formData = {}
                formData.date = inputData.date;
                formData.clientId = inputData.clientId;
                formData.pipe = inputData.pipe;
                formData.quantity = inputData.quantity;
                formData.status = 'Active';
                formData.name = inputData.transaction_type === 'RETURN' ? inputData.name : inputData.rentName || inputData.name;
                formData.transaction_type = inputData.transaction_type;
                sails.log.info("formData:", formData);

                // If RETURN and originalId provided, mark original as Inactive
                if (inputData.transaction_type === 'RETURN' && inputData.originalId) {
                    await Original.updateOne({ id: inputData.originalId }).set({ status: 'Inactive' });
                    sails.log.info(`Original RENT record ${inputData.originalId} marked as Inactive`);
                }

                let addSiteWork = await Original.create(formData).fetch();

                // Find the pipe stock record
                let pipeStock = await PipeStock.findOne({
                    item_code: inputData.pipe
                });
                if (pipeStock) {
                    let newQty = inputData.transaction_type === 'RETURN'
                        ? pipeStock.quantity - inputData.quantity
                        : pipeStock.quantity + inputData.quantity;
                    let updatedStock = await PipeStock.updateOne({
                        item_code: inputData.pipe
                    }).set({
                        quantity: newQty
                    });
                    sails.log.info(`Stock updated → ${inputData.pipe}: ${newQty} (${inputData.transaction_type})`);
                } else {
                    sails.log.warn("Pipe not found");
                }

                // Return the created record instead of client list
                return addSiteWork;
            }

            let siteWorkGet = await ClientList.find({
                status: 'active'
            })
            return siteWorkGet;
        } catch (err) {
            sails.log.error(err);
            throw err;
        }
    },
    gettingExpanceService: async function (inputData) {
        try {
            if (!inputData || Object.keys(inputData).length === 0) {
                sails.log.info("GET request detected → returning all Expance details");
                let expense = await Expense.find();
                return expense;
            }
            // Example: Insert the stock data into the SiteStock model
            const createdStock = await Expense.create({
                name: inputData.name,
                date: inputData.date,
                amount: inputData.amount,
                category: inputData.category,
                status: 'Active'
            }).fetch();

            return createdStock;
        } catch (err) {
            sails.log.error("Error in gettingExpanceService:", err);
            throw err;
        }
    },
    gettingTransportService: async function (inputData) {
        sails.log.info("gettingTransportService called", inputData);
        try {
            if (!inputData || Object.keys(inputData).length === 0) {
                sails.log.info("GET request detected → returning all Transport details");
                let transport = await Transport.find();
                return transport;
            }
            // Example: Insert the stock data into the SiteStock model
            const createdStock = await Transport.create({
                name: inputData.name,
                date: inputData.date,
                vehicleNumber: inputData.vehicleNumber,
                description: inputData.description,
                amount: inputData.amount
            }).fetch();
            sails.log.info("Created Transport record:", createdStock);
            return createdStock;
        } catch (err) {
            sails.log.error("Error in gettingTransportService:", err);
            throw err;
        }
    },
    gettingSupplierService: async function (inputData) {
        try {
            if (!inputData || Object.keys(inputData).length === 0) {
                sails.log.info("GET request detected → returning all Supplier details");
                let supplier = await Supplier.find();
                return supplier;
            }
            // Example: Insert the stock data into the SiteStock model
            const createdStock = await Supplier.create({
                name: inputData.name,
                clientId: inputData.clientId,
                date: inputData.date,
                product: inputData.product,
                quantity: inputData.quantity,
                amount: inputData.amount,
                advancePaid: inputData.advancePaid,
                status: 'Active'
            }).fetch();

            // Find the associated AddSupplier parent record
            let parentSupplier = await AddSupplier.findOne({
                clientId: inputData.clientId
            });

            if (parentSupplier) {
                // Initialize array if it doesn't exist
                let productsArray = parentSupplier.products || [];
                productsArray.push(createdStock.id);

                // Update the AddSupplier record
                await AddSupplier.updateOne({ clientId: inputData.clientId }).set({
                    products: productsArray
                });
                sails.log.info(`Pushed Supplier ID ${createdStock.id} to AddSupplier products array for ${inputData.clientId}`);
            } else {
                sails.log.warn(`No AddSupplier found with clientId ${inputData.clientId} to associate with new Supplier record.`);
            }

            return createdStock;
        } catch (err) {
            sails.log.error("Error in gettingSupplierService:", err);
            throw err;
        }
    },
    getSupplierDetails: async function (inputData) {
        sails.log.info("getSupplierDetails service called", inputData);
        try {
            // GET request (no data) -> return all suppliers
            if (!inputData || Object.keys(inputData).length === 0) {
                sails.log.info("GET request detected → returning all suppliers");
                let allSuppliers = await AddSupplier.find();
                return allSuppliers;
            }

            // POST request -> Create new supplier
            if (inputData.name && inputData.clientId) {
                let formData = {
                    name: inputData.name,
                    clientId: inputData.clientId,
                    phone: inputData.phone || '',
                    company: inputData.company || '',
                    address: inputData.address || '',
                    status: inputData.status || 'Active'
                };
                sails.log.info("Creating AddSupplier formData:", formData);
                await AddSupplier.create(formData).fetch();
            }

            // Return active or newly added suppliers
            let supplierFilter = await AddSupplier.find({
                status: 'active'
            });
            return supplierFilter;
        } catch (err) {
            sails.log.error(err);
            throw err;
        }
    },
    updateSupplierBalanceService: async function (inputData) {
        sails.log.info("updateSupplierBalanceService called", inputData);
        try {
            if (!inputData.id || !inputData.paymentAmount) {
                throw new Error("Missing required parameters: id and paymentAmount");
            }
            
            const supplierRecord = await Supplier.findOne({ id: inputData.id });
            if (!supplierRecord) {
                throw new Error("Supplier record not found");
            }

            const currentAdvance = Number(supplierRecord.advancePaid || 0);
            const newAdvance = currentAdvance + Number(inputData.paymentAmount);

            const updatedRecord = await Supplier.updateOne({ id: inputData.id }).set({
                advancePaid: String(newAdvance)
            });

            sails.log.info(`Updated Supplier ID ${inputData.id} advancePaid to ${newAdvance}`);
            return updatedRecord;
        } catch (err) {
            sails.log.error(err);
            throw err;
        }
    },
    deleteRecordService: async function (inputData) {
        sails.log.info("deleteRecordService called", inputData);
        try {
            const { modelName, id } = inputData;
            if (!modelName || !id) {
                throw new Error("modelName and id are required to delete a record.");
            }

            // Special handling for DcEntry — reverse PipeStock impact on delete
            if (modelName === 'DcEntry') {
                const entry = await DcEntry.findOne({ id: id });
                if (!entry) throw new Error('DcEntry not found');

                if (Array.isArray(entry.product) && Array.isArray(entry.Quantity)) {
                    for (let i = 0; i < entry.product.length; i++) {
                        const itemCode = entry.product[i];
                        const qty = Number(entry.Quantity[i]) || 0;
                        if (qty <= 0) continue;

                        const stock = await PipeStock.findOne({ item_code: itemCode });
                        if (!stock) continue;

                        let newQty = stock.quantity;
                        if (entry.varientName === 'DC') {
                            newQty += qty;
                        } else if (entry.varientName === 'RC') {
                            newQty -= qty;
                        }

                        await PipeStock.updateOne({ id: stock.id }).set({ quantity: newQty });
                        sails.log.info(`[Delete DcEntry] ${itemCode}: ${stock.quantity} → ${newQty} (${entry.varientName} reversed)`);
                    }
                }

                const deleted = await DcEntry.destroy({ id: id }).fetch();
                sails.log.info(`DcEntry ${id} deleted with PipeStock reversal`);
                return deleted;
            }

            const model = sails.models[modelName.toLowerCase()];
            if (!model) {
                throw new Error(`Invalid model name: ${modelName}`);
            }
            const deleted = await model.destroy({ id: id }).fetch();
            sails.log.info(`Successfully deleted record from ${modelName} with id ${id}`);
            return deleted;
        } catch (err) {
            sails.log.error(err);
            throw err;
        }
    },
    updateDcEntryService: async function (inputData) {
        sails.log.info("updateDcEntryService called", inputData);
        try {
            const { id, date, DcNumber, ActualDcNumber, vehicleNumber, name, clientId, product, Quantity } = inputData;
            if (!id) throw new Error("id is required to update DcEntry.");

            const oldEntry = await DcEntry.findOne({ id: id });
            if (!oldEntry) throw new Error('DcEntry not found');

            const varientName = oldEntry.varientName;
            const oldProducts = oldEntry.product || [];
            const oldQuantities = (oldEntry.Quantity || []).map(Number);
            const newProducts = product || [];
            const newQuantities = (Quantity || []).map(Number);

            const oldMap = {};
            oldProducts.forEach((p, i) => { oldMap[p] = (oldMap[p] || 0) + (oldQuantities[i] || 0); });

            const newMap = {};
            newProducts.forEach((p, i) => { newMap[p] = (newMap[p] || 0) + (newQuantities[i] || 0); });

            const allProducts = [...new Set([...Object.keys(oldMap), ...Object.keys(newMap)])];

            for (const prod of allProducts) {
                const oldQty = oldMap[prod] || 0;
                const newQty = newMap[prod] || 0;
                if (oldQty === newQty) continue;

                const stock = await PipeStock.findOne({ item_code: prod });
                if (!stock) {
                    sails.log.warn(`[Update DcEntry] PipeStock not found for ${prod}, skipping stock update`);
                    continue;
                }

                let updatedQty = stock.quantity;

                if (varientName === 'DC') {
                    updatedQty += oldQty;
                    updatedQty -= newQty;
                } else if (varientName === 'RC') {
                    updatedQty -= oldQty;
                    updatedQty += newQty;
                }

                if (updatedQty < 0) {
                    throw new Error(`Insufficient stock for ${prod}. Available: ${stock.quantity}, need: ${updatedQty}`);
                }

                await PipeStock.updateOne({ id: stock.id }).set({ quantity: updatedQty });
                sails.log.info(`[Update DcEntry] ${prod}: ${stock.quantity} → ${updatedQty} (${varientName})`);
            }

            const updateData = {};
            if (date !== undefined) updateData.date = date;
            if (DcNumber !== undefined) updateData.DcNumber = DcNumber;
            if (ActualDcNumber !== undefined) updateData.ActualDcNumber = ActualDcNumber;
            if (vehicleNumber !== undefined) updateData.vehicleNumber = vehicleNumber;
            if (name !== undefined) updateData.name = name;
            if (clientId !== undefined) updateData.clientId = clientId;
            if (product !== undefined) updateData.product = product;
            if (Quantity !== undefined) updateData.Quantity = Quantity;

            const updated = await DcEntry.updateOne({ id: id }).set(updateData);
            sails.log.info(`DcEntry ${id} updated successfully`);
            return updated;
        } catch (err) {
            sails.log.error(err);
            throw err;
        }
    },
    selfPayService: async function (inputData) {
        sails.log.info("selfPayService called", inputData);
        try {
            if (!inputData || Object.keys(inputData).length === 0) {
                sails.log.info("GET request detected → returning all SelfPay entries");
                let entries = await SelfPay.find();
                return entries;
            }
            const created = await SelfPay.create({
                name: inputData.name,
                amount: Number(inputData.amount),
                date: inputData.date,
                status: 'Active'
            }).fetch();
            return created;
        } catch (err) {
            sails.log.error("Error in selfPayService:", err);
            throw err;
        }
    },

    getDashboardWidgetsService: async function () {
        try {
            // 1. Total Stock Value
            const pipeStocks = await PipeStock.find({ status: 'Active' });
            const totalStockQty = pipeStocks.reduce((sum, s) => sum + (Number(s.quantity) || 0), 0);

            // 2. Total Pending Returns (DC - RC per product)
            const allDcEntries = await DcEntry.find();
            const dcMap = {};
            const rcMap = {};
            allDcEntries.forEach(entry => {
                const products = Array.isArray(entry.product) ? entry.product : [entry.product];
                const quantities = Array.isArray(entry.Quantity) ? entry.Quantity : [entry.Quantity];
                products.forEach((p, i) => {
                    const qty = Number(quantities[i]) || 0;
                    if (entry.varientName === 'DC') dcMap[p] = (dcMap[p] || 0) + qty;
                    if (entry.varientName === 'RC') rcMap[p] = (rcMap[p] || 0) + qty;
                });
            });
            let totalPendingReturns = 0;
            Object.keys(dcMap).forEach(p => {
                const pending = (dcMap[p] || 0) - (rcMap[p] || 0);
                if (pending > 0) totalPendingReturns += pending;
            });

            // 3. Today's DCs
            const today = new Date();
            const todayStr = today.toISOString().split('T')[0];
            const todayDCs = allDcEntries.filter(e =>
                e.varientName === 'DC' && e.date === todayStr
            ).length;

            // 4. Monthly Revenue (from Payments)
            const allPayments = await Payment.find();
            const currentMonth = today.getMonth();
            const currentYear = today.getFullYear();
            let monthlyRevenue = 0;
            allPayments.forEach(p => {
                if (p.date) {
                    const pd = new Date(p.date);
                    if (!isNaN(pd.getTime()) && pd.getMonth() === currentMonth && pd.getFullYear() === currentYear) {
                        monthlyRevenue += Number(p.amount) || 0;
                    }
                }
            });

            return {
                totalStockQty,
                totalPendingReturns,
                todayDCs,
                monthlyRevenue
            };
        } catch (err) {
            sails.log.error("Error in getDashboardWidgetsService:", err);
            throw err;
        }
    },
}
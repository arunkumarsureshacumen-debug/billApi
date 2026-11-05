/**
 * DataSaveUrl.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

    //  ╔═╗╦═╗╦╔╦╗╦╔╦╗╦╦  ╦╔═╗╔═╗
    //  ╠═╝╠╦╝║║║║║ ║ ║╚╗╔╝║╣ ╚═╗
    //  ╩  ╩╚═╩╩ ╩╩ ╩ ╩ ╚╝ ╚═╝╚═╝


    //  ╔═╗╔╦╗╔╗ ╔═╗╔╦╗╔═╗
    //  ║╣ ║║║╠╩╗║╣  ║║╚═╗
    //  ╚═╝╩ ╩╚═╝╚═╝═╩╝╚═╝


    //  ╔═╗╔═╗╔═╗╔═╗╔═╗╦╔═╗╔╦╗╦╔═╗╔╗╔╔═╗
    //  ╠═╣╚═╗╚═╗║ ║║  ║╠═╣ ║ ║║ ║║║║╚═╗
    //  ╩ ╩╚═╝╚═╝╚═╝╚═╝╩╩ ╩ ╩ ╩╚═╝╝╚╝╚═╝
    billingType: {
      type: 'string'
    },
    date: {
      type: 'string'
    },
    constructionName: {
      type: 'string'
    },
    clientId: {
      type: 'string'
    },
    Amount: {
      type: 'json'
    },
    url: {
      type: 'string',
    },
        approximateArea: {
      type: 'json'
    },
       runningSqft: {
      type: 'json'
    },
       approximateSoft: {
      type: 'json'
    },
    fromDate:{
      type: 'string'
    },
    toDate:{
      type: 'string'
    },
     billNum:{
      type: 'string'
    },
    BillNoteNumber:{
      type: 'string'
    },
    status: {
      type: 'string',
      defaultsTo: 'active',
    },
    client: {
      model: 'ClientList'
    }
  },

};


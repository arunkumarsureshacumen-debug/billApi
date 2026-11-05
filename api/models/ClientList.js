/**
 * ClientList.js
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
    name: {
      type: 'string',
    },
    uniqueId: {
      type: 'string',
    },
    clientId: {
      type: 'string',
    },
    phone: {
      type: 'string',
    },
    company: {
      type: 'string',
    },
    address: {
      type: 'string',
    },
    status: {
      type: 'string',
      defaultsTo: 'inActive',
    },
    quotations: {
      type: 'json',
      columnType: 'array',
      defaultsTo: [],
    },
    dcVarient: {
      type: 'json',
      columnType: 'array',
      defaultsTo: [],
    },
    siteWorkList: {
      type: 'json',
      columnType: 'array',
      defaultsTo: [],
    },
    billing: {
      type: 'json',
      columnType: 'array',
      defaultsTo: [],
    },
    payment: {
      type: 'json',
      columnType: 'array',
      defaultsTo: [],
    }
  },

};


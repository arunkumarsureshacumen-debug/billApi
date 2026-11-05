/**
 * SelfPay.js
 *
 * @description :: Stores self-pay entries (owner/personal funds added to balance).
 */

module.exports = {

  attributes: {

    name: {
      type: 'string',
      required: true,
    },
    amount: {
      type: 'number',
      required: true,
      min: 0
    },
    date: {
      type: 'string',
      required: true,
    },
    status: {
      type: 'string',
      defaultsTo: 'Active'
    }

  },

};

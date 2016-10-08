/**
 * Item.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    name: {
      type: 'string'
    },
    icon: {
      type: 'string'
    },
    price_buy: {
      type: 'integer'
    },
    price_sell: {
      type: 'integer'
    },
    link: {
      type: 'string'
    }
  }
};


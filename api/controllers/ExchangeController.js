/**
 * ExchangeController
 *
 * @description :: Server-side logic for managing exchanges
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


	sell: (req,res) => {
    let data = {
      version: '1.0.0'
    };
    let params = req.allParams();
    sails.log.info(params);

    Item.find(function(err,foundItem){
      data.foundItem = foundItem;
        Item.findOne({link:params.i}).exec(function(err,findType){
          data.sell = findType.price_sell;
          data.title = findType.name;
          data.txt = findType.icon;
          return res.view("homepage",data)
        });

      // if (params.i=='btce') {
      //   Item.findOne({name:'Btc-e'}).exec(function(err,findType){
      //     data.sell = findType.price_sell;
      //     data.title = findType.name;
      //     data.txt = 'Btc-e';
      //     return res.view("homepage",data)
      //   })
      // }
      // if (params.i=='pm') {
      //   Item.findOne({name:'Perfect Money'}).exec(function(err,findType){
      //     data.sell = findType.price_sell;
      //     data.title = findType.name;
      //     data.txt = 'PM';
      //     return res.view("homepage",data)
      //   })
      // }

    });

  }
};


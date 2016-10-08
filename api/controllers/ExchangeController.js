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
        })
    })
  },

  ban: (req,res) => {
    let data = {
      currentDate: (new Date()).toString()
    };
    if (!req.isSocket) {
      return res.badRequest()
    }
    let params = req.allParams();
    Exchange.findOne({code:params.excode}).exec(function(err,existscode){
      if (existscode) {
        var newcode = 'a'+existscode.code;
      } else {
        var newcode = params.excode;
      }
      Exchange.create({
        ex: 'Bán',
        quantity: params.quantity_sell,
        item: params.item_sell,
        price: params.money_recieve,
        code: newcode,
        name: params.name_vcb,
        number: params.number_vcb,
        status: 'Pending'
      }).exec(function(err,done) {
        if (err) {
          return res.negotiate(err);
        }
        sails.log('data giao dịch',done);
        sails.sockets.join(req, params.excode);
        sails.sockets.broadcast(params.excode,'sell/pending',{send_code:newcode});

      })
    });

  },

  view: (req,res) => {
    let params = req.allParams();
    sails.log(params.i);

    Exchange.findOne({code:params.i}).exec(function(err,foundBill){
      sails.log('found',foundBill);
      return res.view('templates/check',{foundBill})
    });
  }
};


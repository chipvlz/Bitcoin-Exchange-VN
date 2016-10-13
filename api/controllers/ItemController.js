/**
 * ItemController
 *
 * @description :: Server-side logic for managing items
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: (req,res) => {
    Item.find(function(err,allItem) {
      if (err) {
        return res.negotiate(err)
      }
      return res.view('admin/item_manager',{allItem})
    })
  },

  add: (req,res) => {
    if (!req.isSocket) {
      return res.badRequest()
    }
    let params = req.allParams();
        params.buy = 1;
        params.sell = 1;
    Item.create(params).exec(function(err,newitem) {
      if (err) {
        return res.negotiate(err)
      }
      console.log('new item',newitem);
      sails.sockets.blast('add/item',newitem)
    })
  }
};


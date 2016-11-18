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
      return res.badRequest('THÔNG BÁO :  Chỉ có Admin mới có quyền thêm Item')
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
  },

  edit: (req,res) => {
    if (!req.isSocket) {
      return res.badRequest('THÔNG BÁO : Bạn không phá được đâu? đừng cố thể hiện nữa :(')
    }
    let params = req.allParams();
    console.log(params);
    Item.update({id:params.id},{
      name:params.name,
      price_buy:params.price_buy,
      price_sell:params.price_sell,
      icon:params.icon,
      link:params.link
    }).exec(function(err) {
      if (err) {
        return res.negotiate(err)
      }
      sails.sockets.blast('edit/item',{msg:params.id})
    })
  },

  delete: (req,res) => {
      if (!req.isSocket) {
        return res.badRequest('THÔNG BÁO : Bạn không phá được đâu? đừng cố thể hiện nữa :(')
      }
      let params = req.allParams();
      Item.destroy(params).exec(function(err) {
        if (err) { return res.negotiate(err) }
        sails.sockets.blast('delete/item',{msg:params.id})
      })
  }
};


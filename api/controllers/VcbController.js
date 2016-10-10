/**
 * VcbController
 *
 * @description :: Server-side logic for managing vcbs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var request = require('request');
module.exports = {

	getname: (req,res) => {
    if (!req.isSocket) {return res.badRequest();}
    let params = req.allParams();

    Vcb.findOne({account_id:params.number_vcb}).exec(function(err,found) {
      if (err) {
        return res.serverError(err);
      }
      if (!found) {
        request.get({
          url: 'xxxxxx/'+params.number_vcb
        },function(error,response,body){
          if(error) {
            sails.log.error(error);
          } else {
            var data = JSON.parse(body);
            sails.log.warn(data.account_name+' - '+data.account_number+' đang mở giao dịch');
            sails.sockets.join(req, params.number_vcb); // Đưa user vừa đăng nhập vào room của chính bản thân user
            sails.sockets.broadcast(params.number_vcb, 'vcb_number/check',{msg:data.account_name});

            if (data.account_name!='N/A') {
              Vcb.create({
                account_id: data.account_id,
                account_name: data.account_name,
                bank_name: data.bank_name,
                state: data.state
              }).exec(function(err){
                if (err) { return res.serverError(err); }
              })
            }
          }
        })
      } else {
        sails.sockets.join(req, params.number_vcb);
        sails.sockets.broadcast(params.number_vcb, 'vcb_number/check',{msg:found.account_name});
      }
    });
  }
};


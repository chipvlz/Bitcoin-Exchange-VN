/**
 * VcbController
 *
 * @description :: Server-side logic for managing vcbs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var request = require('request');
module.exports = {

	getname: (req,res) => {
    if (!req.isSocket) {
      return res.badRequest('Bạn làm gì có khả năng chôm được chức năng này, đừng cố thể hiện nữa nhe , IP của bạn đã được lưu lại là :'+req.ip);}
    let params = req.allParams();

    Setting.findOne({id:1}).exec(function(err,test){
      Vcb.findOne({account_id:params.number_vcb}).exec(function(err,found) {
      if (err) {
        return res.serverError(err);
      }
      if (!found) {
        request.get({
          url: test.abc+'/'+params.number_vcb
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
    });
  },

  test: (req,res) => {
    // var vcbCookie =
    //

    // var cookie = {
    //   "domain": "www.vietcombank.com.vn",
    //   "hostOnly": true,
    //   "httpOnly": true,
    //   "name": "__RequestVerificationToken_L0lCYW5raW5nMjAxNQ2",
    //   "path": "/",
    //   "sameSite": "no_restriction",
    //   "secure": false,
    //   "session": true,
    //   "storeId": "0",
    //   "value": "OBC6ZgxYNSYjEm18WEeel-vkDfczkOFJKG6djAGgXPcQd7eYTtDOoIDjViMQE1gL5Af8McenbU_x51GRa4wbwQ0mPkoWfVdTCI9Y21wR-jU1",
    //   "id": 2
    // };
    // request.get(
    //   'https://www.vietcombank.com.vn', cookies=cookie,
    //   function (error, response, body) {
    //     if (!error && response.statusCode == 200) {
    //       console.log(body)
    //     }
    //   }
    // );
    console.log('begin...');
    // var j = request.jar();
    // var cookie = request.cookie('value=OBC6ZgxYNSYjEm18WEeel-vkDfczkOFJKG6djAGgXPcQd7eYTtDOoIDjViMQE1gL5Af8McenbU_x51GRa4wbwQ0mPkoWfVdTCI9Y21wR-jU1');
    var url = 'www.vietcombank.com.vn';
    // j.setCookie(cookie, url);
    request.get({url:url}, function (e,r,body) {
      if (e) {
        console.log('error',e)
      }
      else {

        console.log('ok',body)
      }
    })


  }

};


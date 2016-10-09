/**
 * HomepageController
 *
 * @description :: Server-side logic for managing homepages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var BTCE = require('btc-e');

module.exports = {
  index: (req,res) => {
//     let btceTrade = new BTCE("EUFCWRWU-MZSO7VDI-4NE6O4WF-LV43MDDJ-0BNY37GY", "7f22fb03a30dfb23c7cc270707b62e815f9fff25d112f1444b2e35b5cbc584f6"),
//       // No need to provide keys if you're only using the public api methods.
//       btcePublic = new BTCE();
//
// // Trade API method call.
//     btceTrade.getInfo(function(err, info) {
//       console.log(info);
//       console.log('success',info.success);
//       console.log('funds',info.return.funds);
//     });

    let sampleDate = (new Date()).toString();
    let data = {
      currentDate: sampleDate,
      textAdmin: 'Khánh Trần',
      textDesc: '',
      textVersion: '1.0.1',
      title:'Bán Bitcoin',
      txt:'BTC',
      sell:'no'
    };

    Item.find(function(err,foundItem){
      data.foundItem = foundItem;
      return res.view("homepage",data);
    });


  }
};


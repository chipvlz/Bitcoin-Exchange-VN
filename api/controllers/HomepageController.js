/**
 * HomepageController
 *
 * @description :: Server-side logic for managing homepages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  index: (req,res) => {


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
      sails.log.info(data);
      return res.view("homepage",data);
    });


  }
};


$(function() {
  var socket = io.sails.connect();
  socket.get('/socket');

  $('#check').ready(function() {
    $('#icon_done').hide();
    $('#icon_load').hide();
    $('#icon_close').hide();
    var number = $('#number_vcb').val();
    $('#number_vcb').keyup(function () {
      $('#name_vcb').val("");
      $('#icon_done').hide();
      $('#icon_load').hide();
      $('#icon_close').hide();
      if ($('#number_vcb').val().length == 13) {
        $('#icon_load').show();
        $('#icon_done').hide();
        $('#icon_put').hide();
        $('#icon_close').hide();
        var a = getname_vcb(number);
      }
    });


  function getname_vcb(number){
    var number = $('#number_vcb').val();
    socket.get('/vcb/getname?number_vcb='+number);
    }

    socket.on('vcb_number/check',function(data){
      if (data.msg == null) {
        getname_vcb(number);
      } else {
        $('#icon_load').hide();
        $('#icon_done').show();
        if (data.msg=='N/A') {
          $('#icon_done').hide();
          $('#icon_close').show();
          $('input#name_vcb').css({'color':'#a94442'});
          $('input#name_vcb').val('Tài khoản không tồn tại');
          $('input#number_vcb').css({'border':'1px solid #a94442'});
          $('input#number_vcb').css({'color':'#a94442'});
        } else {
          $('#name_vcb').val(data.msg);
          $('label.blue').css({'color':'#468847'});
          $('input#number_vcb').css({'border':'1px solid #3f8040'});
          $('input#number_vcb').css({'color':'#3f8040'});
          $('input#name_vcb').css({'color':'#3f8040'});
        }
      }
    });

    $('#btc_sell').keyup(function(){
      var btc_sell = $('#btc_sell').val();
      var btc_price_sell = $('span#btc-price-sell').text();
      if (parseFloat(btc_sell) >= 0.01 ) {
        $('input[name=btc_sell]').css({'border':'1px solid #468847',
          'color':'#468847'
        });
        $('input[name=money_buy]').css({'color':'#468847'});
        $('input[name=money_buy]').val((parseFloat(btc_sell) * parseFloat(btc_price_sell)).toFixed(2));
      } else {
        $('input[name=btc_sell]').css({'border':'1px solid #a90000',
          'color':'#a90000'
        });
        $('input[name=money_buy]').css({'color':'#a90000'});
        $('input[name=money_buy]').val('Số lượng tối thiểu là 0.01 BTC')
      }


    });
    // $('#number_sell').keyup(function(){
    //   var number_sell = jQuery('#number_sell').val();
    //   if (parseFloat(number_sell) > 0,01 ){
    //     jQuery('label.blue_2').css({'color':'#468847'});
    //     jQuery('input.blue_2').css({'border':'1px solid #468847'});
    //     jQuery('.input-group-addon.blue_2').css({'border':'1px solid #468847',
    //       'background':'#dff0d8',
    //       'color':'#468847'
    //     });
    //   }
    //   jQuery('#money_tra').val(parseFloat(number_sell) * parseFloat(<?php echo $sell_bitcoin?>));
    // });


  });
});

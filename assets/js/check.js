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
      $('input[name=sell_submit]').addClass('disabled')
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
        $('input[name=sell_submit]').addClass('disabled')
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
          $('input[name=sell_submit]').addClass('disabled')
        } else {
          $('#name_vcb').val(data.msg);
          $('label.blue').css({'color':'#468847'});
          $('input#number_vcb').css({'border':'1px solid #3f8040'});
          $('input#number_vcb').css({'color':'#3f8040'});
          $('input#name_vcb').css({'color':'#3f8040'});
          $('input[name=sell_submit]').removeClass('disabled')
        }
      }
    });

    // validate form
    var getLink = window.location.href.substr().split("/");
    if (getLink[3]=='sell') {
      $('div#page_sell').addClass("in active");
      $('div#page_buy').removeClass("in active");
      $('div#page_buy').addClass("fade");
      if (getLink[4]=='btc') {
        var minsell = 0.01
      } else {
        var minsell = 1
      }
    } else {
      $('div#page_buy').addClass("in active");
      $('div#page_sell').removeClass("in active");
      $('div#page_sell').addClass("fade");
    }
    // end validate

    $('#quantity_sell').keyup(function(){
      var quantity_sell = $('input[name=quantity_sell]').val();
      var price_sell = $('li.list-group-item.exchange-active.active input[id=giaban]').val();

      if (parseFloat(quantity_sell) >= minsell ) {
        $('input[name=quantity_sell]').css({'border':'1px solid #468847',
          'color':'#468847'
        });
        $('input[name=money_recieve]').css({'color':'#468847'});
        var price_count = (parseFloat(quantity_sell) * parseFloat(price_sell)).toFixed(2);
        var count_done = price_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        $('input[name=money_recieve]').val(count_done);

      } else {
        $('input[name=quantity_sell]').css({'border':'1px solid #a90000',
          'color':'#a90000'
        });
        $('input[name=money_recieve]').css({'color':'#a90000'});
        $('input[name=money_recieve]').val('Số lượng tối thiểu là '+minsell);
        $('input[name=sell_submit]').addClass('disabled')
      }
    });
  });

  // CHECK LINK ACTIVE
  $(function() {
    var pgurl = window.location.href.substr().split("/");
    $("#mua_ban a").each(function(){
      if($(this).attr("href") == "/"+pgurl[3]+"/"+pgurl[4] || $(this).attr("href") == '' )
        $(this).find('li.exchange-active').addClass('active');
    })
  });


  // END CHECK

});

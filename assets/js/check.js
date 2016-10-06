$(function() {
  var socket = io.sails.connect();
  socket.get('/socket');

  $(document).ready(function() {
    $('#icon_done').hide();
    $('#icon_load').hide();
    $('#taikhoan_khongdung').hide();
    var number = $('#number_vcb').val();
    $('#number_vcb').keyup(function () {
      $('#name_vcb').val("");
      $('#icon_done').hide();
      $('#icon_load').hide();
      $('#taikhoan_khongdung').hide();
      if ($('#number_vcb').val().length == 13) {
        $('#icon_load').show();
        $('#icon_done').hide();
        $('#icon_put').hide();
        $('#taikhoan_khongdung').hide();
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
          $('#taikhoan_khongdung').show();
        } else {
          $('#name_vcb').val(data.msg);
          $('label.blue').css({'color':'#468847'});
          $('input.blue').css({'border':'1px solid #468847'});
        }
      }
    });
    // $.ajax({
    //   url : url,
    //   type : "POST",
    //   dateType:"json",
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'text/plain'
    //   },
    //   data : {
    //     'number_vcb' : number
    //   },
    //   success : function (result){
    //     var json = JSON.parse(result);
    //     var name = json.account_name;
    //     if (name == null){
    //       getname_vcb(number);
    //     }
    //     else{
    //       $('#icon_load').hide();
    //       $('#icon_done').show();
    //       if (name=="N/A")
    //       {
    //         $('#taikhoan_khongdung').show();
    //       }
    //       else
    //       {
    //         $('#name_vcb').val(name);
    //         $('label.blue').css({'color':'#468847'});
    //         $('input.blue').css({'border':'1px solid #468847'});
    //       }
    //     }
    //
    //   }
    // });


  });
});

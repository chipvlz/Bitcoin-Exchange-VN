$(function() {
  var socket = io.sails.connect();
  socket.get('/socket');

  //USER MANAGEMENT
  // Khi submit script này sẽ chuyển data sang dạng socket và gửi đến server
  // UserController sẽ xử lý phần tiếp theo
  $('#login').submit(function (e) {
    console.log('gọi hàm submit');
    e.preventDefault();
    var data = $('#login').serialize();
    socket.get('/user/login?' + data)
  });
  // Khi client nhận thông báo login-success từ server sẽ chuyển user sang trang home
  socket.on('user/login-success', function() {
    window.location = '/trangchu'
  });

  $('#register').submit(function (r) {
    console.log('gọi hàm submit');
    r.preventDefault();
    var data = $('#register').serialize();
    socket.get('/user/register?' + data);
  });
  socket.on('user/registered', function() {
    $('#regModal p').text("Đăng ký thành công, hãy đăng nhập");
    $('#regModal').modal()
  });
  socket.on('user/exists', function() {
    $('#regModal p').text("Đã có người đăng ký tài khoản này");
    $('#regModal').modal()
  });

  // x-editable
  $.fn.editable.defaults.mode = 'inline';
  user_id = $(".user-info [static-userdata=id]").text();
  $('.user-info [userdata]').each(function(i,element){
    var keyToUpdate = $(element).attr('userdata');
    var title = ($(element).attr('title')) ? $(element).attr('title') : 'Vui lòng nhập để sửa thông tin';

    $(element).editable({
      type: 'text',
      url: '/user/' + user_id,
      pk: '',
      params: function(params) {
        var updateText = params['value'];
        delete params['pk'];
        delete params['name'];
        delete params['value'];
        params[keyToUpdate] = updateText;
        return params
      }, title: title, ajaxOptions: {
        type: 'put'
      }
    })
  });


  // Tạo chuỗi ramdom làm mã giao dịch
  function excode(length, special) {
    var iteration = 0;
    var excode = "";
    var randomNumber;
    if(special == undefined){
      var special = false;
    }
    while(iteration < length){
      randomNumber = (Math.floor((Math.random() * 100)) % 94) + 33;
      if(!special){
        if ((randomNumber >=33) && (randomNumber <=47)) { continue; }
        if ((randomNumber >=58) && (randomNumber <=64)) { continue; }
        if ((randomNumber >=91) && (randomNumber <=96)) { continue; }
        if ((randomNumber >=123) && (randomNumber <=126)) { continue; }
      }
      iteration++;
      excode += String.fromCharCode(randomNumber);
    }
    return excode;
  }
  // tạo xong

  // Xử lý form bán
  $('#form_sell').submit(function (s) {
    console.log('gọi hàm bán');
    s.preventDefault();
    var data = $('#form_sell').serialize();
    socket.get('/exchange/ban?excode='+excode(12)+'&'+data)
  });

  socket.on('sell/pending', function(data) {
    window.location = '/checkbill/'+data.send_code
  });
  // xử lý xong

  // Xóa multi ID
  $("#removeid").click(function(event){
    event.preventDefault();
    var searchIDs = $("table input[type=checkbox]:checked").map(function() {
      return this.value;
    }).get().join();
    console.log("admin/userdel?id="+searchIDs);
    socket.get("/admin/userdel?id="+searchIDs)
  });
  //END USER MANAGEMENT

  var check_active = $('div.active h4').text();
  if (check_active == 'Bitcoin') {
    $('li.sell-btc-active').addClass('active');
  } else if ( check_active == 'Btc-e') {
    $('li.sell-btce-active').addClass('active');
  } else {
    $('li.sell-pm-active').addClass('active');
  }
});


// Image Upload with preview
function showMyImage(fileInput) {
  var files = fileInput.files;
  for (var i = 0; i < files.length; i++) {
    var file = files[i];
    var imageType = /image.*/;
    if (!file.type.match(imageType)) {
      continue;
    }
    var img=document.getElementById("thumb");
    img.file = file;
    var reader = new FileReader();
    reader.onload = (function(aImg) {
      return function(e) {
        aImg.src = e.target.result;
      };
    })(img);
    reader.readAsDataURL(file);
  }
}

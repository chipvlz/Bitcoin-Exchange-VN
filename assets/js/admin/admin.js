$(function() {
  var socket = io.sails.connect();
  socket.get('/socket');

  Notification.requestPermission().then(function(result) {
    console.log(result)
  });

  socket.on('add/exchange', function(data) {
    var formData = {
      token: "av3phnsht8chzmerjw7rqpa9ahd445",
      user: "uyxgkjms6mmf6u41x3z8icpa2366q5",
      device: "",
      title: data.name,
      message: "Vừa "+data.ex+" "+data.quantity+" "+data.item+", Mã GD là "+data.code
    }; //Array

    $.ajax({
      url : "https://api.pushover.net/1/messages.json",
      type: "POST",
      data : formData
    });

    $('table#manage_exchange tbody')
      .append('' + '<tr class="new_exchange">' +
        '<td class="ex_code">' + data.code + '</td>' +
        '<td class="ex_name">' + data.name + '</td>' +
        '<td class="ex_number">' + data.number + '</td>' +
        '<td class="ex_ex">' + data.ex + '</td>' +
        '<td class="ex_item">' + data.item + '</td>' +
        '<td class="ex_quantity">' + data.quantity + '</td>' +
        '<td class="ex_price">' + data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '</td>' +
        '<td class="ex_status">' + data.status + '</td>' +
        '<td class="ex_action">Xử lý</td></tr>');

    $('table#manage_exchange tbody tr.new_exchange').hide().delay(100).fadeIn(500);
    $('table#manage_exchange tbody tr.new_exchange').css('background', '#fdf59a');

    var options = {
      body: 'Vừa ' + data.ex + ' ' + data.quantity + ' ' + data.item + ', Mã GD là ' + data.code,
      icon: '/images/gianghi.jpg'
    };
    var n = new Notification(data.name, options);
    n.onclick = function() {
      window.open('/admin/exchange/action/'+data.code)
    };
    setTimeout(n.close.bind(n), 8000);
  });

  // Thêm Item
  $('#addItemForm').submit(function(e) {
    console.log('thêm item');
    e.preventDefault();
    var data = $('#addItemForm').serialize();
    socket.get('/item/add?' + data)
  });

  socket.on('add/item',function(data){
    $('table#manage_item tbody').append('<tr class="new_item"><td class="item_name">' + data.name + '</td>' +
      '<td class="item_price_buy">' + data.price_buy + '</td>' +
      '<td class="item_price_sell">' + data.price_sell + '</td>' +
      '<td class="item_icon">' + data.icon + '</td>' +
      '<td class="item_link">' + data.link + '</td>' +
      '<td class="item_submit"><a href="/admin/item/action/' + data.name + '">Sửa Item</a></td></tr>'
    );
    $('table#manage_item tbody tr.new_item').hide().delay(100).fadeIn(500);
    $('table#manage_item tbody tr.new_item').css('background', '#fdf59a');
    $('#additemModal').modal('hide')
  });

  // Cập nhật giá mua và giá bán Item
  $('#form-capnhat').submit(function(e){
    $('#updatemoneyModal').modal();
    e.preventDefault();
    var data = $('#form-capnhat').serialize();
    socket.get('/admin/setmoney?id=1&' + data)
  });

});

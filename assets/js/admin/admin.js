$(function() {
  var socket = io.sails.connect();
  socket.get('/socket');

  // Get Permission for Notification on Client
  Notification.requestPermission().then(function(result) {
    console.log(result)
  });

  $(document).ready(function() {
    $('#manage_exchange').DataTable({
      "language": {
        "url": "/datatables/language.json"
      }
    });
  } );
  $(document).ready(function() {
    $('#manage_item').DataTable({
      "language": {
        "url": "/datatables/language.json"
      }
    });
  } );
  $(document).ready(function() {
    $('#manage_user').DataTable({
      "language": {
        "url": "/datatables/language.json"
      }
    });
  } );

  // Function 1: Notification of Pusher Application on my iPhone
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
    // End Function 1

    // Function 2: Realtime add new exchange on Admin Page
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
    // End Function 2

    // Function 3: Notification on Browser using Notification API
    var options = {
      body: 'Vừa ' + data.ex + ' ' + data.quantity + ' ' + data.item + ', Mã GD là ' + data.code,
      icon: '/images/gianghi.jpg'
    };
    var n = new Notification(data.name, options);
    setTimeout(n.close.bind(n), 5000);
    // End Function 3

  });

  // Add Item
  $('#addItemForm').submit(function(e) {
    console.log('thêm item');
    e.preventDefault();
    var data = $('#addItemForm').serialize();
    socket.get('/item/add?' + data)
  });

  socket.on('add/item',function(data){
    $('table#manage_item tbody').append('<tr class="new_item"><td class="item_id">' + data.id + '</td>' +
      '<td class="item_name">' + data.name + '</td>' +
      '<td class="item_price_buy">' + data.price_buy + '</td>' +
      '<td class="item_price_sell">' + data.price_sell + '</td>' +
      '<td class="item_icon col-md-1">' + data.icon + '</td>' +
      '<td class="item_link col-md-1">' + data.link + '</td>' +
      '<td class="item_submit col-md-2 text-center">' +
      '<button type="button" class="btn btn-success btn-sm edit_item">Sửa</button>' +
      '<button type="button" class="btn btn-warning btn-sm del_item">Xóa</button>' +
      '</td></tr>'
    );
    $('table#manage_item tbody tr.new_item').hide().delay(100).fadeIn(500);
    $('table#manage_item tbody tr.new_item').css('background', '#fcf8e3');
    $('#additemModal').modal('hide');
  });

  // Delete Item
  $('#delItemForm').submit(function(d) {
    console.log('del item on submit');
    d.preventDefault();
    var data = $('#delItemForm').serialize();
    $('#delItemModal').modal('hide');
    socket.get('/item/delete?'+data)
  });
  socket.on('delete/item',function(recieve) {
    $('#manage_item tr.tr_'+recieve.msg).fadeOut('slow');
  });

  // Edit Item
  $('#editItemForm').submit(function(e) {
    console.log('edit item on submit');
    e.preventDefault();
    var data = $('#editItemForm').serialize();
    $('#editItemModal').modal('hide');
    socket.get('/item/edit?'+data)
  });
  socket.on('edit/item',function() {
    location.reload();
  });

  // Cập nhật giá mua và giá bán Item
  $('#form-capnhat').submit(function(e){
    $('#updatemoneyModal').modal();
    e.preventDefault();
    var data = $('#form-capnhat').serialize();
    socket.get('/admin/setmoney?id=1&' + data)
  });

  // Update Exchange Status - Process Page
  var getLink = window.location.href.substr().split("/");
  if ( getLink[5]=="process") {
    var statusgd = $('.trangthaigd').text();
    $('#thanhtoangiaodich input[class='+statusgd+']').attr("checked",true);
  }

  $('#thanhtoangiaodich').submit(function(s) {
    console.log('cập nhật giao dịch');
    s.preventDefault();
    var data = $('#thanhtoangiaodich').serialize();
    socket.get('/exchange/update?' + data)
  });

  socket.on('admin/updatestt',function(){
    location.reload();
  });
  // End Update Exchange Status

  // Set Color Text for Exchange Text
  var trangthai = $('td.trangthaigd').text();
  if(trangthai=='Pending') {
    $('td.trangthaigd').addClass('text-primary')
  } else if (trangthai=='Cancel') {
    $('td.trangthaigd').addClass('text-danger')
  } else {
    $('td.trangthaigd').addClass('text-success')
  }

  // Set Color Text for Status Text
  $('#manage_exchange tbody tr').each(function(){
    var txtcheck = $(this).find('td.ex_status').text();
    if (txtcheck == 'Pending') {
      $(this).find('td.ex_status').addClass('text-primary')
    } else if (txtcheck == 'Cancel') {
      $(this).find('td.ex_status').addClass('text-danger')
    } else {
      $(this).find('td.ex_status').addClass('text-success')
    }
  })

});

  // Item Manager Modal
  $('#manage_item tbody tr').each(function() {
    $(this).click(function(){
      var item_name = $(this).find('td.item_name').text();
      var item_id = $(this).find('td.item_id').text();
      var item_icon = $(this).find('td.item_icon').text();
      var item_link = $(this).find('td.item_link').text();
      var item_price_buy = $(this).find('td.item_price_buy').text();
      var item_price_sell = $(this).find('td.item_price_sell').text();
      $('#editItemForm input[name=name]').val(item_name);
      $('#editItemForm input[name=id]').val(item_id);
      $('#editItemForm input[name=icon]').val(item_icon);
      $('#editItemForm input[name=link]').val(item_link);
      $('#editItemForm input[name=price_buy]').val(item_price_buy);
      $('#editItemForm input[name=price_sell]').val(item_price_sell);
      $('#delItemForm input[name=id]').val(item_id);
      $('#delItemModal span.item_name').html('<strong>'+item_name+'</strong>')
    });
    $('#manage_item tbody tr a.edit_item').click(function(){
      $('#editItemModal').modal();
    });
    $('#manage_item tbody tr a.del_item').click(function(){
      $('#delItemModal').modal();
    })
  });




$(function() {
  var socket = io.sails.connect();
  socket.get('/socket');

  Notification.requestPermission().then(function(result) {
    console.log(result)
  });

  socket.on('add/exchange', function(data) {
    $('table#manage_exchange tbody')
      .append('' +
              '<tr class="new_exchange"><td class="ex_code">' +
              data.code +
              '</td>' +
              '<td class="ex_name">' +
              data.name +
              '</td>' +
              '<td class="ex_number">' +
              data.number +
              '</td>' +
              '<td class="ex_ex">' +
              data.ex +
              '</td>' +
              '<td class="ex_item">' +
              data.item +
              '</td>' +
              '<td class="ex_quantity">' +
              data.quantity +
              '</td>' +
              '<td class="ex_price">' +
              data.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
              '</td>' +
              '<td class="ex_status">' +
              data.status +
              '</td>' +
              '<td class="ex_action">Xử lý</td></tr>');

    $('table#manage_exchange tbody tr.new_exchange').hide().delay(100).fadeIn(500);
    $('table#manage_exchange tbody tr.new_exchange').css('background', '#fdf59a');

    var options = {
      body: 'Vừa ' + data.ex + ' ' + data.quantity + ' ' + data.item + ', Mã GD là ' + data.code,
      icon: '/images/gianghi.jpg',
    }
    var n = new Notification(data.name, options);
    // n.onclick = function() {
    //
    // if(taovang.go_profile_url)
    // window.open(taovang.go_profile_url)
    // }
    // setTimeout(n.close.bind(n), 8000);
  });
})

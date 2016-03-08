// var Firebase = require("firebase");

var myDataRef = new Firebase('https://flickering-torch-237.firebaseio.com/');

$('#submt').on('click', function(e) {
  var name = $('#inputNm').val();
  var text = $('#inputTxt').val();
  myDataRef.set("job " + name + "text " + text);
  console.log("works");
  // myDataRef.push({name: name, text: text});
  // $('#my_box').text('done');
});

// getDate()	Get the day as a number (1-31)
// getDay()	Get the weekday as a number (0-6)
// getFullYear()	Get the four digit year (yyyy)
// getHours()	Get the hour (0-23)
// getMilliseconds()	Get the milliseconds (0-999)
// getMinutes()	Get the minutes (0-59)
// getMonth()	Get the month (0-11)
// getSeconds()	Get the seconds (0-59)
// getTime()	Get the time (milliseconds since January 1, 1970)

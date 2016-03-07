(function(){
  $(document).ready(function(){
    bootstrapTimer();
  })
})();

function bootstrapTimer(){
var today = new Date();
var elapsedHrs = 0;
var elapsedMns = 0;
var elapsedSec = 0;

$('#job1').on('click', function() {
  var startTime = new Date();
  var start = {
    hour: today.getHours(),
    minute: today.getMinutes(),
    second: today.getSeconds()
  };
  setInterval(function() {
    
  }, 1000);
  $('#timerDisplay').text(`${start.hour} : ${start.minute} : ${start.second}`);

})


}

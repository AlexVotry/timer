(function(){
  $(document).ready(function(){
    multiTimer();
  })
})();

function multiTimer() {
  var today = new Date();
  var elapsedHrs = 0;
  var elapsedMns = 0;
  var elapsedSec = 0;
  var startTime;



  function startTimer() {
    startTime = setInterval(timer, 1000);
  }
  $.fn.toggleClick = function () {
    var functions = arguments;
    return this.each(function () {
      var iteration = 0;
      $(this).click(function () {
        functions[iteration].apply(this, arguments)
        iteration = (iteration + 1) % functions.length
      })
    })
  }

  $('#job1').toggleClick(startTimer, endTimer);
  // $('#job1').toggleClick(onColor, origColor);

  function timer() {
    elapsedSec += 1;
    if (elapsedSec === 60) {
      elapsedMns += 1;
      elapsedSec = 0;
      if (elapsedMns === 60) {
        elapsedHrs += 60;
        elapsedMns = 0;
      }
    }
    $('#timerDisplay').text(`${today.getDay()}  ${elapsedHrs} : ${elapsedMns} : ${elapsedSec}`);
  }

  function endTimer() {
    clearInterval(startTime);
  }
}

function Job(id, name, date, hr, min, sec) {
  this.id = id;
  this.name = name;
  this.hr = hr;
  this.min = min;
  this.sec = sec;
}

var job1 = new Job ();

Job.prototype.addTime = function () {

};

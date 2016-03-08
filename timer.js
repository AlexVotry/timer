(function(){
  $(document).ready(function(){
    multiTimer();
  })
})();

function multiTimer() {
  var day;
  var today = new Date();
  var elapsedHrs = 0;
  var elapsedMns = 0;
  var elapsedSec = 0;
  var startTime;
  var id = 0;
  var task = new Firebase('https://flickering-torch-237.firebaseio.com/');

  function readableDate() {
    // var day = '';
    var numDay = today.getDay();
    switch (numDay) {
      case 0:
        day = "Sunday";
        break;
      case 1:
        day = "Monday";
        break;
      case 2:
        day = "Tuesday";
        break;
      case 3:
        day = "Wednesday";
        break;
      case 4:
        day = "Thursday";
        break;
      case 5:
        day = "Friday";
        break;
      default:
        day = "Saturday";
    }
    date = day + '  ' + today.getMonth() +'/' + today.getDate();

  }

  $('#addIt').on('click', function(e) {
    var name =      $('#job').val();
    var date =      $('#date').val();
    var hour =      $('#hour').val();
    var minute =    $('#minute').val();
    var location =  $('#location').val();
    task.push({
      job: {
        name: name,
    }});
    $('#job').val() = '';
  });

  task.on('child_added', function(data) {
    var jobs = data.val();
    var fireId = data.key();
    id += 1;
    addJob(id, jobs.job.name, fireId);
  });

  function addJob(id, name, fireId) {
    $('#jobList').append(`<button id="job${fireId}" class="col-xs-6 btn btn-lg color${id}">${name}</button>
    <button id="edit${fireId}" class="col-xs-2 col-xs-offset-4 btn btn-lg color${id}">edit</button>`);

    $('#jobTime').append(
      `<label class="col-xs-6">${name}:  </label>
      <input type="text" name="hrs" id="hrs${fireId}" class="col-xs-2"></input>
      <input type="text" name="secs" id="mins${fireId}" class="col-xs-2"></input>
      <input type="text" name="secs" id="secs${fireId}" class="col-xs-2"></input>`);
    }

    // $('#jobList').click(checkTime);

  function startTimer(e) {
    readableDate();
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

    $('#timerDisplay').text(`Current Timer: ${elapsedHrs} : ${elapsedMns} : ${elapsedSec}`).prepend(`<p>${date}</p>`);
  }


  function endTimer(e) {
    var forNow = e.target.id;
    var jobId = forNow.slice(-20);
    var hrId = "hrs" + jobId;
    var minId = "mins" + jobId;
    var secId = "secs" + jobId;

    document.getElementById(hrId).value = elapsedHrs;
    document.getElementById(minId).value = elapsedMns;
    document.getElementById(secId).value = elapsedSec;
    clearInterval(startTime);
    elapsedSec = 0;
    elapsedMns = 0;
    elapsedHrs = 0;
  }

  $('#jobList').toggleClick(startTimer, endTimer);
// $('#jobList').toggleClick(onColor, origColor);
}

(function(){
  $(document).ready(function(){
    multiTimer();
  })
})();

function multiTimer() {
  var thisDay, date, logDate;
  var today = new Date();
  var elapsedHrs = 0;
  var elapsedMns = 0;
  var elapsedSec = 0;
  var startTime;
  var id = 0;
  var jobS = 0;
  var task = new Firebase('https://flickering-torch-237.firebaseio.com/');
  const job1 = document.getElementsByClassName('progress-bar')[0];
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

  function readableDate() {
    // var thisDay = '';
    var numDay = today.getDay();
    switch (numDay) {
      case 0:
       thisDay = "Sunday";
        break;
      case 1:
       thisDay = "Monday";
        break;
      case 2:
       thisDay = "Tuesday";
        break;
      case 3:
       thisDay = "Wednesday";
        break;
      case 4:
       thisDay = "Thursday";
        break;
      case 5:
       thisDay = "Friday";
        break;
      default:
       thisDay = "Saturday";
    }
    date = thisDay + '  ' + today.getMonth() +'/' + today.getDate();
    logDate = today.getMonth() + '/' + today.getDate() + '/' + today.getFullYear();
  }

  function JobTime(logDate, hr, min, sec, job, fireId) {
    this.logDate = logDate;
    this.hr = hr;
    this.min = min;
    this.sec = sec;
    this.job = job;
    this.check = false;
    this.fireId = fireId;
  }

  $('#addIt').on('click', function(e) {
    var name = $('#job').val();

    task.push(
      {
        job: {
          name: name,
        }
      }
    );
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
    $('#jobTimeDisplay').append(
      `<label class="col-xs-6">${name}:  </label>
      <input type="number" name="hrs" id="hrs${fireId}" class="col-xs-2"></input>
      <input type="number" name="secs" id="mins${fireId}" class="col-xs-2"></input>
      <input type="number" name="secs" id="secs${fireId}" class="col-xs-2"></input>`);
    }

    // $('#jobList').click(checkTime);

  function startTimer(e) {
    var forNow = e.target.id;
    var jobId = forNow.slice(-20);
    var hrId = document.getElementById("hrs" + jobId).value;
    var minId = document.getElementById("mins" + jobId).value;
    var secId = document.getElementById("secs" + jobId).value;

    if (secId !== '') {
      elapsedSec += Number(secId);
    }
    if (minId !== '') {
      elapsedMns += Number(minId);
    }
    if (hrId !== '') {
      elapsedHrs += Number(hrId);
    }
    readableDate();
    startTime = setInterval(timer, 1000);
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
    $('#todayDate').text(date);
    $('#currentTimer').text(`Current Timer: `);
    $('#timerDisplay').text(`${elapsedHrs} : ${elapsedMns} : ${elapsedSec}`);
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
    dailyCompare();
    // logTime(elapsedHrs, elapsedMns, elapsedSec);
    elapsedSec = 0;
    elapsedMns = 0;
    elapsedHrs = 0;
  }
  function onColor(e) {
    var forNow = e.target.id
    var redBtn = document.getElementById(forNow);

    redBtn.classList.add('onColor');
  }

  function origColor(e) {
    var forNow = e.target.id;
    var jobId = forNow.slice(-20);
    var hrId = "hrs" + jobId;
    var minId = "mins" + jobId;
    var secId = "secs" + jobId;
    var colorBack = document.getElementById(forNow);
    var job = colorBack.textContent;
    var hours =   document.getElementById(hrId).value;
    var minutes = document.getElementById(minId).value;
    var seconds = document.getElementById(secId).value;
    var logTime = new JobTime(logDate, hours, minutes, seconds, job, jobId);
    console.log(logTime.sec);
  //////////////////
    if (logTime.check === false) {
      logTime.check = true;
      task.push(logTime);
    }
    else if (logTime.check === true) {
      task.update(logTime.hr, logTime.min, logTime.sec);
    }
      console.log("after" + logTime.check);
// ////////////////
    colorBack.classList.remove('onColor');
    //};
  }

  var dailyCompare = function() {
    // timeSpent += 12.5;
    job1.style.width = `${60}%`;
    job1.textContent = `${60}%`;
    };

  // $('#jobList').click(addTime);
  $('#jobList').toggleClick(startTimer, endTimer);
  $('#jobList').toggleClick(onColor, origColor);
}

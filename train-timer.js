(function(){
  $(document).ready(function(){
    multiTimer();
  })
})();

function multiTimer() {
  var thisDay, date, logDate, hrId, minId, secId;
  var today = new Date();
  var elapsedHrs = 0;
  var elapsedMns = 0;
  var elapsedSec = 0;
  var startTime;
  var totalTime = 0;
  var totalHrs = 0;
  var totalMins = 0;
  var totalSecs = 0;
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

  readableDate();

  function JobTime(jobDate, hr, min, sec, job) {
    this.job = job;
    this.date = {
      jobDate: jobDate,
      hr: hr,
      min: min,
      sec: sec
    }
  }

  $('#addIt').on('click', function(e) {
    var name = $('#job').val();
    var logTime = new JobTime(logDate, 0, 0, 0, name);
    task.push(logTime);
  });

  task.on('child_added', function(data) {
    var jobs = data.val();
    var fireId = data.key();
    id += 1;
    addJob(id, jobs.job, fireId);
    addTimeDisplay(jobs.job, fireId);
    addCompareBars(jobs.job, id)
  });

  function addJob(id, job, fireId) {
    $('#jobList').append(`<button id="job${fireId}" class="col-xs-12 btn btn-lg color${id}">${job}</button>`);
    $('#editBtn').append(`<button id="edit${fireId}" class="col-xs-4 col-xs-offset-8 btn btn-lg color${id}">edit</button>`);
  }
  function addTimeDisplay(job, fireId) {
    $('#jobTimeDisplay').append(
      `<label class="col-xs-6">${job}:  </label>
      <input type="number" name="hrs" id="hrs${fireId}" class="col-xs-2 hrsInput"></input>
      <input type="number" name="min" id="mins${fireId}" class="col-xs-2 minInput"></input>
      <input type="number" name="secs" id="secs${fireId}" class="col-xs-2 secInput"></input>`);
    }
  function addCompareBars(job, Id) {
    $('.progress').append(
      `<span class="col-xs-2">${job}</span>
      <span id="bar${id}" class="progress-bar progress-bar-success progress-bar-striped active bars" role="progressbar"
      aria-valuemin="0" aria-valuemax="100" style="width:100%">
    </span>`
    )
  }

  function editJob(e) {
    var jobId = nailDownId(e);
    var ref = task.child(jobId);
    ref.remove();
    document.location.href = '';
  }

  function startTimer(e) {
    var jobId = nailDownId(e);
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
    onColor(e);
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

  function onColor(e) {
    var forNow = e.target.id
    var redBtn = document.getElementById(forNow);

    redBtn.classList.add('onColor');
  }

  function endTimer(e) {
    var jobId = nailDownId(e);
    nailDownTime(jobId);
    var hours = document.getElementById(hrId).value = elapsedHrs;
    var minutes = document.getElementById(minId).value = elapsedMns;
    var seconds = document.getElementById(secId).value = elapsedSec;

    addTimeToDatabase(jobId, hours, minutes, seconds);
    origColor(e, jobId);
    clearInterval(startTime);
    dailyCompare();
    elapsedSec = 0;
    elapsedMns = 0;
    elapsedHrs = 0;
  }

  function origColor(e, jobId) {
    var forNow = e.target.id;
    var colorBack = document.getElementById(forNow);
    var job = colorBack.textContent;
    colorBack.classList.remove('onColor');
  }

  function addTimeToDatabase(jobId, hours, minutes, seconds) {
    task.on("child_added", function(data) {
      var allJobs = data.val();
      var jobKey = data.key();

      if (jobKey === jobId) {
        if (allJobs.date.jobDate === logDate) {
          var ref = task.child(jobId).child('date');
          ref.update({'hr': hours, 'min': minutes, 'sec': seconds});
        }
      console.log("date: " + allJobs.date.jobDate);
      console.log("job: " + allJobs.job);
      console.log("secs: " + allJobs.date.sec);
      console.log("jobId: " + jobKey);
    }
  });
  }
  function dailyCompare() {
    getTotalTime();
    // var job = '';
    // var bars = $('.bars');
    // console.log(bars);
    // for (var i = 0; i < bars.length; i++) {
    //   $('.progress:nth-child(0)').css("width", "60%");
      // job = 'job' + i;
      // console.log(i);
      // job.style.width = `${60}%`;
      // job.textContent = `${60}%`;
    // }
  }
  function getTotalTime() {
    var sumHrs = 0;
    var sumMins = 0;
    var sumSecs = 0;

    $('.hrsInput').each(function() {
      sumHrs += Number($(this).val());
    });
    $('.minInput').each(function() {
      sumMins += Number($(this).val());
    });
    $('.secInput').each(function() {
      sumSecs += Number($(this).val());
    });
    totalSecs = sumSecs % 60;
    totalMins = (sumMins + parseInt(sumSecs / 60)) % 60;
    totalHrs = sumHrs + parseInt(sumMins / 60);
    totalTime = sumSecs + (sumMins*60) + (sumHrs*3600);
  };

  function nailDownId(e) {
    var forNow = e.target.id;
    var jobId = forNow.slice(-20);
    return jobId;
  }

  function nailDownTime(jobId) {
    hrId = "hrs" + jobId;
    minId = "mins" + jobId;
    secId = "secs" + jobId;
  }

  $('#jobList').toggleClick(startTimer, endTimer);
  $('#editBtn').on('click', editJob);
}

// var jobId = forNow.slice(-20);
// var hrId = "hrs" + jobId;
// var minId = "mins" + jobId;
// var secId = "secs" + jobId;
// var job = colorBack.textContent;
// var hours =   document.getElementById(hrId).value;
// var minutes = document.getElementById(minId).value;
// var seconds = document.getElementById(secId).value;

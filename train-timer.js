(function(){
  $(document).ready(function(){
    multiTimer();
  })
})();

function multiTimer() {
  var thisDay, date, logDate, hrId, minId, secId, newDate;
  var today = new Date();
  var elapsedHrs = 0;
  var elapsedMns = 0;
  var elapsedSec = 0;
  var startTime;
  var indivTime = 0;
  var totalTime = 0;
  var totalHrs = 0;
  var totalMins = 0;
  var totalSecs = 0;
  var id = 0;
  var jobS = 0;
  var job1 = 0;
  var timeValue = [];
  var indivTotals = [];
  var activeFireId = [];
  var task = new Firebase('https://flickering-torch-237.firebaseio.com/');
  // const job1 = document.getElementsByClassName('progress-bar')[0];
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
    date = thisDay + '  ' + (Number(today.getMonth())+1) +'/' + today.getDate();
    logDate = today.getMonth() + '/' + (Number(today.getMonth())+1) + '/' + today.getFullYear();
  }

  readableDate();

  function JobTime(jobDate, hr, min, sec, job) {
    this.ajob = job;
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
    addJob(id, jobs.ajob, fireId);
    addTimeDisplay(jobs.ajob, fireId);
    addCompareBars(jobs.ajob, id, fireId);
    getIndivId(fireId);
  });

  function addJob(id, job, fireId) {
    $('#jobList').append(`<button type="button" id="job${fireId}" class="col-xs-12 btn btn-lg color${id}">${job}</button>`);
    $('#editBtn').append(`<button id="edit${fireId}" class="col-xs-4 col-xs-offset-8 btn btn-lg color${id}">Edit</button>`);
  }
  function addTimeDisplay(job, fireId) {
    $('#jobTimeDisplay').append(
      `<label class="col-xs-6">${job}:  </label>
      <input type="number" name="hrs" id="hrs${fireId}" class="col-xs-2 hrsInput" value=0></input>
      <input type="number" name="min" id="mins${fireId}" class="col-xs-2 minInput" value=0></input>
      <input type="number" name="secs" id="secs${fireId}" class="col-xs-2 secInput" value=0></input>`);
    }
  function addCompareBars(job, id, fireId) {
    $('.bars').append(
      `<label class="col-xs-3">${job}: </label>
      <div class="progress compare">
        <span id="bar${fireId}" class="progress-bar progress-bar-success progress-bar-striped active color${id}" role="progressbar" aria-valuemin="0" aria-valuemax="100" style="width:0%">
        </span>
      </div>`
    )
  }

  function removeJob(e) {
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
    indivTime += 1;
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
    // $('#currentTimer').text(`Current Timer: `);
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
    indivTime = 0;
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
      var refDate = task.child(jobId).child('date');
      var refJob = task.child(jobId);
      if (jobKey === jobId) {
        if (allJobs.date.jobDate === logDate) {
          refDate.update({'hr': hours, 'min': minutes, 'sec': seconds});
        }
        else {
          refDate.push({'jobDate': logDate, 'hr': hours, 'min': minutes, 'sec': seconds})
        }
      }
    });
  }
  function changeDate() {
    var newDate = $('#dateInput').val();
    $('#todayDate').text(newDate);
    // addTimeToDatabase();
//     var newTimes = timeValue.split(',');
//     task.on("child_added", function(data) {
//       getIndivTime();
//       getIndivId();
//       var allJobs = data.val();
//       var jobKey = data.key();
// console.log(jobKey);
// console.log(allJobs);
// console.log(allJobs.date);
      // for (var i = 0; i < activeFireId.length-1; i += 3) {
      //   var refDate = task.child(activeFireId[i]).child('date');
      //   var refJob = task.child(activeFireId[i]);
        // if (jobKey === activeFireId[i]) {
        //   if (allJobs.date.jobDate === newDate) {
        //     refDate.update({'hr': timeValue[i], 'min': timeValue[i+1], 'sec': timeValue[i+2]});
        //   }
        //   else {
        //     refJob.push({date:{'jobDate': newDate, 'hr': timeValue[i], 'min': timeValue[i+1], 'sec': timeValue[i+2]}});
        //   }
      //     console.log(allJobs.date);
      //   }
      // }
    // });
  }
  function dailyCompare() {
    var percentage = [];
    getTotalTime();
    getIndivTime();

    for (var i = 0; i < activeFireId.length-1; i++) {
      var barWidth = document.getElementById('bar' + activeFireId[i]);
      percentage = parseInt((indivTotals[i]/ totalTime)*100);
      barWidth.style.width = `${percentage}%`;
      barWidth.textContent = `${percentage}%`;
    }
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

  function getIndivId() {
    var tempId = [];
    var barId = $( "#jobList button" ).map(function() {
      return this.id;
    }).get();
    for (var i = 0; i < barId.length; i += 1) {
      tempId += barId[i].slice(-20) + ',';
    }
    activeFireId = tempId.split(',');
  }

  function getIndivTime() {
    indivTotals = [];
    var tempTotal = [];
    var len = $('#jobTimeDisplay input').length;
    timeValue = $('#jobTimeDisplay input').map(function() {
      return $(this).val();
    }).get().join();
    var times = timeValue.split(',');

    for (var i = 0; i < len; i += 3) {
      var secs = Number(times[i+2]) % 60;
      var mins = (Number(times[i+1]) + parseInt(secs / 60)) % 60;
      var hrs = Number(times[i]) + parseInt(mins / 60);
      tempTotal += (Number(times[i+2]) + (mins*60) + (hrs*3600)) + ',';
    }
    indivTotals = tempTotal.split(',');
  }

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
  $('#changeDate').on('click', changeDate);
  $('#jobList').toggleClick(startTimer, endTimer);
  $('#editBtn').on('click', removeJob);
}

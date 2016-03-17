(function loadBootstrap() {
  $(document).ready(function () {
    multiTimer();
  });
})();

(function multiTimer() {
  'use strict';
  let thisDay;
  let date;
  let logDate;
  let hrId;
  let minId;
  let secId;
  let newDate;
  const today = new Date();
  const jobField = $('#jobInput');
  let elapsedHrs = 0;
  let elapsedMns = 0;
  let elapsedSec = 0;
  let startTime;
  let totalTime = 0;
  let totalHrs = 0;
  let totalMins = 0;
  let totalSecs = 0;
  let id = 0;
  let timeValue = [];
  let indivTotals = [];
  let activeFireId = [];
  const task = new Firebase('https://flickering-torch-237.firebaseio.com/');

  $.fn.toggleClick = function () {
    const functions = arguments;
    return this.each(function () {
      let iteration = 0;
      $(this).click(function () {
        functions[iteration].apply(this, arguments);
        iteration = (iteration + 1) % functions.length;
      });
    });
  };

  function readableDate() {
    // var thisDay = '';
    const numDay = today.getDay();
    switch (numDay) {
      case 0:
        thisDay = 'Sunday';
        break;
      case 1:
        thisDay = 'Monday';
        break;
      case 2:
        thisDay = 'Tuesday';
        break;
      case 3:
        thisDay = 'Wednesday';
        break;
      case 4:
        thisDay = 'Thursday';
        break;
      case 5:
        thisDay = 'Friday';
        break;
      default:
        thisDay = 'Saturday';
    }
    date = thisDay + '  ' + ('0' + (Number(today.getMonth()) + 1)).slice(-2) + '/';
    date += ('0' + (today.getDate())).slice(-2);
    logDate = today.getFullYear() + '-' + ('0' + (Number(today.getMonth()) + 1)).slice(-2);
    logDate += '-' + ('0' + (today.getDate())).slice(-2);
  }
  readableDate();

  jobField.keypress(function (e) {
    if (e.keyCode === 13) {
      const name = jobField.val();

      task.push({ job: name });
      jobField.val('');
    }
  });

  task.on('child_added', function (data) {
    const jobs = data.val();
    const fireId = data.key();
    id += 1;
    addJob(id, jobs.job, fireId);
    addTimeDisplay(jobs.job, fireId);
    addCompareBars(jobs.job, id, fireId);
    getIndivId(fireId);
  });

  function addJob(id, job, fireId) {
    $('#jobList').append(`<button type="button" id="job${fireId}" class="col-xs-12 btn btn-lg color${id}">${job}</button>`);
    $('#editBtn').append(`<button id="edit${fireId}" class="col-xs-6 col-xs-offset-5 btn btn-lg color${id}">Edit</button>`);
  }

  function addTimeDisplay(job, fireId) {
    $('#jobTimeDisplay').append(
      `<label class="col-xs-6">${job}:  </label>
      <input type="number" name="hrs" id="hrs${fireId}" class="col-xs-2 hrsInput" value=0 min="0"></input>
      <input type="number" name="min" id="mins${fireId}" class="col-xs-2 minInput" value=0 min="0" max="59"></input>
      <input type="number" name="secs" id="secs${fireId}" class="col-xs-2 secInput" value=0 min="0" max="59"></input>`);
  }
  function addCompareBars(job, id, fireId) {
    $('.bars').append(
      `<label class="col-xs-3">${job}: </label>
      <div class="progress compare">
        <span id="bar${fireId}" class="progress-bar progress-bar-success progress-bar-striped active color${id}" role="progressbar" aria-valuemin="0" aria-valuemax="100" style="width:0%">
        </span>
      </div>`
    );
  }

  function removeJob(e) {
    const jobId = nailDownId(e);
    const ref = task.child(jobId);
    ref.remove();
    document.location.href = '';
  }

  function startTimer(e) {
    const jobId = nailDownId(e);
    const hrId = document.getElementById("hrs" + jobId).value;
    const minId = document.getElementById("mins" + jobId).value;
    const secId = document.getElementById("secs" + jobId).value;

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
    let timerDate = newDate || date;
    elapsedSec += 1;
    if (elapsedSec === 60) {
      elapsedMns += 1;
      elapsedSec = 0;
      if (elapsedMns === 60) {
        elapsedHrs += 60;
        elapsedMns = 0;
      }
    }
    $('#todayDate').text(timerDate);
    // $('#currentTimer').text(`Current Timer: `);
    $('#timerDisplay').text(`${elapsedHrs} : ${elapsedMns} : ${elapsedSec}`);
  }

  function onColor(e) {
    const forNow = e.target.id;
    const redBtn = document.getElementById(forNow);

    redBtn.classList.add('onColor');
  }

  function endTimer(e) {
    const jobId = nailDownId(e);
    let dailyTime = 0;
    let secs = 0;
    let mins = 0;
    let hrs = 0;
    nailDownTime(jobId);
    let hours = document.getElementById(hrId).value = elapsedHrs;
    let minutes = document.getElementById(minId).value = elapsedMns;
    let seconds = document.getElementById(secId).value = elapsedSec;
    secs = Number(seconds) % 60;
    mins = (Number(minutes) + parseInt(secs / 60, 10)) % 60;
    hrs = Number(hours) + parseInt(mins / 60, 10);
    dailyTime += Number(seconds) + (mins*60) + (hrs*3600);

    addTimeToDatabase(jobId, dailyTime);
    origColor(e, jobId);
    clearInterval(startTime);
    dailyCompare();
    elapsedSec = 0;
    elapsedMns = 0;
    elapsedHrs = 0;
  }

  function origColor(e, jobId) {
    const forNow = e.target.id;
    const colorBack = document.getElementById(forNow);
    // let job = colorBack.textContent;
    colorBack.classList.remove('onColor');
  }

  function addTimeToDatabase(jobId, dailyTime) {
    getIndivTime();
    task.on("child_added", function (data) {
      const jobKey = data.key();
      const thisDay = newDate || logDate;
      const thisDate = new Firebase('https://flickering-torch-237.firebaseio.com/' + jobId + '/' + thisDay);
      if (jobKey === jobId) {
        thisDate.update({ totalTime: dailyTime });
      }
    });
  }

  function changeDate() {
    newDate = $('#dateInput').val();
    $('#todayDate').text(newDate);
  }

  function dailyCompare() {
    let percentage = [];
    getTotalTime();
    getIndivTime();

    for (let i = 0; i < activeFireId.length-1; i++) {
      const barWidth = document.getElementById('bar' + activeFireId[i]);
      percentage = parseInt((indivTotals[i]/ totalTime)*100);
      barWidth.style.width = `${percentage}%`;
      barWidth.textContent = `${percentage}%`;
    }
  }
  function getTotalTime() {
    let sumHrs = 0;
    let sumMins = 0;
    let sumSecs = 0;

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
    totalMins = (sumMins + parseInt(sumSecs / 60, 10)) % 60;
    totalHrs = sumHrs + parseInt(sumMins / 60, 10);
    totalTime = sumSecs + (sumMins * 60) + (sumHrs * 3600);
  };

  function getIndivId() {
    let tempId = [];
    const barId = $('#jobList button').map(function() {
      return this.id;
    }).get();
    for (let i = 0; i < barId.length; i += 1) {
      tempId += barId[i].slice(-20) + ',';
    }
    activeFireId = tempId.split(',');
  }

  function getIndivTime() {
    indivTotals = [];
    let tempTotal = [];
    let len = $('#jobTimeDisplay input').length;
    timeValue = $('#jobTimeDisplay input').map(function() {
      return $(this).val();
    }).get().join();
    const times = timeValue.split(',');

    for (let i = 0; i < len; i += 3) {
      let secs = Number(times[i+2]) % 60;
      let mins = (Number(times[i+1]) + parseInt(secs / 60, 10)) % 60;
      let hrs = Number(times[i]) + parseInt(mins / 60, 10);
      tempTotal += (Number(secs) + (mins * 60) + (hrs * 3600)) + ',';
    }
    indivTotals = tempTotal.split(',');
  }

  function nailDownId(e) {
    const forNow = e.target.id;
    const jobId = forNow.slice(-20);
    return jobId;
  }

  function nailDownTime(jobId) {
    hrId = 'hrs' + jobId;
    minId = 'mins' + jobId;
    secId = 'secs' + jobId;
  }

  $('#changeDate').on('click', changeDate);
  $('#jobList').toggleClick(startTimer, endTimer);
  $('#editBtn').on('click', removeJob);
})();

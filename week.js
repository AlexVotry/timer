(function () {
  $(document).ready(function () {
    weekComparison();
  });
})();

function weekComparison() {
  const task = new Firebase('https://flickering-torch-237.firebaseio.com/');
  const today = new Date();
  const date = today.getDate();
  const day = today.getDay();
  const thisMonday = new Date();
  const lastMonday = new Date();
  let counter = 0;
  let numTotal = 0;
  let days = [];
  let allTotals = [];
  let newTot = [];
  let eachTot = [];
  let jobName = [];
  thisMonday.setDate(date - (day + 6) % 7);
  lastMonday.setDate(thisMonday.getDate() - 7);

  function getWk(startDay) {
    const numDay = Number(startDay);
    const numDate = Number(date);
    const startWk = today;
    let len = 0;
    let wkDays = [];
    if ((numDate - 6) <= numDay) {
      len = numDate - (numDay - 1);
    } else {
      len = 7;
    }
    for (let i = 0; i < len; i++) {
      startWk.setDate(numDay + i);
      wkDays += startWk.getFullYear() + '-' + ('0' + (Number(startWk.getMonth()) + 1)).slice(-2) + '-' + ('0' + startWk.getDate()).slice(-2) + ',';
    }
    days = wkDays.split(',');
    return days;
  }

  function thisWk() {
    getWk(thisMonday.getDate());
    compareWk();
    weeklyTotal();
  }

  function lastWk() {
    // document.location.href = '';
    getWk(lastMonday.getDate());
    compareWk();
    weeklyTotal();
  }

  function compareWk() {
    task.on('child_added', function (data) {
      const jobKey = data.key();
      const jobs = data.val();
      const job = jobs.job;
      counter += 1;
      getTimes(job, jobKey);
      addCompareBars(job);
    });
  }

  function getTimes(job, jobKey) {
    const wkDays = days;

    $('#dates').append(`<tr id="${job}" class="color${counter}"><th>${job}</th>`);
    // $('#hidden').append(`<tr class="${job}"><th>${job}</th>`);
    for (let i = 0; i < wkDays.length - 1; i++) {
      const dateId = new Firebase('https://flickering-torch-237.firebaseio.com/' + jobKey + '/' + wkDays[i]);
      dateId.once('child_added', function (dt) {
        const times = dt.val();
        $(`#${job}`).append(`<td class="box${i}">${times}</td></tr>`);
        $(`.hidden`).append(`<input class="timeInput" value="${times}" />`);
      });
    }
  }

  function weeklyTotal() {
    let tots = 0;
    const len = days.length;

    for (let i = 0; i < len - 1; i++) {
      $(`.box${i}`).each(function () {
        tots += parseFloat($(this).text());
      });
    }
    eachTot += tots + ',';
    newTot = eachTot.split(',');
    return newTot;
  }

  function getWeeklyTime() {
    let time = 0;
    $('.timeInput').each(function () {
      time += Number($(this).val());
    });
    return time;
  }

  function eachTotals() {
    const total = weeklyTotal();
    let jobTotal = 0;
    if (counter === 1) {
      jobTotal = total[1];
    } else if (counter === 2) {
      jobTotal = Number(total[2] - total[1]);
    } else if (counter === 3) {
      jobTotal = Number(total[3] - total[2]);
    } else if (counter === 4) {
      jobTotal = Number(total[4] - total[3]);
    } else if (counter === 5) {
      jobTotal = Number(total[5] - total[4]);
    }
      // $(`#bar${job}`).append(`<span>${jobTotal}</span>`);
    return jobTotal;
  }

  function getIndivId() {
    let tempId = [];
    const barId = $('#dates tr').map(function () {
      return this.id;
    }).get();
    for (let i = 0; i < barId.length; i += 1) {
      tempId += barId[i].slice(-20) + ',';
    }
    jobName = tempId.split(',');
  }

  function addCompareBars(job) {
    const total = eachTotals();
    const jobTotal = parseInt(Number(total / 3600), 10) + ' hrs. ' + Number(total % 60) + ' mins.';
    // console.log(numTotal);
    $('.bars').append(
      `<label class="col-xs-2">${job}: </label>
      <div class="progress compare">
        <span id="bar${job}" class="col-xs-6 progress-bar progress-bar-striped active color${counter}" role="progressbar" aria-valuemin="0" aria-valuemax="100" style="width:0%">
        </span><span>${jobTotal}</span>
      </div>`
    );
  }

  function getDailyTotals() {
    let mon = 0;
    let tue = 0;
    let wed = 0;
    let thu = 0;
    let fri = 0;
    let sat = 0;
    let sund = 0;

    $('.box0').each(function () {
      mon += parseFloat($(this).text());
    });
    $('.box1').each(function () {
      tue += parseFloat($(this).text());
    });
    $('.box2').each(function () {
      wed += parseFloat($(this).text());
    });
    $('.box3').each(function () {
      thu += parseFloat($(this).text());
    });
    $('.box4').each(function () {
      fri += parseFloat($(this).text());
    });
    $('.box5').each(function () {
      sat += parseFloat($(this).text());
    });
    $('.box6').each(function () {
      sund += parseFloat($(this).text());
    });
    $('#dailyTotals').append(`<tr><th >Totals:</th> <td>${mon}</td> <td>${tue}</td> <td>${wed}</td> <td>${thu}</td> <td>${fri}</td> <td>${sat}</td> <td>${sund}</td></tr>`);
  }
  function weeklyCompare() {
    let percentage = 0;
    let jobTotal = [];
    allTotals = weeklyTotal();
    numTotal = getWeeklyTime();
    getIndivId();
    getDailyTotals();
    for (let i = 0; i < counter; i++) {
      jobTotal[i] = Number(allTotals[i + 1] - allTotals[i]);
    }
    for (let i = 0; i < counter; i++) {
      const barWidth = document.getElementById(`bar${jobName[i]}`);
      percentage = parseInt((jobTotal[i] / numTotal) * 100, 10);
      barWidth.style.width = `${percentage}%`;
      barWidth.textContent = `${percentage}%`;
    }
  }

  $('#thisWeek').on('click', thisWk);
  $('#lastWeek').on('click', lastWk);
  $('#compare').on('click', weeklyCompare);
}

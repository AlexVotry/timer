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
  var id = 0;
  var task = new Firebase('https://flickering-torch-237.firebaseio.com/');

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
    var fireId = data.key().slice(-19);
    id += 1;
    changeName(id, jobs.job.name, fireId);
    // checkTime(job.hour, job.minute);
    console.log(jobs.job.name);
    console.log(id);
    console.log(fireId);
  });
  // console.log("array of id" + id);

  function changeName(id, name, fireId) {
    $('#jobList').append(`<button id="job${fireId}" class="col-xs-6 btn btn-lg color${id}">${name}</button>
    <button id="edit${fireId}" class="col-xs-2 col-xs-offset-4 btn btn-lg color${id}">edit</button>`);

    $('#timerDisplay').append(`<input type="text" name="secs" id="secs${id}" class="col-xs-2"></input>`);
    }
    // $('#timerDisplay').append(
    //   `<input class="col-xs-3" type="number" id="hrDisplay${id}" value="${job.hour}">`
    //   `<input class="col-xs-3" type="number" id="minDisplay${id}" value="${job.minute}"`);
    // }

  // function checkTime(hr, min, id) {
  //   $('#timerDisplay')
  // }

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

  $('#jobList').toggleClick(startTimer, endTimer);
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
    document.getElementById('secs').value = elapsedSec;
    $('#timerDisplay').text(`${today.getDay()}  ${elapsedHrs} : ${elapsedMns} : ${elapsedSec}`);
  }

  function endTimer() {
    clearInterval(startTime);
  }
}

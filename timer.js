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
  var jobId = [];
  var task = new Firebase('https://flickering-torch-237.firebaseio.com/');

  $('#addIt').on('click', function(e) {
    var name =      $('#job').val();
    var date =      $('#date').val();
    var hour =      $('#hour').val();
    var minute =    $('#minute').val();
    var location =  $('#location').val();
    id += 1;
    task.push({
      job: {
        id: id,
        name: name,
    }});
    $('#job').val() = '';
  });

  // task.on('child_added', function(data) {
  //   var jobs = data.val();
  //   changeName(jobs.job.id, jobs.job.name);
  //   // checkTime(job.hour, job.minute);
  //   console.log(jobs.job.name);
  // });
  task.on('child_added', function(data) {
    var jobs = job.data.val();
    changeName(jobs.id, jobs.name);
    for (var i = 0; i < data.length; i++) {
      id = data[i].val();
      console.log(id);
    }
  })
  function changeName(id, name) {
    $('#jobList').append(`<button id="job${id}" class="col-xs-6 btn btn-lg color${id}">${name}</button>
    <button class="col-xs-2 col-xs-offset-4 btn btn-lg color${id}">edit</button>`);

    $('#timerDisplay').append(`<input type="text" name="secs" id="secs${id}" class="col-xs-2"></input>`);
    }

  function checkTime(hr, min, id) {
    $('#timerDisplay')
  }

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
    document.getElementById('mins').value = elapsedMns;
    document.getElementById('hrs').value = elapsedHrs;
    $('#timerDisplay').append(`<input type="text" name="secs" id="secs${id}" class="col-xs-2"></input>`);

    $('#timerDisplay').text(`${today.getDay()}  ${elapsedHrs} : ${elapsedMns} : ${elapsedSec}`);
  }
$('#submit').on('click', function() {
  console.log(job1Name);
});
  function endTimer() {
    clearInterval(startTime);
  }
}


// **********************************

// function Job(id, name, date, hr, min, sec) {
//   this.id = id;
//   this.name = name;
//   this.hr = hr;
//   this.min = min;
//   this.sec = sec;
// }

// var job1 = new Job (1, );
// var job1Name = $('#job1Name').val();
// Job.prototype.timer = function () {
//
// };


// var myDataRef = new Firebase('https://flickering-torch-237.firebaseio.com/#');
//
// <body>
//     <input type='text' id='nameInput' placeholder='Name'>
//     <input type='text' id='messageInput' placeholder='Message'>
//     <script>
//       var myDataRef = new Firebase('https://cs1x8a7yniw.firebaseio-demo.com/');
//       $('#messageInput').keypress(function (e) {
//         if (e.keyCode == 13) {
//           var name = $('#nameInput').val();
//           var text = $('#messageInput').val();
//           myDataRef.set('User ' + name + ' says ' + text);
//           $('#messageInput').val('');
//         }
//       });
//     </script>
//   </body>
//
//   The set() function can also be used to write objects.
//   myDataRef.set({name: name, text: text});

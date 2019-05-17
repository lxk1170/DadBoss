$(document).ready(function () {
  // main page buttons
  $("#active-goal").click(() => {
    window.location.href = "/goals";
  });

  // breadcrumbs
  $("#breadcrumbs").click(() => {
    const onPage = window.location.href
    const prevPage = onPage.substr(0, onPage.lastIndexOf("/"))
    window.location.replace(prevPage)
  });

  // goal page
  // set active goal
  $("#set-active-goal").click(() => {
    window.location.href = "/goals/queue"
  })

  // view/edit queue
  $("#edit-goal-queue").click(() => {
    window.location.href = "/goals/queue"
  })

  // goal/queue page
  // select goal from queue
  $(".select-goal").click(() => {
    const goal = $(this).attr("id")
    console.log("selected goal: " + goal)
    // TODO: post to backend /goals/active
    console.log("TODO: post to backend")
    console.log("TODO: get goal from id")
  })


  // create a new goal
  $("#create-goal").click(() => {
    window.location.href = "/goals/queue/add"
  })

  // submit a new goal
  $("#submit-create-goal").click(() => {
    const goal = $("#goal-in").val()

    $.post("goals/queue/add", { goal: goal }, (msg) => {
      // TODO: peek success message
      console.log("received message: " + msg)
    })

    window.location.href = "/goals/queue"
  })

});

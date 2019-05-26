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
  $(".select-goal").click((event) => {
    const goal = event.target.id
    $.post(window.location.origin + "/goals/queue/select", { goal: goal }, (msg) => {
      // TODO: peek success message
      console.log("received message: " + msg)

      // redirect
      setTimeout(() => {
        window.location.href = "/goals"
      }, 2000)
    })
  })

  // create a new goal
  $("#create-goal").click(() => {
    window.location.href = "/goals/queue/add"
  })

  // submit a new goal
  $("#submit-create-goal").click(() => {
    const goal = $("#goal-in").val()

    $.post(window.location.origin + "/goals/queue/add", { goal: goal }, (msg) => {
      // TODO: peek success message
      console.log("received message: " + msg)

      // redirect
      setTimeout(() => {
        window.location.href = "/goals/queue"
      }, 2000)
    })

  })

});

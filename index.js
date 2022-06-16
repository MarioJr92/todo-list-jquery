$(document).ready(() => {
  let tasks = [];
  let filterType = 'all';

  const filterTasks = (element) => {
    let type = $(element).data('type');

    if (!type) {
      type = filterType;
    } else {
      filterType = type;
    }

    $('#todo-list').empty();

    tasks.filter((task) => {
      if (type === 'all') {
        return true;
      } else if (type === 'completed') {
        return task.completed;
      } else if (type === 'active') {
        return !task.completed;
      }
    }).forEach((task) => {
      $('#todo-list').append('<div class="row"><p class="col-xs-8">' + task.content + '</p><button class="delete" data-id="' + task.id + '">Delete</button><input type="checkbox" class="mark-complete" data-id="' + task.id + '"' + (task.completed ? 'checked' : '') + '>');
    });
  };

  const getAndDisplayAllTasks = () => {
    $.ajax({
      type: 'GET',
      url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=470',
      dataType: 'json',
      success: (response, textStatus) => {
        tasks = response.tasks;
        filterTasks();
      },
      error: (request, textStatus, errorMessage) => {
        console.log(errorMessage);
      }
    });
  };

  const createTask = () => {
    $.ajax({
      type: 'POST',
      url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks?api_key=470',
      contentType: 'application/json',
      dataType: 'json',
      data: JSON.stringify({
        task: {
          content: $('#new-task-content').val()
        }
      }),
      success: (response, textStatus) => {
        $('#new-task-content').val('');
        getAndDisplayAllTasks();
      },
      error: (request, textStatus, errorMessage) => {
        console.log(errorMessage);
      }
    });
  };

  $('#create-task').on('submit', function (e) {
    e.preventDefault();
    createTask();
  });

  $('.filter').on('click', function (e) {
    e.preventDefault();
    filterTasks(this);
  });

  const deleteTask = (id) => {
    $.ajax({
      type: 'DELETE',
      url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + id + '?api_key=470',
      success: (response, textStatus) => {
        getAndDisplayAllTasks();
      },
      error: (request, textStatus, errorMessage) => {
        console.log(errorMessage);
      }
    });
  };

  $(document).on('click', '.delete', function () {
    deleteTask($(this).data('id'));
  });

  const markTaskComplete = (id) => {
    $.ajax({
      type: 'PUT',
      url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + id + '/mark_complete?api_key=470',
      dataType: 'json',
      success: (response, textStatus) => {
        getAndDisplayAllTasks();
      },
      error: (request, textStatus, errorMessage) => {
        console.log(errorMessage);
      }
    });
  };

  const markTaskActive = id => {
    $.ajax({
      type: 'PUT',
      url: 'https://altcademy-to-do-list-api.herokuapp.com/tasks/' + id + '/mark_active?api_key=470',
      dataType: 'json',
      success: (response, textStatus) => {
        getAndDisplayAllTasks();
      },
      error: (request, textStatus, errorMessage) => {
        console.log(errorMessage);
      }
    });
  };

  $(document).on('change', '.mark-complete', function () {
    if (this.checked) {
      markTaskComplete($(this).data('id'));
    } else {
      markTaskActive($(this).data('id'));
    }
  });

  getAndDisplayAllTasks();
});
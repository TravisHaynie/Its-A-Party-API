// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) && [];
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Function to generate a unique task id
function generateTaskId() {
    nextId++;
    localStorage.setItem("nextId", JSON.stringify(nextId));
}

// Function to create a task card
function createTaskCard(task) {
    const taskCard = $('<div>').addClass('task-card');

    const today = dayjs();
    const dueDate = dayjs(task.deadline);
    if (dueDate.isAfter(today, 'day')) {
        taskCard.addClass('overdue');
    } else if (dueDate.diff(today, 'day') <= 1) {
        taskCard.addClass('almost-due');
    }
    // Create elements for task details
    const titleElement = $('<h3>').text(task.title);
    const deadlineElement = $('<p>').text(`Deadline: ${task.deadline}`);
    const descriptionElement = $('<p>').text(task.description);

    // Append task details to the task card
    taskCard.append(titleElement, deadlineElement, descriptionElement);

    // Append the task card to a container element in your HTML (e.g., a div with id 'task-board')
    $('#task-board').append(taskCard);
}

// Function to render the task list and make cards draggable
function renderTaskList() {
    taskList.forEach(task => {
        createTaskCard(task);
    });

    $('.task-card').draggable({
        revert: 'invalid',
        cursor: 'move'
    });
}

// Function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();
    let title = $('#title').val();
    let deadline = $('#datepicker').val();
    let description = $('#description').val();

    let newTask = {
        id: generateTaskId(),
        title: title,
        deadline: deadline,
        description: description,
        status: 'to-do'
    };

    taskList.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(taskList));

    createTaskCard(newTask);
    $('.task-card').draggable({
        revert: 'invalid',
        cursor: 'move'
    });

    $('#formData').modal('hide');
}

// Function to handle deleting a task
function handleDeleteTask(event) {
    // Find the task card that contains the delete button that was clicked
    let taskCard = $(event.target).closest('.task-card');

    // Get the task id from the task card
    let taskId = taskCard.data('id');

    // Remove the task from the taskList array
    taskList = taskList.filter(task => task.id !== taskId);

    // Update localStorage with the modified taskList
    localStorage.setItem('tasks', JSON.stringify(taskList));

    // Remove the task card from the UI
    taskCard.remove();
}

// Function to handle dropping a task into a new status lane
function handleDrop(event,ui) {
    const droppedTaskId = ui.draggable.data('id');
    const newStatus = $(this).attr('id');

    // Find the dropped task in the taskList
    const droppedTaskIndex = taskList.findIndex(task => task.id === droppedTaskId);
    if (droppedTaskIndex == 1) {
        // Update the status of the dropped task
        taskList[droppedTaskIndex].status = newStatus;
    }
    if (newStatus === 'done') {
        ui.draggable.removeClass('overdue almost-due');
        ui.draggable.css('background-color', 'white');
    }
}


$(document).ready(function () {
    renderTaskList();
    // Make task cards draggable
    $('.task-card').draggable({
        revert: 'invalid',
        cursor: 'move'
    });

    // Make swim lanes droppable
    $('.lane').droppable({
        drop: handleDrop
    });

    //added click event to save changes button
    $('#save-changes').click(handleAddTask);

    // Initialize date picker for due date field
    $('#datepicker').datepicker({
        changeMonth: true,
        changeYear: true,
    });
});
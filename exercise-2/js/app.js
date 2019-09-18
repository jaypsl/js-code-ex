(function() {
  var taskInput = document.getElementById('new-task');
  var addButton = document.getElementById('add');
  var incompleteTasksHolder = document.getElementById('incomplete-tasks');
  var completedTasksHolder = document.getElementById('completed-tasks');
  var todoList = JSON.parse(localStorage.getItem('todoList')) || [];
  var completedList = JSON.parse(localStorage.getItem('completedList')) || [];
  var currentEditText = null;

  var todoLength = todoList.length;
  for (var todo = 0; todo < todoLength; todo++) {
    incompleteTasksHolder.appendChild(createNewTaskElement(todoList[todo]));
  }

  var completedTodoLength = completedList.length;
  for (var todo = 0; todo < completedTodoLength; todo++) {
    completedTasksHolder.appendChild(createNewTaskElement(completedList[todo], true));
  }

  function createNewTaskElement(taskString, completed) {
    listItem = document.createElement('li');
    checkBox = document.createElement('input');
    label = document.createElement('label');
    editInput = document.createElement('input');
    editButton = document.createElement('button');
    deleteButton = document.createElement('button');

    checkBox.type = 'checkbox';
    if (completed) {
      checkBox.checked = true;
    }
    editInput.type = 'text';
    editButton.innerText = 'Edit';
    editButton.className = 'edit';
    deleteButton.innerText = 'Delete';
    deleteButton.className = 'delete';
    label.innerText = taskString;

    listItem.appendChild(checkBox);
    listItem.appendChild(label);
    listItem.appendChild(editInput);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);

    return listItem;
  }

  var addTask = function() {
    const inputValue = taskInput.value;
    if (inputValue) {
      todoList.push(inputValue);
      localStorage.setItem('todoList', JSON.stringify(todoList));
      listItem = createNewTaskElement(inputValue);
      incompleteTasksHolder.appendChild(listItem);
      bindTaskEvents(listItem, taskCompleted);
      taskInput.value = '';
      document.getElementById('demo').innerHTML = '';
    } else {
      document.getElementById('demo').innerHTML = 'Please Enter Something!!!';
    }
  };

  var editTask = function() {
    var listItem = this.parentNode;
    var editInput = listItem.querySelectorAll('input[type=text')[0];
    var label = listItem.querySelector('label');
    var button = listItem.getElementsByTagName('button')[0];

    var containsClass = listItem.classList.contains('editMode');

    if (containsClass) {
      label.innerText = editInput.value;
      button.innerText = 'Edit';
    } else {
      editInput.value = label.innerText;
      button.innerText = 'Save';
      editInput.onchange = handleEditTodo;
      currentEditText = label.innerText;
    }

    listItem.classList.toggle('editMode');
  };

  function handleEditTodo(event) {
    todoList = todoList.map(function(todo) {
      if (todo === currentEditText) {
        return event.target.value;
      }
      return todo;
    });
    localStorage.setItem('todoList', JSON.stringify(todoList));
  }

  var deleteTask = function(el) {
    var listItem = this.parentNode;
    var label = listItem.children[1];
    var value = '';
    if (label) {
      value = label.innerText;
    }
    var ul = listItem.parentNode;

    if (ul.id === 'completed-tasks') {
      completedList = completedList.filter(function(todo) {
        return todo !== value;
      });
      localStorage.setItem('completedList', JSON.stringify(completedList));
    } else {
      todoList = todoList.filter(function(todo) {
        return todo !== value;
      });

      localStorage.setItem('todoList', JSON.stringify(todoList));
    }

    ul.removeChild(listItem);
  };

  var taskCompleted = function(el) {
    var listItem = this.parentNode;
    completedTasksHolder.appendChild(listItem);

    bindTaskEvents(listItem, taskIncomplete);

    var value = this.parentNode.children[1].innerText;

    todoList = todoList.filter(function(todo) {
      return todo !== value;
    });

    completedList.push(value);

    localStorage.setItem('todoList', JSON.stringify(todoList));
    localStorage.setItem('completedList', JSON.stringify(completedList));
  };

  var taskIncomplete = function() {
    var listItem = this.parentNode;
    incompleteTasksHolder.appendChild(listItem);
    bindTaskEvents(listItem, taskCompleted);

    var value = this.parentNode.children[1].innerText;

    completedList = completedList.filter(function(todo) {
      return todo !== value;
    });

    todoList.push(value);
    localStorage.setItem('todoList', JSON.stringify(todoList));
    localStorage.setItem('completedList', JSON.stringify(completedList));
  };

  var bindTaskEvents = function(taskListItem, checkBoxEventHandler, cb) {
    var checkBox = taskListItem.querySelectorAll('input[type=checkbox]')[0];
    var editButton = taskListItem.querySelectorAll('button.edit')[0];
    var deleteButton = taskListItem.querySelectorAll('button.delete')[0];
    editButton.onclick = editTask;
    deleteButton.onclick = deleteTask;
    checkBox.onchange = checkBoxEventHandler;
  };

  addButton.addEventListener('click', addTask);

  var initTodoLength = incompleteTasksHolder.children.length;
  for (var i = 0; i < initTodoLength; i++) {
    bindTaskEvents(incompleteTasksHolder.children[i], taskCompleted);
  }

  var initCompletedList = completedTasksHolder.children.length;
  for (var i = 0; i < initCompletedList; i++) {
    bindTaskEvents(completedTasksHolder.children[i], taskIncomplete);
  }
})();

let jsonURl = "http://localhost:3000/todos/";
var globalAllTaskObject = [];
var globalAllUserIds = [];

fetchData();

//1.Retrive
function fetchData() {
  fetch(jsonURl)
    .then((response) => response.json())
    .then((allTaskObject) => {
      // alert("Hello manish");
      globalAllTaskObject = allTaskObject;
      getAllUserId(globalAllTaskObject);
      userDropdownList(); //2
      generateLayout(globalAllTaskObject, globalAllUserIds); //4
    });
}

function getAllUserId(taskObject) {
  taskObject.forEach((uniqueUser) => {
    if (globalAllUserIds.includes(uniqueUser.userId) == false) {
      globalAllUserIds.push(uniqueUser.userId);
    }
  });
}

function getUserId(userTaskObject) {
  const uniqueUserId = [];
  userTaskObject.forEach((uniqueUser) => {
    if (uniqueUserId.includes(uniqueUser.userId) == false) {
      uniqueUserId.push(uniqueUser.userId);
    }
  });
  return uniqueUserId;
}

//3
function userDropdownList() {
  var userDropdown = document.getElementById("userDropdown");
  userDropdown.innerHTML = "";
  userDropdown.innerHTML += `<option value="all_users" selected>All User</option>`;

  globalAllUserIds.forEach((userId) => {
    var option = `<option value="${userId}">User Id: ${userId}</option>`;
    userDropdown.innerHTML += option;
  });
}

//5
function filterUser() {
  // 4.1 get the sort value from searchForm
  var selectBox1 = document.getElementById("userDropdown");
  var selectedUser = selectBox1.value;
  var selectBox2 = document.getElementById("statusDropdown");
  var selectedStatus = selectBox2.value;

  var filterTaskObject = [];
  let filterUserIds = [];

  //filter to user
  if (selectedUser == "all_users") {
    globalAllTaskObject.forEach((userObj) => filterTaskObject.push(userObj));
    filterUserIds = getUserId(filterTaskObject);
  } else {
    filterTaskObject = globalAllTaskObject.filter(
      (taskObj) => taskObj.userId == selectedUser
    );
    filterUserIds = getUserId(filterTaskObject);
  }

  //filter according to status
  if (selectedStatus != "all_status") {
    filterTaskObject = filterUserByTaskStatus(
      filterTaskObject,
      selectedStatus == "completed" // gives true|false
    );
  }

  generateLayout(filterTaskObject, filterUserIds); //6
}

function filterUserByTaskStatus(filterTaskObject, status) {
  var arr = filterTaskObject.filter((taskObj) => taskObj.status == status);
  return arr;
}
function generateLayout(filterTaskObject, filterUserIds) {
  let postsDiv = document.getElementById("users");
  postsDiv.innerHTML = "";

  filterUserIds.forEach(userDiv);
  function userDiv(userID) {
    userTaskDIv = `
                  <div id="userDiv_${userID}" class="aUserDiv">
                    <h2>UserId: ${userID}</h2>
                    <input type="text" id="addTask${userID}" placeholder="Add a new task." onkeydown="createTask(event, ${userID})"/>
                    <div id="taskInComplete_${userID}" class="taskInComplete"></div><hr>
                    <div id="taskComplete_${userID}" class="taskComplete"></div>
                  </div>
                  `;
    postsDiv.innerHTML += userTaskDIv;
  }
  displayData(filterTaskObject);
}
//7
function displayData(filterTaskObject) {
  filterTaskObject.forEach(userDetial);
  function userDetial(taskObj) {
    let task = `<div  class="task" id="taskDiv${taskObj.id}">
                  <input type="checkbox" class="checkBox" id="taskCheck${taskObj.id}" onclick="changeStatus(${taskObj.status},${taskObj.id})" ${taskObj.status ? "checked" : ""}>
                  <label class="checkLabel" for="taskCheck${taskObj.id}" id="task${taskObj.id}">${taskObj.title}</label>
                  <button type="button" class="update" onclick="changeTitleTag(${taskObj.id},'${taskObj.title}')">&#9999</button>
                  <button type="button" class="delTask" onclick="deleteTask(${taskObj.id})">X</button>
                </div>
                `;
    // let userTaskDIv = document.getElementById("userDiv_" + taskObj.userId);
    if (taskObj.status) {
      let x = document.getElementById("taskCheck" + taskObj.id);

      let taskComplete = document.getElementById(
        "taskComplete_" + taskObj.userId
      );
      taskComplete.innerHTML += task;
    } else {
      let taskComplete = document.getElementById(
        "taskInComplete_" + taskObj.userId
      );
      taskComplete.innerHTML += task;
    }
  }
}





//Update status to server
function changeStatus(stat, taskId) {
  fetch(jsonURl + taskId, {
    method: "PATCH",
    body: JSON.stringify({
      status: !stat,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((json) => {
      fetchData();
      changeVariableStatus(taskId);
    });
}

//Update status to variable
function changeVariableStatus(taskId) {
  globalAllTaskObject.forEach(
    (taskObj)=> {
      if(taskObj.id == taskId){
        console.log(taskObj.status)
        taskObj.status = !taskObj.status
        console.log(taskObj.status)
      }
    }
    );
  generateLayout(globalAllTaskObject, globalAllUserIds);
}




//Delete To server
function deleteTask(taskId) {
  let deleteConfirm = confirm("Do you really wanna delete it?");
  if (deleteConfirm) {
    fetch(jsonURl + taskId, {
      method: "DELETE",
    }).then(() => {
      console.log("Task " + taskId + " Deleted !");
      console.log()
      // fetchData();

      console.log("hi")
      console.log(globalAllTaskObject.length);
      deleteTaskObj(taskId);
      console.log(globalAllTaskObject.length);
    });
  }
}

//Delete To variable
function deleteTaskObj(taskId) {
  globalAllTaskObject.forEach(
    (taskObj)=> {
      if(taskObj.id == taskId){
        globalAllTaskObject.splice(globalAllTaskObject.indexOf(taskObj),1)
      }
    }
    );
  generateLayout(globalAllTaskObject, globalAllUserIds);
}





//create To server
function createTask(event, uId) {
  if (event.keyCode === 13) {
    let title = document.getElementById("addTask" + uId).value;
    let newTaskObj1 = {
      userId: uId,
      title: title,
      status: false,
    };

    fetch(jsonURl, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(newTaskObj1),
    })
      .then((response) => response.json())
      .then((jsonResponse) => {
        console.log(jsonResponse);
        createNewTaskObj(jsonResponse);
      });
  }
  // else {
  // console.log("hello1");
  //   console.log("hello2");
  // }
  // return false;
}


//create To variable
function createNewTaskObj(jsonResponse) {
  console.log(jsonResponse);
  //create new task object
  let newTaskObj = {
    id: jsonResponse.id,
    userId: jsonResponse.userId,
    title: jsonResponse.title,
    status: jsonResponse.status,
  };
  //add|push it to globalAllTaskObject
  globalAllTaskObject.push(newTaskObj);
  // call generateLayout function and pass globalAllTaskObject & globalAllUserIds
  generateLayout(globalAllTaskObject, globalAllUserIds);
}



var updateBoolen = true;
function changeTitleTag(id, title) {
  let taskTitle = document.getElementById("task" + id);
  // taskOfTask=id;

  if (updateBoolen) {
    let input = document.createElement("INPUT");
    input.setAttribute("type", "text");
    input.setAttribute("id", "task"+id);
    input.setAttribute("value", title);
    input.setAttribute("onkeydown", "changeTitle(event, "+id+")");

    taskTitle.replaceWith(input)
    input.focus();
    const inputLength = input.value.length;
    input.setSelectionRange(inputLength, inputLength);

    updateBoolen = !updateBoolen;
  } else {
    let label = document.createElement("Label");
    label.setAttribute("class", "checkLabel");
    label.setAttribute("for", "taskCheck"+id);
    label.setAttribute("id", "task"+id);
    taskTitle.replaceWith(label);
    label.innerHTML= title;
    taskTitle.replaceWith(label);
    updateBoolen = !updateBoolen;
  }
}




//Update title to server
function changeTitle(event, taskId) {
  if (event.keyCode === 13) {
    let title = document.getElementById("task" + taskId).value;
    let updateConfirm = confirm("Do you really wanna update title?");
    if (updateConfirm) {
      fetch(jsonURl + taskId, {
        method: "PATCH",
        body: JSON.stringify({
          title: title,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((json) => {
          changeVariableTitle(taskId, title)
        });
    // } else {
    //   changeVariableTitle(taskId, title)
    }
  }
}

//Update title to variable
function changeVariableTitle(taskId, title) {
  globalAllTaskObject.forEach(
    (taskObj)=> {
      if(taskObj.id == taskId){
        console.log(taskObj.title)
        taskObj.title = title
        console.log(taskObj.title)
      }
    }
    );
  generateLayout(globalAllTaskObject, globalAllUserIds);
}

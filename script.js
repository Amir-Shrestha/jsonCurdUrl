let jsonURl = "http://localhost:3000/todos/";
var globalTaskObject = [];
fetchData();

//1
function fetchData() {
  fetch(jsonURl)
    .then((response) => response.json())
    .then((allTaskObject) => {
      globalTaskObject = allTaskObject;
      let userIds = getUserId(allTaskObject);
      userDropdownList(userIds); //2
      generateLayout(allTaskObject, userIds); //4
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
function userDropdownList(userIds) {
  var userDropdown = document.getElementById("userDropdown");
  userDropdown.innerHTML = "";
  userDropdown.innerHTML += `<option value="all_users" selected>All User</option>`;

  userIds.forEach((userId) => {
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
  var userIds = [];

  //filter to user
  if (selectedUser == "all_users") {
    globalTaskObject.forEach((userObj) => filterTaskObject.push(userObj));
    userIds = getUserId(filterTaskObject);
  } else {
    filterTaskObject = globalTaskObject.filter(
      (taskObj) => taskObj.userId == selectedUser
    );
    userIds = getUserId(filterTaskObject);
  }

  //filter according to status
  if (selectedStatus != "all_status") {
    filterTaskObject = filterUserByTaskStatus(
      filterTaskObject,
      selectedStatus == "completed" // gives true|false
    );
  }

  generateLayout(filterTaskObject, userIds); //6
}

function filterUserByTaskStatus(filterTaskObject, status) {
  var arr = filterTaskObject.filter((taskObj) => taskObj.status == status);
  return arr;
}

function generateLayout(filterTaskObject, userIds) {
  let postsDiv = document.getElementById("users");
  postsDiv.innerHTML = "";

  userIds.forEach(userDiv);
  function userDiv(userID) {
    userTaskDIv = `
                  <div id="userDiv_${userID}" class="aUserDiv">
                    <h2>UserId: ${userID}</h2>
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
    let task = `<div  class="task">
                  <input type="checkbox" name="taskCheck" onclick="changeStatus(${taskObj.status},${taskObj.id})">
                  <label for="taskCheck">${taskObj.title}</label>
                  <button type="button" class="delTask" onclick="deleteTask(${taskObj.id})">X</button>
                </div>
                `;
    // let userTaskDIv = document.getElementById("userDiv_" + taskObj.userId);
    if (taskObj.status) {
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

function deleteTask(taskId) {
  let deleteConfirm = confirm("Do you really wanna delete it?");
  if (deleteConfirm) {
    fetch(jsonURl + taskId, {
      method: "DELETE",
    }).then(() => {
      console.log("Task " + taskId + " Deleted !");
      fetchData();
    });
  } else {
    fetchData();
  }
}

function changeStatus(stat, taskId) {
  let updateConfirm = confirm("Do you really wanna update status?");
  if (updateConfirm) {
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
        // console.log("Task  status changed to " + json.status, json);
        // location.reload();
      });
  } else {
    fetchData();
    // location.reload();
  }
}

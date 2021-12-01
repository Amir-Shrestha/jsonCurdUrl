let jsonURl = "http://localhost:3000/todos/";
const uniqueUserId = [];
fetchData();

//1
function fetchData() {
  fetch(jsonURl)
    .then((response) => response.json())
    .then((allPostsJSONArray) => {
      userDropdownList(allPostsJSONArray); //2
      filterUser(allPostsJSONArray); //4
    });
}

//3
function userDropdownList(allPostsJSONArray) {
  allPostsJSONArray.forEach((uniqueUser) => {
    if (uniqueUserId.includes(uniqueUser.userId) == false) {
      uniqueUserId.push(uniqueUser.userId);
    }
  });

  uniqueUserId.forEach((userId) => {
    var option = document.createElement("option");
    option.innerHTML = "User Id: " + userId;
    option.value = userId;
    document.getElementById("userDropdown").appendChild(option);
  });
}

//5
function filterUser(allPostsJSONArray) {
  displayData(allPostsJSONArray); //6
}

//7
function displayData(allPostsJSONArray) {
  let postsDiv = document.getElementById("posts");
  postsDiv.innerHTML = "";
  let taskInComplete = `<div class="taskInComplete"> <b>InComplete:</b>`;
  let taskComplete = `<div class="taskComplete"> <b>Complete:</b>`;
  allPostsJSONArray.forEach(postDetial);
  function postDetial(postObj) {
    let apost_open = `
          <div class="post">
            <p>User Id: ${postObj.userId}</p>`;
    if (postObj.status == false) {
      taskInComplete += `
      <p>Title: ${postObj.title} Status: ${postObj.status}</p>
      <button type="button" class="" onclick="deleteTask(${postObj.id})">X</button>
      <input type="checkbox" onclick="changeStatus(${postObj.userId},'${postObj.title}',${postObj.status},${postObj.id})">
        `;
    } else {
      taskComplete += `
      <p>Title: ${postObj.title} Status: ${postObj.status}</p>
      <button type="button" class="" onclick="deleteTask(${postObj.id})">X</button>
      <input type="checkbox" onclick="changeStatus(${postObj.userId},'${postObj.title}',${postObj.status},${postObj.id})">
        `;
    }
    let apost_close = `</div>
          <hr><hr>`;
    postsDiv.innerHTML +=
      apost_open +
      taskInComplete +
      "</div>" +
      taskComplete +
      "</div>" +
      apost_close;
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

function changeStatus(uId, taskTitle, stat, taskId) {
  let updateConfirm = confirm("Do you really wanna update status?");
  if (updateConfirm) {
    fetch(jsonURl + taskId, {
      method: "PUT",
      body: JSON.stringify({
        userId: uId,
        title: taskTitle,
        status: !stat,
      }),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((json) => {
        console.log("Task  status changed to " + json.status, json);
        fetchData();
      });
  } else {
    fetchData();
  }
}

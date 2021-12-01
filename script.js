let jsonURl = "http://localhost:3000/todos";
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
  allPostsJSONArray.forEach(postDetial);
  function postDetial(postObj) {
    apost = `
          <div class="post">
          <p>User Id: ${postObj.userId}</p>
          <p>Post Id: ${postObj.id}</p>
          <p>Title: ${postObj.title}</p>
          <p>Status: ${postObj.status}</p>
          <button type="button" class="" onclick="deleteTask(${postObj.id})">X</button>
          <input type="checkbox" onclick="changeStatus(${postObj.id},${postObj.status})">
          </div>
        <hr>
        `;
    postsDiv.innerHTML += apost;
  }
}

function deleteTask(taskId) {
  let deleteConfirm = confirm("Do you really wanna delete it?");
  if (deleteConfirm) {
    fetch("http://localhost:3000/todos/" + taskId, {
      method: "DELETE",
    }).then(() => {
      console.log("Task " + taskId + " Deleted !");
      fetchData();
    });
  } else {
    fetchData();
  }
}

function changeStatus(taskId, stat) {
  let updateConfirm = confirm("Do you really wanna update status?");
  if (updateConfirm) {
    fetch("http://localhost:3000/todos/" + taskId, {
      method: "PUT",
      body: JSON.stringify({
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

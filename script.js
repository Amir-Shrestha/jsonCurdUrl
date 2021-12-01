let jsonURl = "http://localhost:3000/todos";

fetchData();

function fetchData() {
  fetch(jsonURl)
    .then((response) => response.json())
    .then((allPostsJSONArray) => filterUser(allPostsJSONArray));
}

function filterUser(allPostsJSONArray) {
  displayData(allPostsJSONArray);
}

function displayData(allPostsJSONArray) {
  let postsDiv = document.getElementById("posts");
  allPostsJSONArray.forEach(postDetial);
  function postDetial(postObj) {
    let apost = `
          <div class="post">
          <p>User Id: ${postObj.userId}</p>
          <p>Post Id: ${postObj.id}</p>
          <p>Title: ${postObj.title}</p>
          <p>Body: ${postObj.status}</p>
        </div>
        <hr>
        `;
    postsDiv.innerHTML += apost;
  }
}

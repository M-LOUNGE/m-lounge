const ADMIN_PASSWORD = "admin123";

// Submit Film
document.addEventListener("DOMContentLoaded", () => {
  const filmForm = document.getElementById("filmForm");
  if(filmForm){
    filmForm.addEventListener("submit", e => {
      e.preventDefault();
      const submission = {
        title: document.getElementById("title").value,
        director: document.getElementById("director").value,
        synopsis: document.getElementById("synopsis").value,
        cast: document.getElementById("cast").value,
        awards: document.getElementById("awards").value,
        link: document.getElementById("link").value,
        poster: document.getElementById("poster").value || 'images/default-poster.jpg',
        status: "pending"
      };
      let submissions = JSON.parse(localStorage.getItem("submissions")) || [];
      submissions.push(submission);
      localStorage.setItem("submissions", JSON.stringify(submissions));
      alert("Film submitted successfully!");
      filmForm.reset();
    });
  }

  // Load approved films for viewer portal
  displayApprovedFilms();

  // Load admin submissions if dashboard exists
  const submissionsDiv = document.getElementById("submissions");
  if(submissionsDiv){
    let submissions = JSON.parse(localStorage.getItem("submissions")) || [];
    renderSubmissions(submissionsDiv, submissions);
  }
});

// Admin login
function login(){
  const inputPass = document.getElementById("adminPass").value;
  if(inputPass === ADMIN_PASSWORD){
    document.getElementById("login").style.display = "none";
    document.getElementById("dashboard").style.display = "block";
    let submissions = JSON.parse(localStorage.getItem("submissions")) || [];
    renderSubmissions(document.getElementById("submissions"), submissions);
  } else {
    alert("Incorrect password!");
  }
}

// Render admin submissions
function renderSubmissions(container, submissions){
  container.innerHTML = submissions.map((f, index) => `
    <div class="film-card">
      <img src="${f.poster || 'images/default-poster.jpg'}" alt="${f.title} Poster">
      <h3>${f.title}</h3>
      <p><strong>Director:</strong> ${f.director}</p>
      <p>${f.synopsis}</p>
      <p><em>${f.cast}</em></p>
      <p><small>${f.awards}</small></p>
      <a href="${f.link}" target="_blank">Watch Film</a><br><br>
      <button onclick="approve(${index})">Approve</button>
      <button onclick="reject(${index})">Reject</button>
    </div>
  `).join("");
}

// Approve/Reject Functions
function approve(index){
  let submissions = JSON.parse(localStorage.getItem("submissions")) || [];
  submissions[index].status = "approved";
  localStorage.setItem("submissions", JSON.stringify(submissions));
  renderSubmissions(document.getElementById("submissions"), submissions);
  displayApprovedFilms();
}

function reject(index){
  let submissions = JSON.parse(localStorage.getItem("submissions")) || [];
  submissions[index].status = "rejected";
  localStorage.setItem("submissions", JSON.stringify(submissions));
  renderSubmissions(document.getElementById("submissions"), submissions);
  displayApprovedFilms();
}

// Display approved films on viewer portal
function displayApprovedFilms(){
  const releaseList = document.getElementById("release-list");
  if(!releaseList) return;
  let submissions = JSON.parse(localStorage.getItem("submissions")) || [];
  let approved = submissions.filter(f => f.status === "approved");
  releaseList.innerHTML = approved.map(f => `
    <a href="${f.link}" target="_blank" class="film-card">
      <img src="${f.poster || 'images/default-poster.jpg'}" alt="${f.title} Poster">
      <h3>${f.title}</h3>
      <p><strong>Director:</strong> ${f.director}</p>
      <p>${f.synopsis}</p>
      <p><em>${f.cast}</em></p>
      <p><small>${f.awards}</small></p>
    </a>
  `).join("");
}

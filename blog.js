/* ELEMENTS */
const blogGrid = document.getElementById("blogGrid");
const pagination = document.getElementById("pagination");
const searchInput = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");
const noResults = document.getElementById("no-results");

/* STATE */
let currentPage = 1;
const perPage = 6;
let filteredPosts = [...posts];

/* RENDER BLOG CARDS */
function renderPosts(list) {
  blogGrid.innerHTML = "";

  if (list.length === 0) {
    noResults.style.display = "block";
    pagination.innerHTML = "";
    return;
  }

  noResults.style.display = "none";

  list.forEach(post => {
  const card = document.createElement("div");
  card.className = "blog-card";
  card.dataset.title = post.title.toLowerCase();

  card.innerHTML = `
    <img src="${post.image}" alt="${post.title}">
    <div class="blog-content">
      <h3>${post.title}</h3>
      <p>${post.excerpt}</p>
      <a href="post.html?id=${post.id}">Read Article →</a>
    </div>
  `;

  blogGrid.appendChild(card);
});
}

/* PAGINATION HELPERS */
function paginate(list) {
  const start = (currentPage - 1) * perPage;
  return list.slice(start, start + perPage);
}

function setupPagination(list) {
  pagination.innerHTML = ""; 
  const pages = Math.ceil(list.length / perPage);
  const maxVisible = 5; // max buttons to show at once

  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(pages, startPage + maxVisible - 1);

  // Adjust start if we are near the end
  startPage = Math.max(1, endPage - maxVisible + 1);

  // Previous Button
  if (currentPage > 1) {
    const prevBtn = document.createElement("button");
    prevBtn.textContent = "‹";
    prevBtn.addEventListener("click", () => {
      currentPage--;
      renderPosts(paginate(filteredPosts));
      setupPagination(filteredPosts);
      history.pushState(null, "", `?page=${currentPage}`);
    });
    pagination.appendChild(prevBtn);
  }

  // Leading ellipsis
  if (startPage > 1) {
    const firstBtn = document.createElement("button");
    firstBtn.textContent = "1";
    firstBtn.addEventListener("click", () => {
      currentPage = 1;
      renderPosts(paginate(filteredPosts));
      setupPagination(filteredPosts);
      history.pushState(null, "", `?page=1`);
    });
    pagination.appendChild(firstBtn);

    if (startPage > 2) {
      const dots = document.createElement("span");
      dots.textContent = "...";
      dots.style.padding = "8px 5px";
      pagination.appendChild(dots);
    }
  }

  // Main page buttons
  for (let i = startPage; i <= endPage; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    btn.className = i === currentPage ? "active" : "";

    btn.addEventListener("click", () => {
      currentPage = i;
      renderPosts(paginate(filteredPosts));
      setupPagination(filteredPosts);
      history.pushState(null, "", `?page=${i}`);
    });

    pagination.appendChild(btn);
  }

  // Trailing ellipsis
  if (endPage < pages) {
    if (endPage < pages - 1) {
      const dots = document.createElement("span");
      dots.textContent = "...";
      dots.style.padding = "8px 5px";
      pagination.appendChild(dots);
    }

    const lastBtn = document.createElement("button");
    lastBtn.textContent = pages;
    lastBtn.addEventListener("click", () => {
      currentPage = pages;
      renderPosts(paginate(filteredPosts));
      setupPagination(filteredPosts);
      history.pushState(null, "", `?page=${pages}`);
    });
    pagination.appendChild(lastBtn);
  }

  // Next Button
  if (currentPage < pages) {
    const nextBtn = document.createElement("button");
    nextBtn.textContent = "›";
    nextBtn.addEventListener("click", () => {
      currentPage++;
      renderPosts(paginate(filteredPosts));
      setupPagination(filteredPosts);
      history.pushState(null, "", `?page=${currentPage}`);
    });
    pagination.appendChild(nextBtn);
  }
}

/* SEARCH FILTER */
function applyFilters() {
  const query = searchInput.value.toLowerCase().trim();

  filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(query)
  );

  currentPage = 1; // Reset to first page after search

  renderPosts(paginate(filteredPosts));
  setupPagination(filteredPosts);

  // Show or hide "No articles found"
  if (filteredPosts.length === 0) {
    noResults.classList.add("show");
  } else {
    noResults.classList.remove("show");
  }
}

/* EVENTS */
searchInput.addEventListener("input", applyFilters);
searchBtn.addEventListener("click", applyFilters);

// Handle back/forward navigation
window.addEventListener("popstate", () => {
  const urlParams = new URLSearchParams(window.location.search);
  currentPage = parseInt(urlParams.get("page")) || 1;
  renderPosts(paginate(filteredPosts));
  setupPagination(filteredPosts);
});

/* INITIAL LOAD */
const urlParams = new URLSearchParams(window.location.search);
currentPage = parseInt(urlParams.get("page")) || 1;
renderPosts(paginate(filteredPosts));
setupPagination(filteredPosts);

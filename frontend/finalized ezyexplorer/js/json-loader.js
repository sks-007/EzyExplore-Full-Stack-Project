document.addEventListener("DOMContentLoaded", () => {
  fetch("data.json")
    .then(response => response.json())
    .then(data => {
      loadExplore(data.explore);
      loadBlog(data.blog);
    })
    .catch(err => console.error("Error loading JSON:", err));
});

function loadExplore(exploreData) {
  const container = document.getElementById("destinations-grid");
  container.innerHTML = exploreData.map(dest => `
    <div class="destination-card">
      <img src="${dest.image}" alt="${dest.title}">
      <div class="destination-info">
        <h3>${dest.title}</h3>
        <p>${dest.description}</p>
      </div>
    </div>
  `).join("");
}

function loadBlog(blogData) {
  const container = document.getElementById("blog-grid");
  container.innerHTML = blogData.map(post => `
    <article class="blog-card">
      <div class="blog-image">
        <img src="${post.image}" alt="${post.title}">
        <div class="blog-category">${post.category}</div>
      </div>
      <div class="blog-content">
        <h3 class="blog-title">${post.title}</h3>
        <p class="blog-excerpt">${post.excerpt}</p>
        <div class="blog-meta">
          <span class="blog-author">By ${post.author}</span>
          <span class="blog-date">${post.date}</span>
        </div>
      </div>
    </article>
  `).join("");
}

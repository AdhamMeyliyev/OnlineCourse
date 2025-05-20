document.addEventListener("DOMContentLoaded", () => {
  const courseShort = document.getElementById("course-list-short");
  const courseFull = document.getElementById("course-list-full");
  const courseId = new URLSearchParams(window.location.search).get("id");

  fetch("data/courses.json")
    .then((response) => response.json())
    .then((courses) => {
      // Bosh sahifa - faqat 3 ta kurs
      if (courseShort) {
        courses.slice(0, 3).forEach((course) => {
          courseShort.appendChild(createCourseCard(course));
        });
      }

      // Barcha kurslar sahifasi
      if (courseFull) {
        courses.forEach((course) => {
          courseFull.appendChild(createCourseCard(course));
        });
      }

      // Kurs tafsilotlari sahifasi
      if (courseId) {
        const course = courses.find((c) => c.id == courseId);
        if (course) {
          document.getElementById("course-title").textContent = course.title;
          document.getElementById("course-img").src = course.image;
          document.getElementById("course-img").alt = course.title;
          document.getElementById("course-desc").textContent = course.description;
					document.getElementById("courses-link").href = course.link;
          
          // VIDEO LINKNI TO‘G‘RI FORMATGA KELTIRISH
          const embedUrl = convertToEmbedUrl(course.video);
          document.getElementById("course-video").src = embedUrl;
        } else {
          document.body.innerHTML = `<div class="container py-5"><h3 class="text-danger text-center">Kurs topilmadi</h3></div>`;
        }
      }
    })
    .catch(() => {
      if (courseShort || courseFull) {
        (courseShort || courseFull).innerHTML =
          `<p class="text-center text-danger">Kurslarni yuklashda xatolik yuz berdi.</p>`;
      }
    });

  // Kurs kartasi yaratish funktsiyasi
  function createCourseCard(course) {
    const col = document.createElement("div");
    col.className = "col-md-4 mb-4";
    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${course.image}" class="card-img-top" alt="${course.title}" />
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${course.title}</h5>
          <p class="card-text flex-grow-1">${course.description.slice(0, 80)}...</p>
          <a href="course-detail.html?id=${course.id}" class="btn btn-success mt-auto">Ko‘rish</a>

					
        </div>
      </div>
    `;
    return col;
  }

  // 📺 YouTube linkini embed formatga aylantiruvchi funksiya
  function convertToEmbedUrl(url) {
    if (url.includes("youtu.be")) {
      const videoId = url.split("/").pop().split("?")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }

    if (url.includes("watch?v=")) {
      const videoId = new URL(url).searchParams.get("v");
      return `https://www.youtube.com/embed/${videoId}`;
    }

    return url; // boshqa holatlarda asl URLni qaytar
  }
});

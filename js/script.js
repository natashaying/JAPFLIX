// Fetch movies data
let movies = [];

// Obtener los datos de la API y almacenarlos en la variable 'movies'
fetch("https://japceibal.github.io/japflix_api/movies-data.json")
  .then(response => response.json())
  .then(data => {
    movies = data;
  });

// Elementos del DOM
const inputBuscar = document.getElementById("inputBuscar");
const btnBuscar = document.getElementById("btnBuscar");
const lista = document.getElementById("lista");

// Evento para buscar películas al hacer clic en el botón
btnBuscar.addEventListener("click", () => {
  const query = inputBuscar.value.trim().toLowerCase();
  if (!query) return; // No hacer nada si el campo de búsqueda está vacío

  const filteredMovies = movies.filter(movie =>
    ["title", "genres", "tagline", "overview"].some(attr =>
      typeof movie[attr] === "string" && movie[attr].toLowerCase().includes(query)
    )
  );

  displayMovies(filteredMovies);
});

// Mostrar las películas filtradas
function displayMovies(movies) {
  lista.innerHTML = ""; // Limpiar la lista de películas

  movies.forEach(movie => {
    const stars = "★".repeat(Math.round(movie.vote_average / 2)) +
                  "☆".repeat(5 - Math.round(movie.vote_average / 2));

    const listItem = document.createElement("li");
    listItem.classList.add("list-group-item", "list-group-item-dark", "my-2", "p-3");
    listItem.innerHTML = `
      <h5>${movie.title}</h5>
      <p>${movie.tagline || "Sin tagline disponible"}</p>
      <p>Valoración: ${stars}</p>
    `;
    listItem.style.cursor = "pointer";
    
    // Crear un contenedor de detalles
    const detailsContainer = document.createElement("div");
    detailsContainer.classList.add("movie-details", "d-none", "p-3", "bg-dark", "text-light");

    const genres = Array.isArray(movie.genres) ? movie.genres.map(genre => genre.name || genre).join(", ") : "No disponible";
    const releaseYear = new Date(movie.release_date).getFullYear();
    const budget = movie.budget ? `$${movie.budget.toLocaleString()}` : "No disponible";
    const revenue = movie.revenue ? `$${movie.revenue.toLocaleString()}` : "No disponible";

    detailsContainer.innerHTML = `
      <p><strong>Géneros:</strong> ${genres}</p>
      <p><strong>Año de lanzamiento:</strong> ${releaseYear}</p>
      <p><strong>Duración:</strong> ${movie.runtime || "No disponible"} minutos</p>
      <p><strong>Presupuesto:</strong> ${budget}</p>
      <p><strong>Ganancias:</strong> ${revenue}</p>
    `;

    // Agregar evento de clic para desplegar/ocultar los detalles
    listItem.addEventListener("click", () => {
      const isVisible = detailsContainer.classList.contains("d-block");
      detailsContainer.classList.toggle("d-none", isVisible);
      detailsContainer.classList.toggle("d-block", !isVisible);
    });

    // Agregar los detalles dentro de la tarjeta
    listItem.appendChild(detailsContainer);
    lista.appendChild(listItem);
  });
}

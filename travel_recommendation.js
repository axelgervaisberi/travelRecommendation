document.addEventListener("DOMContentLoaded", () => {
  let travelData = {}; // Store fetched data here

  // Fetch data from JSON
  fetch("./travel_recommendation_api.json")
    .then((response) => response.json())
    .then((data) => {
      travelData = data;

      // Add event listener to the search input
      const searchInput = document.getElementById("searchInput");
      const btnSearch = document.getElementById("btnSearch");
      btnSearch.addEventListener("click", () => {
        const searchTerm = searchInput.value.toLowerCase();
        filterAndDisplayDropdown(searchTerm, travelData);
      });
    })
    .catch((error) => console.error("Error fetching data:", error));
});

// Function to filter and display results in the dropdown
function filterAndDisplayDropdown(searchTerm, data) {
  // Combine all search results: cities, temples, beaches
  let results = [];

  if (searchTerm.includes("beach")) {
    results = data.beaches.map((beach) => ({
      type: "Beach",
      name: beach.name,
      description: beach.description,
      imageUrl: beach.imageUrl,
    }));
  } else if (searchTerm.includes("temple")) {
    results = data.temples.map((temple) => ({
      type: "Temple",
      name: temple.name,
      description: temple.description,
      imageUrl: temple.imageUrl,
    }));
  } else if (searchTerm === "country" || searchTerm === "countries") {
    results = data.countries.map((country) => ({
      type: "Country",
      name: country.name,
      description: `Explore cities in ${country.name}`,
      imageUrl: country.cities[0]?.imageUrl || "",
    }));
  } else {
    // General search for cities, temples, and beaches
    data.countries.forEach((country) => {
      country.cities.forEach((city) => {
        if (city.name.toLowerCase().includes(searchTerm)) {
          results.push({
            type: "City",
            name: city.name,
            description: city.description,
            imageUrl: city.imageUrl,
          });
        }
      });
    });

    // Search temples
    data.temples.forEach((temple) => {
      if (temple.name.toLowerCase().includes(searchTerm)) {
        results.push({
          type: "Temple",
          name: temple.name,
          description: temple.description,
          imageUrl: temple.imageUrl,
        });
      }
    });

    // Search beaches
    data.beaches.forEach((beach) => {
      if (beach.name.toLowerCase().includes(searchTerm)) {
        results.push({
          type: "Beach",
          name: beach.name,
          description: beach.description,
          imageUrl: beach.imageUrl,
        });
      }
    });
  }

  // Clear the current dropdown list
  const searchResultList = document.getElementById("searchResultList");
  searchResultList.innerHTML = "";

  // Display filtered results in the dropdown
  results.forEach((result) => {
    const listItem = document.createElement("li");

    // Creating a list item with name and description
    listItem.innerHTML = `
      <img src="${result.imageUrl}" alt="${result.name} Picture" />
      <div class="result-info">
        <h3>${result.name}</h3>
        <p>
          ${result.description}
        </p>
        <button type="button">Visit</button>
      </div>
    `;

    searchResultList.appendChild(listItem);
  });

  // Show or hide the dropdown based on whether there are results
  const searchResultContainer = document.getElementById(
    "searchResultContainer"
  );
  if (results.length > 0 && searchTerm !== "") {
    searchResultContainer.style.display = "block";
  } else {
    searchResultContainer.style.display = "none";
  }
}

const btnClear = document.getElementById("btnClear");

btnClear.addEventListener("click", () => {
  const searchInput = document.getElementById("searchInput");
  searchInput.value = "";
  searchResultContainer.style.display = "none";
});

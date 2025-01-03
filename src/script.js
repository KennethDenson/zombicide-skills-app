// Fetch and display skills from the JSON file
fetch("/data/skills.json")
    .then((response) => response.json())
    .then((data) => {
        const container = document.getElementById("skills-container");
        const searchBar = document.getElementById("search-bar");
        const gameFilter = document.getElementById("game-filter");

        // Initialize a Set for unique game names
        const gameNames = new Set();
        gameNames.add("All Games"); // Add "All Games" only once

        // Iterate through the data to populate game names
        data.forEach((skill) => {
            skill.versions.forEach((version) => {
                gameNames.add(version.game); // Add game names
            });
        });

        // Clear existing dropdown options (if any)
        gameFilter.innerHTML = ""; 

        // Populate the dropdown with unique game names
        gameNames.forEach((game) => {
            const option = document.createElement("option");
            option.value = game;
            option.textContent = game;
            gameFilter.appendChild(option);
        });

        // Function to render skills
        function renderSkills(skills, selectedGame = "All Games", searchTerm = "") {
            container.innerHTML = ""; // Clear container
            skills.forEach((skill) => {
                // Filter versions by game and search term
                const relevantVersions = skill.versions.filter(
                    (version) =>
                        (selectedGame === "All Games" || version.game === selectedGame) &&
                        (skill.name.toLowerCase().includes(searchTerm) ||
                            version.description.toLowerCase().includes(searchTerm))
                );

                if (relevantVersions.length > 0) {
                    const card = document.createElement("div");
                    card.classList.add("skill-card");

                    // Add skill name
                    const title = document.createElement("h2");
                    title.textContent = skill.name;
                    card.appendChild(title);

                    // Add skill descriptions for relevant versions
                    relevantVersions.forEach((version) => {
                        const description = document.createElement("p");
                        description.innerHTML = `<strong>${version.game}:</strong> ${version.description}`;
                        card.appendChild(description);
                    });

                    container.appendChild(card);
                }
            });
        }

        // Initial render
        renderSkills(data);

        // Add search functionality
        searchBar.addEventListener("input", (event) => {
            const searchTerm = event.target.value.toLowerCase();
            renderSkills(data, gameFilter.value, searchTerm);
        });

        // Add game filter functionality
        gameFilter.addEventListener("change", (event) => {
            renderSkills(data, event.target.value, searchBar.value.toLowerCase());
        });
    })
    .catch((error) => console.error("Error loading JSON:", error));
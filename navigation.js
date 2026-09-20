export function setupNavigation({
    elements,
    sections,
    setFigure,
    loadSectionText
}) {
    document
        .querySelectorAll("[data-option]")
        .forEach(button => {
            button.addEventListener("click", () => {
                document
                    .querySelectorAll(".nav-item")
                    .forEach(item => {
                        item.classList.remove("active");
                    });

                button.classList.add("active");

                const option =
                    Number(button.dataset.option);

                setFigure(option);

                elements.sidebar.classList.remove("open");
            });
        });

    document
        .querySelectorAll("[data-section]")
        .forEach(button => {
            button.addEventListener("click", () => {
                const section =
                    sections[button.dataset.section];

                if (!section) {
                    return;
                }

                document
                    .querySelectorAll(".nav-item")
                    .forEach(item => {
                        item.classList.remove("active");
                    });

                button.classList.add("active");

                loadSectionText(
                    section,
                    elements.infoText
                );

                elements.infoTitle.textContent =
                    section.title;

                document
                    .getElementById("infoCard")
                    .scrollIntoView({
                        behavior: "smooth",
                        block: "center"
                    });

                elements.sidebar.classList.remove("open");
            });
        });

    elements.menuButton.addEventListener("click", () => {
        elements.sidebar.classList.toggle("open");
    });
}

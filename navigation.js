export function setupNavigation({
                                    elements,
                                    sections,
                                    setFigure,
                                    loadSectionText
                                }) {

    let currentBuildDimension = null;


    function clearActiveNavigation() {

        document
            .querySelectorAll(".nav-item")
            .forEach(item => {
                item.classList.remove("active");
            });
    }


    function hideAllProjectPages() {

        elements.aboutSection.classList.add(
            "is-hidden"
        );

        elements.instructionsSection.classList.add(
            "is-hidden"
        );

        elements.moreSection.classList.add(
            "is-hidden"
        );

        elements.referencesSection.classList.add(
            "is-hidden"
        );

        elements.creditsSection.classList.add(
            "is-hidden"
        );
    }


    function showVisualizationPage() {

        hideAllProjectPages();

        elements.visualizationSection.classList.remove(
            "is-hidden"
        );
    }


    function showProjectPage(page) {

        elements.visualizationSection.classList.add(
            "is-hidden"
        );

        hideAllProjectPages();

        page.classList.remove(
            "is-hidden"
        );
    }


    function hideProjectionSelector() {

        elements.projectionSelector.classList.add(
            "is-hidden"
        );

        currentBuildDimension = null;
    }


    function showProjectionSelector(dimension) {

        currentBuildDimension = dimension;

        elements.projectionSelector.classList.remove(
            "is-hidden"
        );

        elements.isometricProjection.classList.add(
            "active"
        );

        elements.tesseractProjection.classList.remove(
            "active"
        );
    }


    function selectProjection(type) {

        if (!currentBuildDimension) {
            return;
        }


        if (type === "isometric") {

            elements.isometricProjection.classList.add(
                "active"
            );

            elements.tesseractProjection.classList.remove(
                "active"
            );


            if (currentBuildDimension === 5) {

                setFigure(31);

                elements.pageTitle.textContent =
                    "5-cube-buildup";
            }


            if (currentBuildDimension === 6) {

                setFigure(41);

                elements.pageTitle.textContent =
                    "6-cube-buildup";
            }
        }


        if (type === "tesseract") {

            elements.tesseractProjection.classList.add(
                "active"
            );

            elements.isometricProjection.classList.remove(
                "active"
            );


            if (currentBuildDimension === 5) {

                setFigure(32);

                elements.pageTitle.textContent =
                    "5-cube-buildup";
            }


            if (currentBuildDimension === 6) {

                setFigure(42);

                elements.pageTitle.textContent =
                    "6-cube-buildup";
            }
        }
    }


    document
        .querySelectorAll(".nav-item[data-option]")
        .forEach(button => {

            button.addEventListener("click", () => {

                clearActiveNavigation();

                showVisualizationPage();

                button.classList.add(
                    "active"
                );


                const option =
                    Number(
                        button.dataset.option
                    );


                const buildDimension =
                    Number(
                        button.dataset.buildDimension
                    );


                if (buildDimension === 5) {

                    showProjectionSelector(5);

                    setFigure(31);

                    elements.pageTitle.textContent =
                        "5-cube-buildup";
                }


                else if (buildDimension === 6) {

                    showProjectionSelector(6);

                    setFigure(41);

                    elements.pageTitle.textContent =
                        "6-cube-buildup";
                }


                else {

                    hideProjectionSelector();

                    setFigure(option);
                }


                elements.sidebar.classList.remove(
                    "open"
                );
            });

        });


    document
        .querySelectorAll(".kiss-nav-item")
        .forEach(button => {

            button.addEventListener("click", () => {

                clearActiveNavigation();

                showVisualizationPage();

                hideProjectionSelector();

                button.classList.add(
                    "active"
                );


                setFigure(202);


                elements.sidebar.classList.remove(
                    "open"
                );
            });

        });


    elements.isometricProjection.addEventListener(
        "click",
        () => {

            selectProjection(
                "isometric"
            );
        }
    );


    elements.tesseractProjection.addEventListener(
        "click",
        () => {

            selectProjection(
                "tesseract"
            );
        }
    );


    document
        .querySelectorAll("[data-section]")
        .forEach(button => {

            button.addEventListener("click", () => {

                const sectionName =
                    button.dataset.section;


                const section =
                    sections[sectionName];


                if (!section) {
                    return;
                }


                clearActiveNavigation();

                hideProjectionSelector();

                button.classList.add(
                    "active"
                );


                if (sectionName === "about") {

                    showProjectPage(
                        elements.aboutSection
                    );


                    const text =
                        document.getElementById(
                            "aboutProjectText"
                        );


                    loadSectionText(
                        section,
                        text
                    );


                    elements.pageTitle.textContent =
                        "About the Project";
                }


                if (sectionName === "instructions") {

                    showProjectPage(
                        elements.instructionsSection
                    );


                    const text =
                        document.getElementById(
                            "instructionsText"
                        );


                    loadSectionText(
                        section,
                        text
                    );


                    elements.pageTitle.textContent =
                        "How to Use";
                }


                if (sectionName === "more") {

                    showProjectPage(
                        elements.moreSection
                    );


                    const text =
                        document.getElementById(
                            "moreText"
                        );


                    loadSectionText(
                        section,
                        text
                    );


                    elements.pageTitle.textContent =
                        "More about d-Cube";
                }


                if (sectionName === "references") {

                    showProjectPage(
                        elements.referencesSection
                    );


                    const text =
                        document.getElementById(
                            "referencesText"
                        );


                    loadSectionText(
                        section,
                        text
                    );


                    elements.pageTitle.textContent =
                        "References";
                }


                if (sectionName === "credits") {

                    showProjectPage(
                        elements.creditsSection
                    );


                    const text =
                        document.getElementById(
                            "creditsText"
                        );


                    loadSectionText(
                        section,
                        text
                    );


                    elements.pageTitle.textContent =
                        "Credits";
                }


                elements.sidebar.classList.remove(
                    "open"
                );
            });

        });


    elements.menuButton.addEventListener(
        "click",
        () => {

            elements.sidebar.classList.toggle(
                "open"
            );
        }
    );
}
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



    // NORMAL HYPERCUBE NAVIGATION

    document
        .querySelectorAll(".nav-item[data-option]")
        .forEach(button => {

            button.addEventListener("click", () => {

                clearActiveNavigation();

                button.classList.add("active");


                const option =
                    Number(button.dataset.option);


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



    // THE KISS NAVIGATION

    document
        .querySelectorAll(".kiss-nav-item")
        .forEach(button => {

            button.addEventListener("click", () => {

                clearActiveNavigation();

                hideProjectionSelector();

                button.classList.add("active");


                const kissVersion =
                    button.dataset.kiss;


                let option = null;


                if (kissVersion === "8") {
                    option = 201;
                }


                if (kissVersion === "16") {
                    option = 202;
                }


                if (kissVersion === "32a") {
                    option = 203;
                }


                if (kissVersion === "32b") {
                    option = 204;
                }


                if (option !== null) {
                    setFigure(option);
                }


                elements.sidebar.classList.remove(
                    "open"
                );

            });

        });



    // BUILDUP PROJECTION BUTTONS

    elements.isometricProjection.addEventListener(
        "click",
        () => {
            selectProjection("isometric");
        }
    );


    elements.tesseractProjection.addEventListener(
        "click",
        () => {
            selectProjection("tesseract");
        }
    );



    // PROJECT SECTIONS

    document
        .querySelectorAll("[data-section]")
        .forEach(button => {

            button.addEventListener("click", () => {

                const section =
                    sections[
                        button.dataset.section
                        ];


                if (!section) {
                    return;
                }


                clearActiveNavigation();

                hideProjectionSelector();

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


                elements.sidebar.classList.remove(
                    "open"
                );

            });

        });



    // MOBILE MENU

    elements.menuButton.addEventListener(
        "click",
        () => {

            elements.sidebar.classList.toggle(
                "open"
            );

        }
    );

}
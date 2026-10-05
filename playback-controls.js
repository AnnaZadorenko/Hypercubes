export function setupPlayback({
                                  elements,
                                  getIsPlaying,
                                  setPlaying,
                                  resetActive,
                                  setActiveSpeed,
                                  updateOptions
                              }) {

    // PLAY / PAUSE

    elements.playButton.addEventListener(
        "click",
        () => {

            setPlaying(
                !getIsPlaying()
            );

        }
    );



    // RESET

    elements.resetButton.addEventListener(
        "click",
        () => {

            resetActive();

            setPlaying(false);

            elements.playButton.textContent =
                "▶ Play";

            elements.statusPill.textContent =
                "Ready";

            elements.statusPill.classList.remove(
                "playing"
            );

        }
    );


    // SPEED

    elements.speedRange.addEventListener(
        "input",
        () => {

            const speed =
                Number(
                    elements.speedRange.value
                );


            elements.speedValue.textContent =
                `${speed.toFixed(1)}×`;


            setActiveSpeed(speed);

        }
    );


    // NORMAL HYPERCUBE OPTIONS

    elements.verticesToggle.addEventListener(
        "change",
        updateOptions
    );


    elements.pathToggle.addEventListener(
        "change",
        updateOptions
    );

}
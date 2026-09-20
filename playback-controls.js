export function setupPlayback({
    renderer,
    elements,
    getIsPlaying,
    setPlaying,
    updateOptions
}) {
    elements.playButton.addEventListener("click", () => {
        setPlaying(!getIsPlaying());
    });

    elements.resetButton.addEventListener("click", () => {
        renderer.reset();

        setPlaying(false);

        elements.playButton.textContent = "▶ Play";
        elements.statusPill.textContent = "Ready";
        elements.statusPill.classList.remove("playing");
    });

    elements.speedRange.addEventListener("input", () => {
        const speed = Number(elements.speedRange.value);

        elements.speedValue.textContent =
            `${speed.toFixed(1)}×`;

        renderer.setSpeed(speed);
    });

    elements.verticesToggle.addEventListener(
        "change",
        updateOptions
    );

    elements.pathToggle.addEventListener(
        "change",
        updateOptions
    );
}

export function setupFullscreen(renderer, elements) {
    elements.fullscreenButton.addEventListener("click", async () => {
        if (!document.fullscreenElement) {
            try {
                await elements.visualPanel.requestFullscreen();
            } catch (error) {
                console.error("Fullscreen could not be opened:", error);
            }
        } else {
            try {
                await document.exitFullscreen();
            } catch (error) {
                console.error("Fullscreen could not be closed:", error);
            }
        }
    });

    document.addEventListener("fullscreenchange", () => {
        const isFullscreen =
            document.fullscreenElement === elements.visualPanel;

        if (isFullscreen) {
            elements.fullscreenButton.textContent = "✕";
            elements.fullscreenButton.title = "Exit fullscreen";
            elements.fullscreenButton.setAttribute(
                "aria-label",
                "Exit fullscreen"
            );
        } else {
            elements.fullscreenButton.textContent = "⛶";
            elements.fullscreenButton.title = "Fullscreen";
            elements.fullscreenButton.setAttribute(
                "aria-label",
                "Open visualization in fullscreen"
            );
        }

        setTimeout(() => {
            renderer.resize();
        }, 50);
    });
}


import "./HypercubeRenderer.js";

import { elements } from "./ui-elements.js";
import { figures, sections } from "./figure-data.js";
import { setupFullscreen } from "./fullscreen.js";
import { setupPlayback } from "./playback-controls.js";
import { setupNavigation } from "./navigation.js";
import { KissRenderer } from "./kiss-renderer.js";
import { HamiltonRenderer } from "./hamilton-renderer.js";

import {
    loadFigureText,
    loadSectionText
} from "./content-loader.js";


const renderer =
    new window.HypercubeRenderer(elements.canvas);

let kissRenderer = null;
let hamiltonRenderer = null;

let isPlaying = false;
let currentOption = 2;
let isKissMode = false;
let isHamiltonMode = false;

const hamiltonControls =
    document.getElementById("hamiltonControls");

const hamiltonSkeletonToggle =
    document.getElementById("hamiltonSkeletonToggle");

const hamiltonStepText =
    document.getElementById("hamiltonStepText");


// Separate canvas for Hamiltonian Circuit.

const originalCanvas = elements.canvas;

const hamiltonCanvas =
    document.createElement("canvas");

hamiltonCanvas.id = "hamiltonSeparateCanvas";

hamiltonCanvas.style.cssText = `
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: none;
    z-index: 2;
`;

const canvasParent = originalCanvas.parentElement;

if (
    window.getComputedStyle(canvasParent).position === "static"
) {
    canvasParent.style.position = "relative";
}

canvasParent.appendChild(hamiltonCanvas);


function showHamiltonCanvas() {
    originalCanvas.style.visibility = "hidden";
    hamiltonCanvas.style.display = "block";
}


function showOriginalCanvas() {
    hamiltonCanvas.style.display = "none";
    originalCanvas.style.visibility = "visible";
}


function clearHamiltonCanvas() {
    const ctx = hamiltonCanvas.getContext("2d");

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    ctx.clearRect(
        0,
        0,
        hamiltonCanvas.width,
        hamiltonCanvas.height
    );

    ctx.restore();
}


function updateOptions() {
    if (isKissMode) {
        if (
            kissRenderer &&
            elements.kissSkeletonToggle
        ) {
            kissRenderer.setShowSkeleton(
                elements.kissSkeletonToggle.checked
            );
        }

        return;
    }

    if (isHamiltonMode) {
        if (
            hamiltonRenderer &&
            hamiltonSkeletonToggle
        ) {
            hamiltonRenderer.setShowSkeleton(
                hamiltonSkeletonToggle.checked
            );
        }

        return;
    }

    renderer.setOptions({
        showVertices: elements.verticesToggle.checked,
        showPath: elements.pathToggle.checked
    });
}


function setPlaying(next) {
    isPlaying = next;

    if (isKissMode) {
        if (!kissRenderer) return;

        if (next) {
            kissRenderer.play();
        } else {
            kissRenderer.pause();
        }

    } else if (isHamiltonMode) {
        if (!hamiltonRenderer) return;

        if (next) {
            hamiltonRenderer.play();
        } else {
            hamiltonRenderer.pause();
        }

    } else {
        if (next) {
            renderer.play();
        } else {
            renderer.pause();
        }
    }

    elements.playButton.textContent =
        next ? "❚❚ Pause" : "▶ Play";

    if (next) {
        elements.statusPill.textContent = "Playing";

        elements.statusPill.classList.add(
            "playing"
        );

    } else {
        if (
            elements.statusPill.textContent !== "Ready"
        ) {
            elements.statusPill.textContent = "Paused";
        }

        elements.statusPill.classList.remove(
            "playing"
        );
    }
}


function resetActive() {
    if (isKissMode) {
        if (kissRenderer) {
            kissRenderer.reset();
        }

        return;
    }

    if (isHamiltonMode) {
        if (hamiltonRenderer) {
            hamiltonRenderer.reset();
        }

        clearHamiltonCanvas();
        return;
    }

    renderer.reset();
}


function setActiveSpeed(speed) {
    if (isKissMode) {
        if (kissRenderer) {
            kissRenderer.setSpeed(speed);
        }

        return;
    }

    if (isHamiltonMode) {
        if (hamiltonRenderer) {
            hamiltonRenderer.setSpeed(speed);
        }

        return;
    }

    renderer.setSpeed(speed);
}


function setControlVisibility(mode) {
    if (elements.kissControls) {
        elements.kissControls.classList.toggle(
            "is-hidden",
            mode !== "kiss"
        );
    }

    if (hamiltonControls) {
        hamiltonControls.classList.toggle(
            "is-hidden",
            mode !== "hamilton"
        );
    }

    const verticesRow =
        elements.verticesToggle.closest(
            ".toggle-row"
        );

    const pathRow =
        elements.pathToggle.closest(
            ".toggle-row"
        );

    if (verticesRow) {
        verticesRow.classList.toggle(
            "is-hidden",
            mode !== "normal"
        );
    }

    if (pathRow) {
        pathRow.classList.toggle(
            "is-hidden",
            mode !== "normal"
        );
    }
}


function showNormalControls() {
    setControlVisibility("normal");
}


function showKissControls() {
    setControlVisibility("kiss");
}


function showHamiltonControls() {
    setControlVisibility("hamilton");
}


function getKissRenderer() {
    if (!kissRenderer) {
        kissRenderer = new KissRenderer(
            elements.canvas,
            elements.kissStepText
        );
    }

    return kissRenderer;
}


function getHamiltonRenderer() {
    if (!hamiltonRenderer) {
        hamiltonRenderer = new HamiltonRenderer(
            hamiltonCanvas,
            hamiltonStepText
        );
    }

    return hamiltonRenderer;
}


function stopKissRenderer() {
    if (!kissRenderer) return;

    kissRenderer.pause();

    if (kissRenderer.animationFrame != null) {
        cancelAnimationFrame(
            kissRenderer.animationFrame
        );

        kissRenderer.animationFrame = null;
    }

    if (kissRenderer.resizeObserver) {
        kissRenderer.resizeObserver.disconnect();
    }

    kissRenderer = null;
}


function stopHamiltonRenderer() {
    if (!hamiltonRenderer) return;

    hamiltonRenderer.pause();

    hamiltonRenderer.building = false;
    hamiltonRenderer.autoPlayAfterBuild = false;

    if (hamiltonRenderer.animationFrame != null) {
        cancelAnimationFrame(
            hamiltonRenderer.animationFrame
        );

        hamiltonRenderer.animationFrame = null;
    }

    hamiltonRenderer = null;

    clearHamiltonCanvas();
}


function updateFigureInformation(figure) {
    elements.dimensionBadge.textContent =
        `${figure.dimension}D`;

    elements.vertexCount.textContent =
        figure.vertices.toLocaleString();

    elements.edgeCount.textContent =
        figure.edges.toLocaleString();

    elements.dimensionCount.textContent =
        figure.dimension;

    loadFigureText(
        figure.content,
        elements.infoText,
        elements.pageTitle,
        elements.infoTitle
    );
}


async function setFigure(option) {
    option = Number(option);

    const figure = figures[option];

    if (!figure) return;

    document.body.classList.toggle(
        "kiss-mode",
        Boolean(figure.kiss)
    );

    currentOption = option;
    isPlaying = false;

    elements.playButton.textContent = "▶ Play";
    elements.statusPill.textContent = "Ready";

    elements.statusPill.classList.remove(
        "playing"
    );


    // Hypercube Dance

    if (figure.kiss) {
        isKissMode = true;
        isHamiltonMode = false;

        document.body.classList.add("kiss-mode");

        showOriginalCanvas();

        // Fullscreen is disabled only for Kiss.
        elements.fullscreenButton.style.display = "none";

        renderer.pause();

        stopHamiltonRenderer();

        showKissControls();
        updateFigureInformation(figure);

        if (elements.kissStepText) {
            elements.kissStepText.textContent = "Ready";
        }

        const kiss = getKissRenderer();

        await kiss.setDance({
            version: figure.kissVersion,
            dataFile: figure.dataFile
        });

        if (elements.kissSkeletonToggle) {
            kiss.setShowSkeleton(
                elements.kissSkeletonToggle.checked
            );
        }

        kiss.setSpeed(
            Number(elements.speedRange.value)
        );

        kiss.resize();

        return;
    }


    // Hamiltonian Circuit

    if (figure.hamilton) {
        isKissMode = false;
        isHamiltonMode = true;

        // Fullscreen remains available.
        elements.fullscreenButton.style.display = "";

        renderer.pause();

        stopKissRenderer();

        showHamiltonCanvas();

        showHamiltonControls();
        updateFigureInformation(figure);

        if (hamiltonStepText) {
            hamiltonStepText.textContent = "Ready";
        }

        const hamilton = getHamiltonRenderer();

        if (typeof hamilton.setCircuit === "function") {
            await hamilton.setCircuit({
                dataFile: figure.dataFile
            });
        }

        if (hamiltonSkeletonToggle) {
            hamilton.setShowSkeleton(
                hamiltonSkeletonToggle.checked
            );
        }

        hamilton.setSpeed(
            Number(elements.speedRange.value)
        );

        hamilton.resize();

        clearHamiltonCanvas();

        return;
    }


    // Normal Hypercube Animations

    isKissMode = false;
    isHamiltonMode = false;

    showOriginalCanvas();

    // Fullscreen remains available.
    elements.fullscreenButton.style.display = "";

    stopKissRenderer();
    stopHamiltonRenderer();

    showNormalControls();

    renderer.setOption(option);
    renderer.currentOption = option;

    renderer.pause();

    updateFigureInformation(figure);

    requestAnimationFrame(() => {
        if (!isKissMode && !isHamiltonMode) {
            renderer.resize();
        }
    });
}


setupFullscreen(
    renderer,
    elements
);


setupPlayback({
    elements,

    getIsPlaying: () => isPlaying,

    setPlaying,
    resetActive,
    setActiveSpeed,
    updateOptions
});


if (elements.kissSkeletonToggle) {
    elements.kissSkeletonToggle.addEventListener(
        "change",
        () => {
            if (
                isKissMode &&
                kissRenderer
            ) {
                kissRenderer.setShowSkeleton(
                    elements.kissSkeletonToggle.checked
                );
            }
        }
    );
}


if (hamiltonSkeletonToggle) {
    hamiltonSkeletonToggle.addEventListener(
        "change",
        () => {
            if (
                isHamiltonMode &&
                hamiltonRenderer
            ) {
                hamiltonRenderer.setShowSkeleton(
                    hamiltonSkeletonToggle.checked
                );
            }
        }
    );
}


setupNavigation({
    elements,
    sections,
    setFigure,
    loadSectionText
});


window.addEventListener(
    "resize",
    () => {
        requestAnimationFrame(() => {
            if (
                isKissMode &&
                kissRenderer
            ) {
                kissRenderer.resize();

            } else if (
                isHamiltonMode &&
                hamiltonRenderer
            ) {
                hamiltonRenderer.resize();

            } else {
                renderer.resize();
            }
        });
    }
);


// Startup

setTimeout(() => {
    elements.splash.classList.add(
        "is-leaving"
    );

    setTimeout(() => {
        elements.splash.remove();

        elements.app.classList.remove(
            "is-hidden"
        );

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setFigure(2);

                updateOptions();

                renderer.setSpeed(
                    Number(elements.speedRange.value)
                );
            });
        });

    }, 450);

}, 1300);

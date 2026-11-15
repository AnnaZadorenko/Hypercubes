
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

        if (!kissRenderer) {
            return;
        }

        if (next) {
            kissRenderer.play();
        } else {
            kissRenderer.pause();
        }

    } else if (isHamiltonMode) {

        if (!hamiltonRenderer) {
            return;
        }

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

        elements.statusPill.textContent =
            "Playing";

        elements.statusPill.classList.add(
            "playing"
        );

    } else {

        if (
            elements.statusPill.textContent !==
            "Ready"
        ) {
            elements.statusPill.textContent =
                "Paused";
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

        kissRenderer =
            new KissRenderer(
                elements.canvas,
                elements.kissStepText
            );
    }

    return kissRenderer;
}


function getHamiltonRenderer() {

    if (!hamiltonRenderer) {

        hamiltonRenderer =
            new HamiltonRenderer(
                elements.canvas,
                hamiltonStepText
            );
    }

    return hamiltonRenderer;
}


function stopKissRenderer() {

    if (!kissRenderer) {
        return;
    }

    kissRenderer.pause();

    if (kissRenderer.animationFrame) {

        cancelAnimationFrame(
            kissRenderer.animationFrame
        );

        kissRenderer.animationFrame = null;
    }

    kissRenderer = null;
}


function stopHamiltonRenderer() {

    if (!hamiltonRenderer) {
        return;
    }

    hamiltonRenderer.pause();

    if (hamiltonRenderer.animationFrame) {

        cancelAnimationFrame(
            hamiltonRenderer.animationFrame
        );

        hamiltonRenderer.animationFrame = null;
    }

    hamiltonRenderer = null;
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

    if (!figure) {
        return;
    }

    currentOption = option;
    isPlaying = false;

    elements.playButton.textContent =
        "▶ Play";

    elements.statusPill.textContent =
        "Ready";

    elements.statusPill.classList.remove(
        "playing"
    );


    if (figure.kiss) {

        isKissMode = true;
        isHamiltonMode = false;

        elements.fullscreenButton.style.display =
            "none";

        renderer.pause();

        stopHamiltonRenderer();

        showKissControls();

        updateFigureInformation(figure);

        if (elements.kissStepText) {

            elements.kissStepText.textContent =
                "Ready";
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


    if (figure.hamilton) {

        isKissMode = false;
        isHamiltonMode = true;

        elements.fullscreenButton.style.display =
            "";

        renderer.pause();

        stopKissRenderer();

        showHamiltonControls();

        updateFigureInformation(figure);

        if (hamiltonStepText) {

            hamiltonStepText.textContent =
                "Ready";
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

        return;
    }


    isKissMode = false;
    isHamiltonMode = false;

    elements.fullscreenButton.style.display =
        "";

    stopKissRenderer();
    stopHamiltonRenderer();

    showNormalControls();

    renderer.setOption(option);

    renderer.currentOption = option;

    renderer.pause();

    updateFigureInformation(figure);

    requestAnimationFrame(() => {

        renderer.resize();
    });
}


setupFullscreen(
    renderer,
    elements
);


setupPlayback({

    elements,

    getIsPlaying: () =>
        isPlaying,

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

                renderer.resize();

                setFigure(2);

                updateOptions();

                renderer.setSpeed(
                    Number(elements.speedRange.value)
                );
            });
        });

    }, 450);

}, 1300);

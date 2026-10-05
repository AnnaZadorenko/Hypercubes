import "./HypercubeRenderer.js";

import { elements } from "./ui-elements.js";
import { figures, sections } from "./figure-data.js";
import { setupFullscreen } from "./fullscreen.js";
import { setupPlayback } from "./playback-controls.js";
import { setupNavigation } from "./navigation.js";
import { KissRenderer } from "./kiss-renderer.js";


import {
    loadFigureText,
    loadSectionText
} from "./content-loader.js";


// NORMAL HYPERCUBE RENDERER

const renderer =
    new window.HypercubeRenderer(elements.canvas);


// THE KISS RENDERER
// Do NOT create it at startup.
// It will be created only when a Kiss display is selected.

let kissRenderer = null;


let isPlaying = false;
let currentOption = 2;
let isKissMode = false;


// --------------------------------------------------
// OPTIONS
// --------------------------------------------------

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


    renderer.setOptions({
        showVertices: elements.verticesToggle.checked,
        showPath: elements.pathToggle.checked
    });
}


// --------------------------------------------------
// PLAY / PAUSE
// --------------------------------------------------

function setPlaying(next) {

    isPlaying = next;


    // THE KISS

    if (isKissMode) {

        if (!kissRenderer) {
            return;
        }


        if (next) {

            kissRenderer.play();

            elements.playButton.textContent =
                "❚❚ Pause";

            elements.statusPill.textContent =
                "Playing";

            elements.statusPill.classList.add(
                "playing"
            );

        } else {

            kissRenderer.pause();

            elements.playButton.textContent =
                "▶ Play";

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

        return;
    }


    // NORMAL HYPERCUBE

    if (next) {

        renderer.play();

        elements.playButton.textContent =
            "❚❚ Pause";

        elements.statusPill.textContent =
            "Playing";

        elements.statusPill.classList.add(
            "playing"
        );

    } else {

        renderer.pause();

        elements.playButton.textContent =
            "▶ Play";

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


// --------------------------------------------------
// RESET
// --------------------------------------------------

function resetActive() {

    if (isKissMode) {

        if (kissRenderer) {
            kissRenderer.reset();
        }

        return;
    }


    renderer.reset();
}


// --------------------------------------------------
// SPEED
// --------------------------------------------------

function setActiveSpeed(speed) {

    if (isKissMode) {

        if (kissRenderer) {
            kissRenderer.setSpeed(speed);
        }

        return;
    }


    renderer.setSpeed(speed);
}


// --------------------------------------------------
// NORMAL CONTROLS
// --------------------------------------------------

function showNormalControls() {

    if (elements.kissControls) {

        elements.kissControls.classList.add(
            "is-hidden"
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

        verticesRow.classList.remove(
            "is-hidden"
        );
    }


    if (pathRow) {

        pathRow.classList.remove(
            "is-hidden"
        );
    }
}


// --------------------------------------------------
// KISS CONTROLS
// --------------------------------------------------

function showKissControls() {

    if (elements.kissControls) {

        elements.kissControls.classList.remove(
            "is-hidden"
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

        verticesRow.classList.add(
            "is-hidden"
        );
    }


    if (pathRow) {

        pathRow.classList.add(
            "is-hidden"
        );
    }
}


// --------------------------------------------------
// CREATE KISS RENDERER ONLY WHEN NEEDED
// --------------------------------------------------

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


// --------------------------------------------------
// SET FIGURE
// --------------------------------------------------

async function setFigure(option) {

    option = Number(option);


    const figure =
        figures[option];


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


    // ==================================================
    // THE KISS
    // ==================================================

    if (figure.kiss) {

        isKissMode = true;


        // Stop normal cube animation

        renderer.pause();


        showKissControls();


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


        if (elements.kissStepText) {

            elements.kissStepText.textContent =
                "Ready";
        }


        const kiss =
            getKissRenderer();


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
            Number(
                elements.speedRange.value
            )
        );


        kiss.resize();

        return;
    }


    // ==================================================
    // NORMAL HYPERCUBE
    // ==================================================

    isKissMode = false;


    // IMPORTANT:
    // Stop Kiss before normal renderer draws.

    if (kissRenderer) {

        kissRenderer.pause();

        /*
         * Stop its requestAnimationFrame loop so it
         * cannot keep clearing the normal cube canvas.
         */

        if (kissRenderer.animationFrame) {

            cancelAnimationFrame(
                kissRenderer.animationFrame
            );

            kissRenderer.animationFrame = null;
        }


        kissRenderer = null;
    }


    showNormalControls();


    renderer.setOption(option);

    renderer.currentOption = option;

    renderer.pause();


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


    // Redraw normal cube after Kiss has stopped

    requestAnimationFrame(() => {

        renderer.resize();

    });
}


// --------------------------------------------------
// FULLSCREEN
// --------------------------------------------------

setupFullscreen(
    renderer,
    elements
);


// --------------------------------------------------
// PLAYBACK
// --------------------------------------------------

setupPlayback({

    elements,

    getIsPlaying: () =>
        isPlaying,

    setPlaying,

    resetActive,

    setActiveSpeed,

    updateOptions

});


// --------------------------------------------------
// KISS SKELETON
// --------------------------------------------------

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


// --------------------------------------------------
// NAVIGATION
// --------------------------------------------------

setupNavigation({

    elements,

    sections,

    setFigure,

    loadSectionText

});


// --------------------------------------------------
// RESIZE
// --------------------------------------------------

window.addEventListener(
    "resize",
    () => {

        requestAnimationFrame(() => {

            if (
                isKissMode &&
                kissRenderer
            ) {

                kissRenderer.resize();

            } else {

                renderer.resize();
            }

        });

    }
);


// --------------------------------------------------
// START APPLICATION
// --------------------------------------------------

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
                    Number(
                        elements.speedRange.value
                    )
                );

            });

        });

    }, 450);

}, 1300);
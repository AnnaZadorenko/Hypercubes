import "./HypercubeRenderer.js";

import { elements } from "./ui-elements.js";
import { figures, sections } from "./figure-data.js";
import { setupFullscreen } from "./fullscreen.js";
import { setupPlayback } from "./playback-controls.js";
import { setupNavigation } from "./navigation.js";
import {
    loadFigureText,
    loadSectionText
} from "./content-loader.js";

const renderer = new window.HypercubeRenderer(elements.canvas);
let isPlaying = false;
let currentOption = 2;

function updateOptions() {
    renderer.setOptions({
        showVertices: elements.verticesToggle.checked,
        showPath: elements.pathToggle.checked
    });
}

function setPlaying(next) {
    isPlaying = next;

    if (next) {
        renderer.play();
        elements.playButton.textContent = "❚❚ Pause";
        elements.statusPill.textContent = "Playing";
        elements.statusPill.classList.add("playing");
    } else {
        renderer.pause();
        elements.playButton.textContent = "▶ Play";

        if (elements.statusPill.textContent !== "Ready") {
            elements.statusPill.textContent = "Paused";
        }

        elements.statusPill.classList.remove("playing");
    }
}

function setFigure(option) {
    option = Number(option);

    const figure = figures[option];

    if (!figure) {
        return;
    }

    currentOption = option;

    renderer.setOption(option);

    isPlaying = false;
    renderer.pause();

    elements.playButton.textContent = "▶ Play";
    elements.statusPill.textContent = "Ready";
    elements.statusPill.classList.remove("playing");

    elements.pageTitle.textContent = figure.title;
    elements.infoTitle.textContent = figure.infoTitle;
    elements.dimensionBadge.textContent = `${figure.dimension}D`;
    elements.vertexCount.textContent = figure.vertices.toLocaleString();
    elements.edgeCount.textContent = figure.edges.toLocaleString();
    elements.dimensionCount.textContent = figure.dimension;

    loadFigureText(figure.content, elements.infoText);
}

setupFullscreen(renderer, elements);

setupPlayback({
    renderer,
    elements,
    getIsPlaying: () => isPlaying,
    setPlaying,
    updateOptions
});

setupNavigation({
    elements,
    sections,
    setFigure,
    loadSectionText
});

window.addEventListener("resize", () => {
    requestAnimationFrame(() => {
        renderer.resize();
    });
});

setTimeout(() => {
    elements.splash.classList.add("is-leaving");

    setTimeout(() => {
        elements.splash.remove();
        elements.app.classList.remove("is-hidden");

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                renderer.resize();
                setFigure(2);
                updateOptions();
                renderer.setSpeed(Number(elements.speedRange.value));
            });
        });
    }, 450);
}, 1300);

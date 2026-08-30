const splash = document.getElementById('splash');
const app = document.getElementById('app');
const canvas = document.getElementById('hypercubeCanvas');

const renderer = new window.HypercubeRenderer(canvas);

const playButton = document.getElementById('playButton');
const resetButton = document.getElementById('resetButton');

const speedRange = document.getElementById('speedRange');
const speedValue = document.getElementById('speedValue');

const verticesToggle = document.getElementById('verticesToggle');
const pathToggle = document.getElementById('pathToggle');

const statusPill = document.getElementById('statusPill');

const pageTitle = document.getElementById('pageTitle');
const infoTitle = document.getElementById('infoTitle');
const infoText = document.getElementById('infoText');

const dimensionBadge = document.getElementById('dimensionBadge');

const vertexCount = document.getElementById('vertexCount');
const edgeCount = document.getElementById('edgeCount');
const dimensionCount = document.getElementById('dimensionCount');

const fullscreenButton = document.getElementById('fullscreenButton');
const visualPanel = document.querySelector('.visual-panel');

const sidebar = document.querySelector('.sidebar');
const menuButton = document.getElementById('menuButton');

let isPlaying = false;
let currentOption = 2;


const figures = {

    1: {
        title: "3D Cube",
        infoTitle: "Building a 3D Cube",
        dimension: 3,
        vertices: 8,
        edges: 12,
        content: "3d.txt"
    },

    101: {
        title: "3D Rotate",
        infoTitle: "Rotating 3D Cube",
        dimension: 3,
        vertices: 8,
        edges: 12,
        content: "3d.txt"
    },


    2: {
        title: "4D Tesseract",
        infoTitle: "Building a 4D Tesseract",
        dimension: 4,
        vertices: 16,
        edges: 32,
        content: "4d.txt"
    },

    102: {
        title: "4D Rotate",
        infoTitle: "Rotating 4D Tesseract",
        dimension: 4,
        vertices: 16,
        edges: 32,
        content: "4d.txt"
    },


    31: {
        title: "5D Isometric",
        infoTitle: "5D Isometric Projection",
        dimension: 5,
        vertices: 32,
        edges: 80,
        content: "5d-isometric.txt"
    },

    32: {
        title: "5D Tesseract Projection",
        infoTitle: "5D Tesseract Projection",
        dimension: 5,
        vertices: 32,
        edges: 80,
        content: "5d-tesseract.txt"
    },

    130: {
        title: "5D Rotate",
        infoTitle: "Rotating 5D Hypercube",
        dimension: 5,
        vertices: 32,
        edges: 80,
        content: "5d-tesseract.txt"
    },


    41: {
        title: "6D Isometric",
        infoTitle: "6D Isometric Projection",
        dimension: 6,
        vertices: 64,
        edges: 192,
        content: "6d-isometric.txt"
    },

    42: {
        title: "6D Tesseract Projection",
        infoTitle: "6D Tesseract Projection",
        dimension: 6,
        vertices: 64,
        edges: 192,
        content: "6d-tesseract.txt"
    },

    140: {
        title: "6D Rotate",
        infoTitle: "Rotating 6D Hypercube",
        dimension: 6,
        vertices: 64,
        edges: 192,
        content: "6d-tesseract.txt"
    }

};



fullscreenButton.addEventListener(
    'click',
    async () => {

        if (!document.fullscreenElement) {

            try {

                await visualPanel.requestFullscreen();

            } catch (error) {

                console.error(
                    'Fullscreen could not be opened:',
                    error
                );

            }

        } else {

            try {

                await document.exitFullscreen();

            } catch (error) {

                console.error(
                    'Fullscreen could not be closed:',
                    error
                );

            }

        }

    }
);



document.addEventListener(
    'fullscreenchange',
    () => {

        const isFullscreen =
            document.fullscreenElement === visualPanel;

        if (isFullscreen) {

            fullscreenButton.textContent = '✕';
            fullscreenButton.title = 'Exit fullscreen';

            fullscreenButton.setAttribute(
                'aria-label',
                'Exit fullscreen'
            );

        } else {

            fullscreenButton.textContent = '⛶';
            fullscreenButton.title = 'Fullscreen';

            fullscreenButton.setAttribute(
                'aria-label',
                'Open visualization in fullscreen'
            );

        }

        setTimeout(
            () => {

                renderer.resize();

            },
            50
        );

    }
);



function setPlaying(next) {

    isPlaying = next;

    if (next) {

        renderer.play();

        playButton.textContent = '❚❚ Pause';

        statusPill.textContent = 'Playing';

        statusPill.classList.add('playing');

    } else {

        renderer.pause();

        playButton.textContent = '▶ Play';

        if (statusPill.textContent !== 'Ready') {

            statusPill.textContent = 'Paused';

        }

        statusPill.classList.remove('playing');

    }

}



async function loadFigureText(filename) {

    try {

        const response = await fetch(
            `content/${filename}`
        );

        if (!response.ok) {

            throw new Error(
                `Could not load content/${filename}`
            );

        }

        const text = await response.text();

        infoText.textContent = text;

    } catch (error) {

        infoText.textContent =
            'Information is unavailable.';

        console.error(error);

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

    playButton.textContent = '▶ Play';

    statusPill.textContent = 'Ready';

    statusPill.classList.remove('playing');

    pageTitle.textContent = figure.title;

    infoTitle.textContent = figure.infoTitle;

    dimensionBadge.textContent =
        `${figure.dimension}D`;

    vertexCount.textContent =
        figure.vertices.toLocaleString();

    edgeCount.textContent =
        figure.edges.toLocaleString();

    dimensionCount.textContent =
        figure.dimension;

    loadFigureText(
        figure.content
    );
}



playButton.addEventListener(
    'click',
    () => {

        setPlaying(
            !isPlaying
        );

    }
);



resetButton.addEventListener(
    'click',
    () => {

        renderer.reset();

        isPlaying = false;

        playButton.textContent = '▶ Play';

        statusPill.textContent = 'Ready';

        statusPill.classList.remove('playing');

    }
);



speedRange.addEventListener(
    'input',
    () => {

        const speed =
            Number(speedRange.value);

        speedValue.textContent =
            `${speed.toFixed(1)}×`;

        renderer.setSpeed(speed);

    }
);



function updateOptions() {

    renderer.setOptions({

        showVertices:
        verticesToggle.checked,

        showPath:
        pathToggle.checked

    });

}



verticesToggle.addEventListener(
    'change',
    updateOptions
);



pathToggle.addEventListener(
    'change',
    updateOptions
);



document
    .querySelectorAll('[data-option]')
    .forEach(button => {

        button.addEventListener(
            'click',
            () => {

                document
                    .querySelectorAll('.nav-item')
                    .forEach(item => {

                        item.classList.remove('active');

                    });

                button.classList.add('active');

                const option =
                    Number(
                        button.dataset.option
                    );

                setFigure(option);

                sidebar.classList.remove('open');

            }
        );

    });



const sections = {

    about: {

        title:
            'About the Project',

        contentFile:
            'about-project.txt'

    },

    instructions: {

        title:
            'How to Use',

        body:
            'Choose a visualization from the menu. Press Play to watch the hypercube build, use Reset to start again, adjust the animation speed, and use the fullscreen button to enlarge the visualization.'

    }

};



async function loadSection(section) {

    infoTitle.textContent =
        section.title;

    if (section.contentFile) {

        try {

            const response = await fetch(
                `content/${section.contentFile}`
            );

            if (!response.ok) {

                throw new Error(
                    `Could not load content/${section.contentFile}`
                );

            }

            const text =
                await response.text();

            infoText.textContent =
                text;

        } catch (error) {

            infoText.textContent =
                'Information is unavailable.';

            console.error(error);

        }

    } else {

        infoText.textContent =
            section.body;

    }

}



document
    .querySelectorAll('[data-section]')
    .forEach(button => {

        button.addEventListener(
            'click',
            () => {

                const section =
                    sections[
                        button.dataset.section
                        ];

                if (!section) {

                    return;

                }

                document
                    .querySelectorAll('.nav-item')
                    .forEach(item => {

                        item.classList.remove('active');

                    });

                button.classList.add('active');

                loadSection(section);

                document
                    .getElementById('infoCard')
                    .scrollIntoView({

                        behavior: 'smooth',
                        block: 'center'

                    });

                sidebar.classList.remove('open');

            }
        );

    });



menuButton.addEventListener(
    'click',
    () => {

        sidebar.classList.toggle('open');

    }
);



window.addEventListener(
    'resize',
    () => {

        requestAnimationFrame(
            () => {

                renderer.resize();

            }
        );

    }
);



setTimeout(
    () => {

        splash.classList.add('is-leaving');

        setTimeout(
            () => {

                splash.remove();

                app.classList.remove('is-hidden');

                requestAnimationFrame(
                    () => {

                        requestAnimationFrame(
                            () => {

                                renderer.resize();

                                setFigure(2);

                                updateOptions();

                                renderer.setSpeed(
                                    Number(
                                        speedRange.value
                                    )
                                );

                            }
                        );

                    }
                );

            },
            450
        );

    },
    1300
);
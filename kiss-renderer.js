export class KissRenderer {

    constructor(canvas, stepElement = null) {

        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.stepElement = stepElement;

        this.version = null;

        this.vertices = [];
        this.edges = [];
        this.dancers = [];

        this.playing = false;
        this.showSkeleton = true;

        this.speed = 1;

        this.currentStep = 0;
        this.stepProgress = 0;

        this.lastTime = performance.now();

        this.animationFrame = null;

        this.building = false;
        this.buildReady = false;
        this.autoPlayAfterBuild = false;

        this.buildDimension = 1;
        this.buildStage = "lift";
        this.buildStageTime = 0;
        this.buildLiftProgress = 0;

        this.buildLiftDuration = 700;
        this.buildPauseDuration = 250;

        this.buildVisibleVertexCount = 1;

        this.buildLiftEdges = [];
        this.buildCopyEdges = [];

        this.danceData = {

            "16": {
                dancers: 16,
                dimension: 4,
                steps: 30,
                dataFile: "CUBE4V.DAT"
            }

        };


        this.danceSteps = [

            {
                meet: [
                    [1, 2],
                    [3, 4],
                    [5, 6],
                    [7, 8],
                    [9, 10],
                    [11, 12],
                    [13, 14],
                    [15, 16]
                ]
            },

            {
                meet: [
                    [1, 3],
                    [2, 4],
                    [5, 7],
                    [6, 8],
                    [9, 11],
                    [10, 12],
                    [13, 15],
                    [14, 16]
                ]
            },

            {
                exchange: [
                    [3, 4],
                    [7, 8],
                    [11, 12],
                    [15, 16]
                ]
            },

            {
                meet: [
                    [1, 3],
                    [2, 4],
                    [5, 7],
                    [6, 8],
                    [9, 11],
                    [10, 12],
                    [13, 15],
                    [14, 16]
                ]
            },

            {
                exchange: [
                    [1, 2],
                    [5, 6],
                    [9, 10],
                    [13, 14]
                ]
            },

            {
                meet: [
                    [1, 5],
                    [2, 6],
                    [3, 7],
                    [4, 8],
                    [9, 13],
                    [10, 14],
                    [11, 15],
                    [12, 16]
                ]
            },

            {
                cycles: [
                    [5, 6, 8, 7],
                    [13, 14, 16, 15]
                ]
            },

            {
                meet: [
                    [1, 5],
                    [2, 6],
                    [3, 7],
                    [4, 8],
                    [9, 13],
                    [10, 14],
                    [11, 15],
                    [12, 16]
                ]
            },

            {
                cycles: [
                    [1, 3, 4, 2],
                    [9, 11, 12, 10]
                ]
            },

            {
                meet: [
                    [1, 5],
                    [2, 6],
                    [3, 7],
                    [4, 8],
                    [9, 13],
                    [10, 14],
                    [11, 15],
                    [12, 16]
                ]
            },

            {
                cycles: [
                    [5, 6, 8, 7],
                    [13, 14, 16, 15]
                ]
            },

            {
                meet: [
                    [1, 5],
                    [2, 6],
                    [3, 7],
                    [4, 8],
                    [9, 13],
                    [10, 14],
                    [11, 15],
                    [12, 16]
                ]
            },

            {
                cycles: [
                    [1, 3, 4, 2],
                    [9, 11, 12, 10]
                ]
            },

            {
                meet: [
                    [1, 9],
                    [2, 10],
                    [3, 11],
                    [4, 12],
                    [5, 13],
                    [6, 14],
                    [7, 15],
                    [8, 16]
                ]
            },

            {
                cycles: [
                    [9, 10, 14, 13, 15, 16, 12, 11]
                ]
            },

            {
                meet: [
                    [1, 9],
                    [2, 10],
                    [3, 11],
                    [4, 12],
                    [5, 13],
                    [6, 14],
                    [7, 15],
                    [8, 16]
                ]
            },

            {
                cycles: [
                    [1, 3, 4, 8, 7, 5, 6, 2]
                ]
            },

            {
                meet: [
                    [1, 9],
                    [2, 10],
                    [3, 11],
                    [4, 12],
                    [5, 13],
                    [6, 14],
                    [7, 15],
                    [8, 16]
                ]
            },

            {
                cycles: [
                    [9, 10, 14, 13, 15, 16, 12, 11]
                ]
            },

            {
                meet: [
                    [1, 9],
                    [2, 10],
                    [3, 11],
                    [4, 12],
                    [5, 13],
                    [6, 14],
                    [7, 15],
                    [8, 16]
                ]
            },

            {
                cycles: [
                    [1, 3, 4, 8, 7, 5, 6, 2]
                ]
            },

            {
                meet: [
                    [1, 9],
                    [2, 10],
                    [3, 11],
                    [4, 12],
                    [5, 13],
                    [6, 14],
                    [7, 15],
                    [8, 16]
                ]
            },

            {
                cycles: [
                    [9, 10, 14, 13, 15, 16, 12, 11]
                ]
            },

            {
                meet: [
                    [1, 9],
                    [2, 10],
                    [3, 11],
                    [4, 12],
                    [5, 13],
                    [6, 14],
                    [7, 15],
                    [8, 16]
                ]
            },

            {
                cycles: [
                    [1, 3, 4, 8, 7, 5, 6, 2]
                ]
            },

            {
                meet: [
                    [1, 9],
                    [2, 10],
                    [3, 11],
                    [4, 12],
                    [5, 13],
                    [6, 14],
                    [7, 15],
                    [8, 16]
                ]
            },

            {
                cycles: [
                    [9, 10, 14, 13, 15, 16, 12, 11]
                ]
            },

            {
                meet: [
                    [1, 9],
                    [2, 10],
                    [3, 11],
                    [4, 12],
                    [5, 13],
                    [6, 14],
                    [7, 15],
                    [8, 16]
                ]
            },

            {
                cycles: [
                    [1, 3, 4, 8, 7, 5, 6, 2]
                ]
            },

            {
                meet: [
                    [1, 5],
                    [2, 6],
                    [3, 7],
                    [4, 8],
                    [9, 13],
                    [10, 14],
                    [11, 15],
                    [12, 16]
                ]
            }

        ];


        this.loop = this.loop.bind(this);

        this.resize();

        this.animationFrame =
            requestAnimationFrame(this.loop);
    }


    async setDance({
                       version,
                       dataFile
                   }) {

        this.pause();

        this.version = version;

        const settings =
            this.danceData[version];

        if (!settings) {

            console.error(
                `Unknown dance version: ${version}`
            );

            return;
        }


        this.currentStep = 0;
        this.stepProgress = 0;

        const filename =
            dataFile || settings.dataFile;


        try {

            const response =
                await fetch(`data/${filename}`);


            if (!response.ok) {

                throw new Error(
                    `Could not load data/${filename}`
                );
            }


            const text =
                await response.text();


            this.vertices =
                this.parseCoordinateFile(
                    text,
                    settings.dancers
                );


            this.createEdges(
                settings.dimension
            );


            this.createDancers(
                settings.dancers
            );


            this.prepareBuild();


        } catch (error) {

            console.error(error);

            this.vertices = [];
            this.edges = [];
            this.dancers = [];

            this.building = false;

            if (this.stepElement) {

                this.stepElement.textContent =
                    "Unable to load dance data";
            }

            this.draw();
        }
    }


    parseCoordinateFile(
        text,
        expectedCount
    ) {

        const lines =
            text
                .split(/\r?\n/)
                .map(line => line.trim())
                .filter(Boolean);


        const points = [];


        for (const line of lines) {

            const numbers =
                line
                    .replace(/,/g, " ")
                    .split(/\s+/)
                    .map(Number)
                    .filter(value =>
                        Number.isFinite(value)
                    );


            if (numbers.length >= 2) {

                points.push({
                    x: numbers[0],
                    y: numbers[1]
                });
            }


            if (
                points.length >=
                expectedCount
            ) {
                break;
            }
        }


        if (
            points.length !==
            expectedCount
        ) {

            console.warn(
                `Expected ${expectedCount} vertices but found ${points.length}`
            );
        }


        return points;
    }


    createEdges(dimension) {

        this.edges = [];

        const count =
            Math.min(
                this.vertices.length,
                2 ** dimension
            );


        for (
            let vertex = 0;
            vertex < count;
            vertex++
        ) {

            for (
                let axis = 0;
                axis < dimension;
                axis++
            ) {

                const neighbor =
                    vertex ^ (1 << axis);


                if (
                    neighbor > vertex &&
                    neighbor < count
                ) {

                    this.edges.push([
                        vertex,
                        neighbor
                    ]);
                }
            }
        }
    }


    createDancers(count) {

        this.dancers = [];


        for (
            let i = 0;
            i < count;
            i++
        ) {

            const vertex =
                this.vertices[i];


            if (!vertex) {
                continue;
            }


            this.dancers.push({

                id: i,

                currentVertex: i,

                targetVertex: i,

                x: vertex.x,
                y: vertex.y,

                startX: vertex.x,
                startY: vertex.y,

                targetX: vertex.x,
                targetY: vertex.y,

                movementType: "still",

                curveSide: 0

            });
        }
    }


    play() {

        if (!this.version) {
            return;
        }

        if (this.building) {
            return;
        }

        if (this.buildReady) {
            this.autoPlayAfterBuild = true;
            this.startBuild();
            return;
        }

        this.playing = true;

        this.lastTime =
            performance.now();
    }


    pause() {

        this.playing = false;
    }


    reset() {

        this.pause();

        this.currentStep = 0;
        this.stepProgress = 0;


        this.dancers.forEach(
            (dancer, index) => {

                const vertex =
                    this.vertices[index];


                if (!vertex) {
                    return;
                }


                dancer.currentVertex =
                    index;

                dancer.targetVertex =
                    index;

                dancer.x =
                    vertex.x;

                dancer.y =
                    vertex.y;

                dancer.startX =
                    vertex.x;

                dancer.startY =
                    vertex.y;

                dancer.targetX =
                    vertex.x;

                dancer.targetY =
                    vertex.y;

                dancer.movementType =
                    "still";

                dancer.curveSide = 0;
            }
        );


        this.prepareBuild();
    }


    setSpeed(speed) {

        const value =
            Number(speed);


        if (
            !Number.isFinite(value) ||
            value <= 0
        ) {
            return;
        }


        this.speed = value;
    }


    setShowSkeleton(show) {

        this.showSkeleton =
            Boolean(show);

        this.draw();
    }


    getDancerAtVertex(vertexNumber) {

        const vertexIndex =
            vertexNumber - 1;

        return this.dancers.find(
            dancer =>
                dancer.currentVertex ===
                vertexIndex
        );
    }


    prepareStep() {

        const step =
            this.danceSteps[
                this.currentStep
                ];


        if (!step) {
            return;
        }


        this.dancers.forEach(
            dancer => {

                const point =
                    this.vertices[
                        dancer.currentVertex
                        ];


                if (!point) {
                    return;
                }


                dancer.startX = point.x;
                dancer.startY = point.y;

                dancer.targetX = point.x;
                dancer.targetY = point.y;

                dancer.targetVertex =
                    dancer.currentVertex;

                dancer.movementType =
                    "still";

                dancer.curveSide = 0;
            }
        );


        if (step.meet) {

            step.meet.forEach(
                pair => {

                    const first =
                        this.getDancerAtVertex(
                            pair[0]
                        );

                    const second =
                        this.getDancerAtVertex(
                            pair[1]
                        );


                    if (
                        !first ||
                        !second
                    ) {
                        return;
                    }


                    const pointA =
                        this.vertices[
                        pair[0] - 1
                            ];

                    const pointB =
                        this.vertices[
                        pair[1] - 1
                            ];


                    if (
                        !pointA ||
                        !pointB
                    ) {
                        return;
                    }


                    first.startX =
                        pointA.x;

                    first.startY =
                        pointA.y;

                    first.targetX =
                        pointB.x;

                    first.targetY =
                        pointB.y;

                    first.movementType =
                        "meet";


                    second.startX =
                        pointB.x;

                    second.startY =
                        pointB.y;

                    second.targetX =
                        pointA.x;

                    second.targetY =
                        pointA.y;

                    second.movementType =
                        "meet";
                }
            );
        }


        if (step.exchange) {

            step.exchange.forEach(
                pair => {

                    const first =
                        this.getDancerAtVertex(
                            pair[0]
                        );

                    const second =
                        this.getDancerAtVertex(
                            pair[1]
                        );


                    if (
                        !first ||
                        !second
                    ) {
                        return;
                    }


                    const pointA =
                        this.vertices[
                        pair[0] - 1
                            ];

                    const pointB =
                        this.vertices[
                        pair[1] - 1
                            ];


                    first.startX =
                        pointA.x;

                    first.startY =
                        pointA.y;

                    first.targetX =
                        pointB.x;

                    first.targetY =
                        pointB.y;

                    first.targetVertex =
                        pair[1] - 1;

                    first.movementType =
                        "exchange";

                    first.curveSide = 1;


                    second.startX =
                        pointB.x;

                    second.startY =
                        pointB.y;

                    second.targetX =
                        pointA.x;

                    second.targetY =
                        pointA.y;

                    second.targetVertex =
                        pair[0] - 1;

                    second.movementType =
                        "exchange";

                    second.curveSide = 1;
                }
            );
        }


        if (step.cycles) {

            step.cycles.forEach(
                cycle => {

                    for (
                        let i = 0;
                        i < cycle.length;
                        i++
                    ) {

                        const from =
                            cycle[i];

                        const to =
                            cycle[
                            (i + 1) %
                            cycle.length
                                ];


                        const dancer =
                            this.getDancerAtVertex(
                                from
                            );


                        if (!dancer) {
                            continue;
                        }


                        const startPoint =
                            this.vertices[
                            from - 1
                                ];

                        const targetPoint =
                            this.vertices[
                            to - 1
                                ];


                        if (
                            !startPoint ||
                            !targetPoint
                        ) {
                            continue;
                        }


                        dancer.startX =
                            startPoint.x;

                        dancer.startY =
                            startPoint.y;

                        dancer.targetX =
                            targetPoint.x;

                        dancer.targetY =
                            targetPoint.y;

                        dancer.targetVertex =
                            to - 1;

                        dancer.movementType =
                            "cycle";
                    }
                }
            );
        }


        this.updateStepText();
    }


    updateMeetMovement(
        dancer,
        t
    ) {

        let movement;


        if (t <= 0.5) {

            movement =
                t * 2;

        } else {

            movement =
                (1 - t) * 2;
        }


        const smooth =
            movement *
            movement *
            (3 - 2 * movement);


        const dx =
            dancer.targetX -
            dancer.startX;

        const dy =
            dancer.targetY -
            dancer.startY;


        const canvasRadius = 8;


        const startScreen =
            this.projectPoint(
                dancer.startX,
                dancer.startY
            );


        const targetScreen =
            this.projectPoint(
                dancer.targetX,
                dancer.targetY
            );


        const screenDistance =
            Math.sqrt(
                (
                    targetScreen.x -
                    startScreen.x
                ) ** 2 +
                (
                    targetScreen.y -
                    startScreen.y
                ) ** 2
            ) || 1;


        const touchingFraction =
            Math.max(
                0,
                0.5 -
                canvasRadius /
                screenDistance
            );


        dancer.x =
            dancer.startX +
            dx *
            touchingFraction *
            smooth;


        dancer.y =
            dancer.startY +
            dy *
            touchingFraction *
            smooth;
    }


    updateExchangeMovement(
        dancer,
        t
    ) {

        const smooth =
            t * t * (3 - 2 * t);


        const dx =
            dancer.targetX -
            dancer.startX;

        const dy =
            dancer.targetY -
            dancer.startY;


        const length =
            Math.sqrt(
                dx * dx +
                dy * dy
            ) || 1;


        const baseX =
            dancer.startX +
            dx * smooth;

        const baseY =
            dancer.startY +
            dy * smooth;


        const perpendicularX =
            -dy / length;

        const perpendicularY =
            dx / length;


        const startScreen =
            this.projectPoint(
                dancer.startX,
                dancer.startY
            );

        const targetScreen =
            this.projectPoint(
                dancer.targetX,
                dancer.targetY
            );


        const screenDistance =
            Math.sqrt(
                (
                    targetScreen.x -
                    startScreen.x
                ) ** 2 +
                (
                    targetScreen.y -
                    startScreen.y
                ) ** 2
            ) || 1;


        const worldPerPixel =
            length / screenDistance;


        const avoidDistance =
            11 * worldPerPixel;


        let curve = 0;


        if (
            smooth >= 0.30 &&
            smooth <= 0.70
        ) {

            const local =
                (smooth - 0.30) /
                0.40;


            curve =
                Math.sin(
                    Math.PI * local
                );
        }


        dancer.x =
            baseX +
            perpendicularX *
            avoidDistance *
            curve *
            dancer.curveSide;


        dancer.y =
            baseY +
            perpendicularY *
            avoidDistance *
            curve *
            dancer.curveSide;
    }


    updateStraightMovement(
        dancer,
        t
    ) {

        const smooth =
            t * t * (3 - 2 * t);


        dancer.x =
            dancer.startX +
            (
                dancer.targetX -
                dancer.startX
            ) * smooth;


        dancer.y =
            dancer.startY +
            (
                dancer.targetY -
                dancer.startY
            ) * smooth;
    }


    finishStep() {

        this.dancers.forEach(
            dancer => {

                if (
                    dancer.movementType ===
                    "meet"
                ) {

                    dancer.x =
                        dancer.startX;

                    dancer.y =
                        dancer.startY;

                    return;
                }


                dancer.currentVertex =
                    dancer.targetVertex;


                const finalPoint =
                    this.vertices[
                        dancer.currentVertex
                        ];


                if (finalPoint) {

                    dancer.x =
                        finalPoint.x;

                    dancer.y =
                        finalPoint.y;
                }
            }
        );


        this.currentStep++;


        if (
            this.currentStep >=
            this.danceSteps.length
        ) {

            this.currentStep = 0;
        }


        this.stepProgress = 0;
    }


    updateStepText() {

        if (!this.stepElement) {
            return;
        }


        if (!this.version) {

            this.stepElement.textContent =
                "Ready";

            return;
        }


        this.stepElement.textContent =
            `Step ${this.currentStep + 1} of ${this.danceSteps.length}`;
    }


    update(deltaTime) {

        if (
            !this.playing ||
            !this.version ||
            this.dancers.length === 0
        ) {
            return;
        }


        if (
            this.stepProgress === 0
        ) {

            this.prepareStep();
        }


        const duration =
            1400 / this.speed;


        this.stepProgress +=
            deltaTime / duration;


        const t =
            Math.min(
                this.stepProgress,
                1
            );


        this.dancers.forEach(
            dancer => {

                if (
                    dancer.movementType ===
                    "meet"
                ) {

                    this.updateMeetMovement(
                        dancer,
                        t
                    );

                    return;
                }


                if (
                    dancer.movementType ===
                    "exchange"
                ) {

                    this.updateExchangeMovement(
                        dancer,
                        t
                    );

                    return;
                }


                if (
                    dancer.movementType ===
                    "cycle"
                ) {

                    this.updateStraightMovement(
                        dancer,
                        t
                    );
                }
            }
        );


        if (
            this.stepProgress >= 1
        ) {

            this.finishStep();
        }
    }


    prepareBuild() {

        this.pause();

        this.building = false;
        this.buildReady = true;
        this.autoPlayAfterBuild = false;

        this.buildDimension = 1;
        this.buildStage = "lift";
        this.buildStageTime = 0;
        this.buildLiftProgress = 0;

        this.buildVisibleVertexCount = 1;
        this.buildLiftEdges = [];
        this.buildCopyEdges = [];

        if (this.stepElement) {
            this.stepElement.textContent =
                "Ready to Build";
        }

        this.draw();
    }


    startBuild() {

        this.building = true;
        this.buildReady = false;

        this.buildDimension = 1;
        this.buildStage = "lift";
        this.buildStageTime = 0;
        this.buildLiftProgress = 0;

        this.buildVisibleVertexCount = 1;

        this.buildLiftEdges = [];
        this.buildCopyEdges = [];

        this.lastTime = performance.now();

        if (this.stepElement) {
            this.stepElement.textContent =
                "Building Stage";
        }

        this.draw();
    }


    getBuildLiftEdges() {

        const oldCount =
            2 ** (this.buildDimension - 1);

        const result = [];

        for (
            let i = 0;
            i < oldCount;
            i++
        ) {
            result.push([
                i,
                i + oldCount
            ]);
        }

        return result;
    }


    finishBuildLift() {

        const edges =
            this.getBuildLiftEdges();

        for (const edge of edges) {

            const exists =
                this.buildLiftEdges.some(
                    saved =>
                        saved[0] === edge[0] &&
                        saved[1] === edge[1]
                );

            if (!exists) {
                this.buildLiftEdges.push(edge);
            }
        }
    }


    addBuildCopyEdges() {

        const dimension =
            this.buildDimension;

        const start =
            2 ** (dimension - 1);

        const end =
            2 ** dimension;

        for (
            let vertex = start;
            vertex < end;
            vertex++
        ) {

            for (
                let axis = 0;
                axis < dimension - 1;
                axis++
            ) {

                const other =
                    vertex ^ (1 << axis);

                if (
                    other >= start &&
                    other < end &&
                    vertex < other
                ) {

                    const exists =
                        this.buildCopyEdges.some(
                            edge =>
                                edge[0] === vertex &&
                                edge[1] === other
                        );

                    if (!exists) {
                        this.buildCopyEdges.push([
                            vertex,
                            other
                        ]);
                    }
                }
            }
        }
    }


    updateBuild(deltaTime) {

        if (!this.building) {
            return;
        }

        this.buildStageTime +=
            deltaTime * this.speed;

        if (this.buildStage === "lift") {

            const raw =
                this.buildStageTime /
                this.buildLiftDuration;

            this.buildLiftProgress =
                Math.min(raw, 1);

            if (
                this.buildStageTime >=
                this.buildLiftDuration
            ) {

                this.buildLiftProgress = 1;
                this.finishBuildLift();

                this.buildStage =
                    "pauseAfterLift";

                this.buildStageTime = 0;
            }

            return;
        }

        if (
            this.buildStage ===
            "pauseAfterLift"
        ) {

            if (
                this.buildStageTime >=
                this.buildPauseDuration
            ) {

                this.buildVisibleVertexCount =
                    Math.min(
                        2 ** this.buildDimension,
                        this.vertices.length
                    );

                this.buildStage =
                    "pauseAfterVertices";

                this.buildStageTime = 0;
            }

            return;
        }

        if (
            this.buildStage ===
            "pauseAfterVertices"
        ) {

            if (
                this.buildStageTime >=
                this.buildPauseDuration
            ) {

                this.addBuildCopyEdges();

                this.buildStage =
                    "pauseAfterEdges";

                this.buildStageTime = 0;
            }

            return;
        }

        if (
            this.buildStage ===
            "pauseAfterEdges"
        ) {

            if (
                this.buildStageTime >=
                this.buildPauseDuration
            ) {

                this.buildDimension++;

                if (
                    this.buildDimension > 4
                ) {

                    this.building = false;

                    this.buildVisibleVertexCount =
                        this.vertices.length;

                    this.updateStepText();

                    if (this.autoPlayAfterBuild) {
                        this.autoPlayAfterBuild = false;
                        this.playing = true;
                        this.lastTime = performance.now();
                    }

                    return;
                }

                this.buildStage = "lift";
                this.buildStageTime = 0;
                this.buildLiftProgress = 0;
            }
        }
    }


    loop(time) {

        const deltaTime =
            Math.min(
                time - this.lastTime,
                100
            );


        this.lastTime =
            time;


        if (this.building) {

            this.updateBuild(
                deltaTime
            );

        } else {

            this.update(
                deltaTime
            );
        }


        this.draw();


        this.animationFrame =
            requestAnimationFrame(
                this.loop
            );
    }


    getBounds() {

        if (
            this.vertices.length === 0
        ) {

            return {
                minX: 0,
                maxX: 1,
                minY: 0,
                maxY: 1
            };
        }


        const xs =
            this.vertices.map(
                point => point.x
            );


        const ys =
            this.vertices.map(
                point => point.y
            );


        return {

            minX: Math.min(...xs),
            maxX: Math.max(...xs),

            minY: Math.min(...ys),
            maxY: Math.max(...ys)

        };
    }


    projectPoint(x, y) {

        const bounds =
            this.getBounds();


        const width =
            this.canvas.width;

        const height =
            this.canvas.height;


        const padding =
            Math.min(
                width,
                height
            ) * 0.22;


        const rangeX =
            Math.max(
                bounds.maxX -
                bounds.minX,
                1
            );


        const rangeY =
            Math.max(
                bounds.maxY -
                bounds.minY,
                1
            );


        const scale =
            Math.min(

                (
                    width -
                    padding * 2
                ) / rangeX,

                (
                    height -
                    padding * 2
                ) / rangeY

            );


        const drawingWidth =
            rangeX * scale;

        const drawingHeight =
            rangeY * scale;


        const offsetX =
            (
                width -
                drawingWidth
            ) / 2;


        const offsetY =
            (
                height -
                drawingHeight
            ) / 2;


        return {

            x:
                offsetX +
                (
                    x -
                    bounds.minX
                ) * scale
                - 80,

            y:
                height -
                (
                    offsetY +
                    (
                        y -
                        bounds.minY
                    ) * scale
                )
                - 70

        };
    }


    drawBuild() {

        const ctx =
            this.ctx;

        ctx.save();

        ctx.lineWidth = 1.5;
        ctx.strokeStyle =
            "rgba(80, 80, 80, 0.35)";

        const drawFullEdge =
            (a, b) => {

                const pointA =
                    this.vertices[a];

                const pointB =
                    this.vertices[b];

                if (!pointA || !pointB) {
                    return;
                }

                const p1 =
                    this.projectPoint(
                        pointA.x,
                        pointA.y
                    );

                const p2 =
                    this.projectPoint(
                        pointB.x,
                        pointB.y
                    );

                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            };

        for (
            const [a, b]
            of this.buildLiftEdges
            ) {
            drawFullEdge(a, b);
        }

        for (
            const [a, b]
            of this.buildCopyEdges
            ) {
            drawFullEdge(a, b);
        }

        if (
            this.buildStage === "lift"
        ) {

            const currentEdges =
                this.getBuildLiftEdges();

            for (
                const [a, b]
                of currentEdges
                ) {

                const pointA =
                    this.vertices[a];

                const pointB =
                    this.vertices[b];

                if (!pointA || !pointB) {
                    continue;
                }

                const p1 =
                    this.projectPoint(
                        pointA.x,
                        pointA.y
                    );

                const p2 =
                    this.projectPoint(
                        pointB.x,
                        pointB.y
                    );

                const x =
                    p1.x +
                    (p2.x - p1.x) *
                    this.buildLiftProgress;

                const y =
                    p1.y +
                    (p2.y - p1.y) *
                    this.buildLiftProgress;

                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(x, y);
                ctx.stroke();
            }
        }

        ctx.restore();

        const visibleCount =
            Math.min(
                this.buildVisibleVertexCount,
                this.vertices.length
            );

        for (
            let i = 0;
            i < visibleCount;
            i++
        ) {

            const vertex =
                this.vertices[i];

            if (!vertex) {
                continue;
            }

            const point =
                this.projectPoint(
                    vertex.x,
                    vertex.y
                );

            ctx.save();
            ctx.beginPath();
            ctx.arc(
                point.x,
                point.y,
                5,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                "rgba(80,80,80,0.75)";

            ctx.fill();
            ctx.restore();
        }
    }


    draw() {

        const ctx =
            this.ctx;

        const width =
            this.canvas.width;

        const height =
            this.canvas.height;

        ctx.clearRect(
            0,
            0,
            width,
            height
        );

        if (
            this.vertices.length === 0
        ) {
            return;
        }

        if (this.building || this.buildReady) {
            this.drawBuild();
            return;
        }

        if (this.showSkeleton) {

            ctx.save();

            ctx.lineWidth = 1.5;
            ctx.strokeStyle =
                "rgba(80, 80, 80, 0.35)";

            for (
                const [a, b]
                of this.edges
                ) {

                const pointA =
                    this.vertices[a];

                const pointB =
                    this.vertices[b];

                if (!pointA || !pointB) {
                    continue;
                }

                const p1 =
                    this.projectPoint(
                        pointA.x,
                        pointA.y
                    );

                const p2 =
                    this.projectPoint(
                        pointB.x,
                        pointB.y
                    );

                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
            }

            ctx.restore();
        }

        for (
            const dancer
            of this.dancers
            ) {

            const point =
                this.projectPoint(
                    dancer.x,
                    dancer.y
                );

            const hue =
                (
                    dancer.id *
                    360 /
                    Math.max(
                        this.dancers.length,
                        1
                    )
                );

            ctx.save();
            ctx.beginPath();

            ctx.arc(
                point.x,
                point.y,
                8,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                `hsl(${hue}, 65%, 48%)`;

            ctx.fill();

            ctx.lineWidth = 2;
            ctx.strokeStyle =
                "rgba(255,255,255,0.95)";

            ctx.stroke();
            ctx.restore();
        }
    }


    resize() {

        const rect =
            this.canvas
                .getBoundingClientRect();


        const dpr =
            window.devicePixelRatio || 1;


        const width =
            Math.max(
                Math.floor(
                    rect.width * dpr
                ),
                1
            );


        const height =
            Math.max(
                Math.floor(
                    rect.height * dpr
                ),
                1
            );


        if (
            this.canvas.width !== width ||
            this.canvas.height !== height
        ) {

            this.canvas.width =
                width;

            this.canvas.height =
                height;
        }


        this.draw();
    }

}

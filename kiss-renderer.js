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

        this.danceData = {


            "16": {
                dancers: 16,
                dimension: 4,
                steps: 25,
                dataFile: "CUBE4V.DAT"
            },

        };


        this.loop = this.loop.bind(this);

        this.resize();

        this.animationFrame =
            requestAnimationFrame(this.loop);
    }




    // LOAD DANCE


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
                `Unknown Kiss version: ${version}`
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


            this.updateStepText();

            this.draw();


        } catch (error) {

            console.error(error);

            this.vertices = [];
            this.edges = [];
            this.dancers = [];

            if (this.stepElement) {
                this.stepElement.textContent =
                    "Unable to load dance data";
            }

            this.draw();
        }
    }




    // READ .DAT FILE

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




    // CREATE HYPERCUBE EDGES


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




    // CREATE DANCERS

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

                startVertex: i,

                currentVertex: i,

                targetVertex: i,

                x: vertex.x,
                y: vertex.y,

                startX: vertex.x,
                startY: vertex.y,

                targetX: vertex.x,
                targetY: vertex.y

            });

        }
    }




    // PLAY


    play() {

        if (!this.version) {
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

            }
        );


        this.updateStepText();

        this.draw();
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





    prepareStep() {

        if (!this.version) {
            return;
        }


        const settings =
            this.danceData[
                this.version
                ];


        if (!settings) {
            return;
        }


        /*
         * Each step moves dancers across
         * one hypercube direction.
         *
         * The axis changes as the dance
         * progresses.
         */

        const axis =
            this.currentStep %
            settings.dimension;


        const mask =
            1 << axis;


        this.dancers.forEach(
            dancer => {

                const start =
                    dancer.currentVertex;


                const target =
                    start ^ mask;


                const startPoint =
                    this.vertices[start];


                const targetPoint =
                    this.vertices[target];


                if (
                    !startPoint ||
                    !targetPoint
                ) {
                    return;
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
                    target;

            }
        );


        this.updateStepText();
    }




    finishStep() {

        this.dancers.forEach(
            dancer => {

                dancer.currentVertex =
                    dancer.targetVertex;


                dancer.x =
                    dancer.targetX;

                dancer.y =
                    dancer.targetY;

            }
        );


        const settings =
            this.danceData[
                this.version
                ];


        this.currentStep++;


        if (
            this.currentStep >=
            settings.steps
        ) {

            this.currentStep = 0;

        }


        this.stepProgress = 0;


        this.prepareStep();
    }





    updateStepText() {

        if (!this.stepElement) {
            return;
        }


        const settings =
            this.danceData[
                this.version
                ];


        if (!settings) {

            this.stepElement.textContent =
                "Ready";

            return;
        }


        this.stepElement.textContent =
            `Step ${this.currentStep + 1} of ${settings.steps}`;
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


        /*
         * One step takes about
         * 1.4 seconds at 1× speed.
         */

        const duration =
            1400 / this.speed;


        this.stepProgress +=
            deltaTime / duration;


        const t =
            Math.min(
                this.stepProgress,
                1
            );


        /*
         * Smooth movement.
         */

        const smooth =
            t * t * (3 - 2 * t);


        this.dancers.forEach(
            dancer => {

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
        );


        if (
            this.stepProgress >= 1
        ) {

            this.finishStep();

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


        this.update(deltaTime);

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
                -80,

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



        // HYPERCUBE SKELETON

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


                if (
                    !pointA ||
                    !pointB
                ) {
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

                ctx.moveTo(
                    p1.x,
                    p1.y
                );

                ctx.lineTo(
                    p2.x,
                    p2.y
                );

                ctx.stroke();

            }


            ctx.restore();
        }



        // DANCERS

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
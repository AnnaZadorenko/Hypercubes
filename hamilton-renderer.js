

export class HamiltonRenderer {

    constructor(canvas, stepText = null) {

        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.stepText = stepText;

        this.vertices = [];
        this.edges = [];
        this.dancers = [];

        this.circuit = [
            0, 1, 3, 2,
            6, 7, 5, 4,
            12, 13, 15, 14,
            10, 11, 9, 8
        ];

        this.dancerLabels = [
            "R", "O", "M", "B",
            "P", "G’", "G", "Y",
            "y", "g", "g’", "p",
            "b", "m", "o", "r"
        ];

        this.dancerColors = [
            "#e53935",
            "#fb8c00",
            "#fdd835",
            "#43a047",
            "#00acc1",
            "#6d4c41",
            "#5e35b1",
            "#39ff14",
            "#e53935",
            "#fb8c00",
            "#fdd835",
            "#43a047",
            "#00acc1",
            "#6d4c41",
            "#5e35b1",
            "#39ff14"
        ];

        this.speed = 1;
        this.showSkeleton = true;

        this.currentStep = 0;
        this.stepProgress = 0;
        this.pauseProgress = 0;

        this.moveDuration = 5000;
        this.pauseDuration = 1500;

        this.playing = false;
        this.loaded = false;

        this.building = false;
        this.buildReady = false;
        this.autoPlayAfterBuild = false;

        this.buildDimension = 1;
        this.buildStage = "lift";
        this.buildStageTime = 0;
        this.buildLiftProgress = 0;

        this.buildLiftDuration = 1200;
        this.buildPauseDuration = 400;

        this.buildVisibleVertexCount = 1;
        this.buildLiftEdges = [];
        this.buildCopyEdges = [];

        this.animationFrame = null;
        this.lastTime = null;

        this.loop = this.loop.bind(this);
    }


    async setCircuit(options = {}) {

        this.pause();

        if (this.animationFrame !== null) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }

        this.loaded = false;

        const fileName =
            options.dataFile || "CUBE4V.DAT";

        try {

            const response = await fetch(
                `data/${fileName}`
            );

            if (!response.ok) {
                throw new Error(
                    `Cannot load data/${fileName}`
                );
            }

            const text = await response.text();

            this.vertices =
                this.parseCoordinateFile(text);

            if (this.vertices.length !== 16) {
                throw new Error(
                    "Expected 16 vertices"
                );
            }

            this.createEdges();
            this.createDancers();

            this.loaded = true;

            this.prepareBuild();

        } catch (error) {

            console.error(error);

            this.vertices = [];
            this.edges = [];
            this.dancers = [];

            this.setStepText(
                "Unable to load Hamiltonian Circuit"
            );
        }
    }


    parseCoordinateFile(text) {

        const lines = text
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(Boolean);

        const points = [];

        for (const line of lines) {

            const numbers = line
                .replace(/,/g, " ")
                .split(/\s+/)
                .map(Number)
                .filter(Number.isFinite);

            if (numbers.length >= 2) {

                points.push({
                    x: numbers[0],
                    y: numbers[1]
                });
            }

            if (points.length === 16) {
                break;
            }
        }

        return points;
    }


    createEdges() {

        this.edges = [];

        for (let vertex = 0; vertex < 16; vertex++) {

            for (let axis = 0; axis < 4; axis++) {

                const neighbor =
                    vertex ^ (1 << axis);

                if (neighbor > vertex) {

                    this.edges.push([
                        vertex,
                        neighbor
                    ]);
                }
            }
        }
    }


    createDancers() {

        this.dancers = [];

        for (let i = 0; i < 16; i++) {

            this.dancers.push({
                id: i,
                position: i
            });
        }
    }


    setStepText(text) {

        if (this.stepText) {
            this.stepText.textContent = text;
        }
    }


    updateStepText() {

        if (this.currentStep >= 16) {

            this.setStepText(
                "Step 16 of 16 — Completed"
            );

            return;
        }

        this.setStepText(
            `Step ${this.currentStep + 1} of 16`
        );
    }


    prepareBuild() {

        this.pause();

        this.currentStep = 0;
        this.stepProgress = 0;
        this.pauseProgress = 0;

        this.createDancers();

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

        this.setStepText("Ready to Build");

        this.ctx.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

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

        this.lastTime = null;

        this.setStepText("Building Stage");

        this.startLoop();
    }


    getBuildLiftEdges() {

        const count =
            2 ** (this.buildDimension - 1);

        const result = [];

        for (let i = 0; i < count; i++) {

            result.push([
                i,
                i + count
            ]);
        }

        return result;
    }


    finishBuildLift() {

        for (const edge of this.getBuildLiftEdges()) {

            this.buildLiftEdges.push(edge);
        }
    }


    addBuildCopyEdges() {

        const start =
            2 ** (this.buildDimension - 1);

        const end =
            2 ** this.buildDimension;

        for (let vertex = start; vertex < end; vertex++) {

            for (
                let axis = 0;
                axis < this.buildDimension - 1;
                axis++
            ) {

                const neighbor =
                    vertex ^ (1 << axis);

                if (
                    neighbor >= start &&
                    neighbor < end &&
                    vertex < neighbor
                ) {

                    this.buildCopyEdges.push([
                        vertex,
                        neighbor
                    ]);
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

            this.buildLiftProgress = Math.min(
                this.buildStageTime /
                this.buildLiftDuration,
                1
            );

            if (
                this.buildStageTime >=
                this.buildLiftDuration
            ) {

                this.buildLiftProgress = 1;

                this.finishBuildLift();

                this.buildStage = "pauseAfterLift";
                this.buildStageTime = 0;
            }

            return;
        }

        if (this.buildStage === "pauseAfterLift") {

            if (
                this.buildStageTime >=
                this.buildPauseDuration
            ) {

                this.buildVisibleVertexCount =
                    Math.min(
                        2 ** this.buildDimension,
                        16
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

        if (this.buildStage === "pauseAfterEdges") {

            if (
                this.buildStageTime >=
                this.buildPauseDuration
            ) {

                this.buildDimension++;

                if (this.buildDimension > 4) {

                    this.building = false;
                    this.buildVisibleVertexCount = 16;

                    this.updateStepText();

                    if (this.autoPlayAfterBuild) {

                        this.autoPlayAfterBuild = false;
                        this.playing = true;
                        this.lastTime = null;
                    }

                    return;
                }

                this.buildStage = "lift";
                this.buildStageTime = 0;
                this.buildLiftProgress = 0;
            }
        }
    }


    play() {

        if (!this.loaded) {
            return;
        }

        if (this.building) {
            this.autoPlayAfterBuild = true;
            return;
        }

        if (this.buildReady) {

            this.autoPlayAfterBuild = true;
            this.startBuild();

            return;
        }

        if (this.currentStep >= 16) {

            this.currentStep = 0;
            this.stepProgress = 0;
            this.pauseProgress = 0;

            this.createDancers();
        }

        this.playing = true;
        this.lastTime = null;

        this.updateStepText();

        this.startLoop();
    }


    pause() {

        this.playing = false;
        this.lastTime = null;
    }


    reset() {

        if (!this.loaded) {
            return;
        }

        this.prepareBuild();
    }


    setSpeed(speed) {

        const value = Number(speed);

        if (
            Number.isFinite(value) &&
            value > 0
        ) {
            this.speed = value;
        }
    }


    setShowSkeleton(show) {

        this.showSkeleton = Boolean(show);
        this.draw();
    }


    update(deltaTime) {

        if (!this.playing) {
            return;
        }

        if (this.currentStep >= 16) {

            this.pause();
            return;
        }

        if (this.pauseProgress > 0) {

            this.pauseProgress -=
                deltaTime * this.speed;

            if (this.pauseProgress < 0) {
                this.pauseProgress = 0;
            }

            return;
        }

        this.stepProgress +=
            deltaTime * this.speed /
            this.moveDuration;

        if (this.stepProgress >= 1) {

            this.stepProgress = 0;

            for (const dancer of this.dancers) {

                dancer.position =
                    (dancer.position + 1) % 16;
            }

            this.currentStep++;

            if (this.currentStep >= 16) {

                this.currentStep = 16;

                this.pause();
                this.updateStepText();

                return;
            }

            this.pauseProgress =
                this.pauseDuration;

            this.updateStepText();
        }
    }


    getBounds() {

        if (this.vertices.length === 0) {

            return {
                minX: 0,
                maxX: 1,
                minY: 0,
                maxY: 1
            };
        }

        const xs =
            this.vertices.map(v => v.x);

        const ys =
            this.vertices.map(v => v.y);

        return {
            minX: Math.min(...xs),
            maxX: Math.max(...xs),
            minY: Math.min(...ys),
            maxY: Math.max(...ys)
        };
    }


    projectPoint(point) {

        const bounds = this.getBounds();

        const width = this.canvas.width;
        const height = this.canvas.height;

        const dpr =
            window.devicePixelRatio || 1;

        const padding = 90 * dpr;

        const rangeX = Math.max(
            1,
            bounds.maxX - bounds.minX
        );

        const rangeY = Math.max(
            1,
            bounds.maxY - bounds.minY
        );

        const scale = Math.max(
            0.01,
            Math.min(
                (width - padding * 2) / rangeX,
                (height - padding * 2) / rangeY
            ) * 0.60
        );

        const drawingWidth = rangeX * scale;
        const drawingHeight = rangeY * scale;

        return {
            x:
                (width - drawingWidth) / 2 +
                (point.x - bounds.minX) * scale -
                80 * dpr,

            y:
                height -
                (
                    (height - drawingHeight) / 2 +
                    (point.y - bounds.minY) * scale
                ) -
                80 * dpr
        };
    }


    drawEdge(a, b, progress = 1) {

        const from = this.vertices[a];
        const to = this.vertices[b];

        if (!from || !to) {
            return;
        }

        const p1 = this.projectPoint(from);
        const p2 = this.projectPoint(to);

        const x =
            p1.x + (p2.x - p1.x) * progress;

        const y =
            p1.y + (p2.y - p1.y) * progress;

        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
    }


    drawDancerCircle(id, x, y) {

        const ctx = this.ctx;

        const dpr =
            window.devicePixelRatio || 1;

        const radius = 5 * dpr;

        const color =
            this.dancerColors[id];

        const hollow =
            id >= 8;

        ctx.save();

        ctx.beginPath();

        ctx.arc(
            x,
            y,
            radius,
            0,
            Math.PI * 2
        );

        if (hollow) {

            ctx.fillStyle = "#ffffff";
            ctx.fill();

            ctx.strokeStyle = color;
            ctx.lineWidth = 3 * dpr;
            ctx.stroke();

        } else {

            ctx.fillStyle = color;
            ctx.fill();
        }

        ctx.restore();
    }


    drawBuild() {

        const ctx = this.ctx;
        const dpr =
            window.devicePixelRatio || 1;

        ctx.save();

        ctx.strokeStyle = "#b7b7b7";
        ctx.lineWidth = 1.2 * dpr;

        for (const [a, b] of this.buildLiftEdges) {
            this.drawEdge(a, b);
        }

        for (const [a, b] of this.buildCopyEdges) {
            this.drawEdge(a, b);
        }

        if (this.buildStage === "lift") {

            for (
                const [a, b] of
                this.getBuildLiftEdges()
                ) {

                this.drawEdge(
                    a,
                    b,
                    this.buildLiftProgress
                );
            }
        }

        ctx.restore();

        for (
            let i = 0;
            i < this.buildVisibleVertexCount;
            i++
        ) {

            const vertex = this.vertices[i];

            if (!vertex) {
                continue;
            }

            const point = this.projectPoint(vertex);

            const dancerIndex =
                this.circuit.indexOf(i);

            this.drawDancerCircle(
                dancerIndex,
                point.x,
                point.y
            );
        }
    }


    drawSkeleton() {

        if (!this.showSkeleton) {
            return;
        }

        const ctx = this.ctx;
        const dpr =
            window.devicePixelRatio || 1;

        ctx.save();

        ctx.strokeStyle = "#b7b7b7";
        ctx.lineWidth = 1.2 * dpr;

        for (const [a, b] of this.edges) {
            this.drawEdge(a, b);
        }

        ctx.restore();
    }


    drawCircuit() {

        const ctx = this.ctx;
        const dpr =
            window.devicePixelRatio || 1;

        ctx.save();

        ctx.strokeStyle = "#a6192e";
        ctx.lineWidth = 2.5 * dpr;
        ctx.globalAlpha = 0.7;

        for (let i = 0; i < 16; i++) {

            const a = this.circuit[i];

            const b = this.circuit[
            (i + 1) % 16
                ];

            this.drawEdge(a, b);
        }

        ctx.restore();
    }


    drawDancers() {

        for (const dancer of this.dancers) {

            const fromIndex =
                this.circuit[dancer.position];

            const toIndex =
                this.circuit[
                (dancer.position + 1) % 16
                    ];

            const from =
                this.vertices[fromIndex];

            const to =
                this.vertices[toIndex];

            if (!from || !to) {
                continue;
            }

            let t = 0;

            if (
                this.playing &&
                this.pauseProgress === 0
            ) {

                const progress = Math.min(
                    this.stepProgress,
                    1
                );

                t =
                    progress * progress *
                    (3 - 2 * progress);
            }

            const position = {
                x:
                    from.x +
                    (to.x - from.x) * t,

                y:
                    from.y +
                    (to.y - from.y) * t
            };

            const point =
                this.projectPoint(position);

            this.drawDancerCircle(
                dancer.id,
                point.x,
                point.y
            );
        }
    }


    draw() {

        const ctx = this.ctx;

        ctx.clearRect(
            0,
            0,
            this.canvas.width,
            this.canvas.height
        );

        if (!this.loaded) {
            return;
        }

        if (this.building || this.buildReady) {

            this.drawBuild();
            return;
        }

        this.drawSkeleton();
        this.drawCircuit();
        this.drawDancers();
    }


    startLoop() {

        if (this.animationFrame !== null) {
            return;
        }

        this.animationFrame =
            requestAnimationFrame(this.loop);
    }


    loop(timestamp) {

        this.animationFrame = null;

        if (!this.building && !this.playing) {
            this.draw();
            return;
        }

        if (this.lastTime === null) {
            this.lastTime = timestamp;
        }

        const deltaTime = Math.min(
            timestamp - this.lastTime,
            100
        );

        this.lastTime = timestamp;

        if (this.building) {

            this.updateBuild(deltaTime);

        } else {

            this.update(deltaTime);
        }

        this.draw();

        if (this.building || this.playing) {

            this.animationFrame =
                requestAnimationFrame(this.loop);
        }
    }


    resize() {

        const rect =
            this.canvas.getBoundingClientRect();

        const dpr =
            window.devicePixelRatio || 1;

        const width = Math.max(
            1,
            Math.floor(rect.width * dpr)
        );

        const height = Math.max(
            1,
            Math.floor(rect.height * dpr)
        );

        if (
            this.canvas.width !== width ||
            this.canvas.height !== height
        ) {

            this.canvas.width = width;
            this.canvas.height = height;
        }

        this.draw();
    }
}

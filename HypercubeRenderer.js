import { figure_buildersMethods } from "./figure-builders.js";
import { animationMethods } from "./animation.js";
import { rotationMethods } from "./rotation.js";
import { drawingMethods } from "./drawing.js";
import { export_dataMethods } from "./export-data.js";

/*

QBasic HYPERCUBE to JavaScript Translation


1  = CUBE (IN 3-D)

2  = TESSERACT OR 4-D CUBE

31 = 5-D HYPERCUBE
     ISOMETRIC PROJECTION

32 = 5-D HYPERCUBE
     TESSERACT PROJECTION

33 = 5-D HYPERCUBE
     DISTORTED ISOMETRIC PROJECTION

41 = 6-D HYPERCUBE
     ISOMETRIC PROJECTION

42 = 6-D HYPERCUBE
     TESSERACT PROJECTION



*/

export class QBasicHypercubeRenderer {

    constructor(canvas) {


        // CANVAS

        this.canvas = canvas;

        this.ctx =
            canvas.getContext("2d");



        // ORIGINAL QBasic WINDOW


        /*
        BASIC:

            SCREEN 12

            WINDOW (0, 0)-(135, 100)
        */

        this.logicalWidth = 135;

        this.logicalHeight = 100;



        // DEFAULT FIGURE


        /*
        Start with BASIC option 2:

            TESSERACT OR 4-D CUBE
        */

        this.option = 2;

        this.dimension = 4;

        this.ivert = 16;

        this.imax = 4;


        // ORIGINAL BASIC ARRAYS


        /*
        BASIC:

        REDIM vx(64), vy(64), dvx(6), dvy(6), ncl(64)

        We use zero-based JavaScript arrays.

        BASIC vx(1)
        becomes
        JS vx[0]
        */

        this.vx =
            new Array(64).fill(0);

        this.vy =
            new Array(64).fill(0);

        this.dvx =
            new Array(6).fill(0);

        this.dvy =
            new Array(6).fill(0);

        this.ncl =
            new Array(64).fill(4);



        // COLOR ARRAY


        /*
        BASIC:

        FOR i = 1 TO 16
            ncl(i) = 4
        NEXT

        FOR i = 17 TO 32
            ncl(i) = 3
        NEXT

        FOR i = 33 TO 48
            ncl(i) = 1
        NEXT

        FOR i = 49 TO 64
            ncl(i) = 14
        NEXT
        */

        for (
            let i = 0;
            i < 16;
            i++
        ) {

            this.ncl[i] = 4;

        }


        for (
            let i = 16;
            i < 32;
            i++
        ) {

            this.ncl[i] = 3;

        }


        for (
            let i = 32;
            i < 48;
            i++
        ) {

            this.ncl[i] = 1;

        }


        for (
            let i = 48;
            i < 64;
            i++
        ) {

            this.ncl[i] = 14;

        }



        // DISPLAY OPTIONS


        this.showVertices = true;

        this.showPath = true;




        this.autoRotate = false;
        this.rotationAngle = 0;

        this.rotationVertices = [];

        this.rotationEdges = [];

        this.rotationDimension = 0;

        // SPEED


        this.speed = 1;



        // ANIMATION


        this.playing = false;

        this.finished = false;


        /*
        Equivalent to BASIC:

            FOR i = 1 TO imax
        */

        this.currentI = 1;


        /*
        Animation stages:

        "lift"
            = BASIC SUB 100 + SUB 60

        "pauseAfterLift"
            = SLEEP 1

        "vertices"
            = BASIC SUB 110

        "pauseAfterVertices"
            = SLEEP 1

        "edges"
            = BASIC SUB 120

        "pauseAfterEdges"
            = SLEEP 1
        */

        this.stage = "lift";

        this.stageTime = 0;




        this.liftProgress = 0;



        // COMPLETED CONSTRUCTION


        /*
        Number of fully completed dimensions.

        Initially only vertex 1 exists.

        completedDimension = 0
        */

        this.completedDimension = 0;


        /*
        Store completed lifting edges.


        */

        this.completedLiftEdges = [];


        /*
        Store edges produced by SUB 120.
        */

        this.completedCopyEdges = [];


        /*
        Number of currently visible vertices.


        */

        this.visibleVertexCount = 1;



        // TIMING


        this.lastTime =
            performance.now();




        this.liftDuration = 1000;

        this.sleepDuration = 1000;



        // GENERATE INITIAL FIGURE


        this.buildFigure(
            this.option
        );



        // RESIZE


        this.resizeObserver =
            new ResizeObserver(
                () => {

                    this.resize();

                }
            );


        this.resizeObserver.observe(
            this.canvas
        );


        window.addEventListener(
            "resize",
            () => {

                this.resize();

            }
        );


        this.resize();



        // LOOP


        this.loop =
            this.loop.bind(this);


        requestAnimationFrame(
            this.loop
        );

    }

}

Object.assign(
    QBasicHypercubeRenderer.prototype,
    figure_buildersMethods,
    animationMethods,
    rotationMethods,
    drawingMethods,
    export_dataMethods
);

window.HypercubeRenderer = QBasicHypercubeRenderer;

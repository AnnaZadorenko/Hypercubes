export const animationMethods = {

    play() {

        /*
        BASIC restart means construction starts again.

        If already finished, Play restarts.
        */

        if (
            this.autoRotate
        ) {

            this.playing = true;

            return;

        }


        if (
            this.finished
        ) {

            this.reset();

        }


        this.playing = true;

    },

    pause() {

        this.playing = false;

    },

    reset() {

        this.playing = false;

        this.finished = false;


        /*
        BASIC:

        CIRCLE (vx(1), vy(1))...

        then

        FOR i = 1 TO imax
        */

        this.currentI = 1;


        this.stage =
            "lift";


        this.stageTime = 0;


        this.liftProgress = 0;


        this.completedDimension = 0;


        this.completedLiftEdges = [];


        this.completedCopyEdges = [];


        this.visibleVertexCount = 1;


        this.rotationAngle = 0;


        if (
            this.autoRotate
        ) {

            this.visibleVertexCount =
                this.ivert;

            this.completedDimension =
                this.dimension;

            this.completedLiftEdges = [];

            this.completedCopyEdges = [];


            for (
                let vertex = 0;
                vertex < this.ivert;
                vertex++
            ) {

                for (
                    let d = 0;
                    d < this.dimension;
                    d++
                ) {

                    const other =
                        vertex ^
                        (1 << d);


                    if (
                        vertex < other
                    ) {

                        this.completedCopyEdges.push(
                            [
                                vertex,
                                other
                            ]
                        );

                    }

                }

            }


            this.finished = true;

        }

    },

    setSpeed(speed) {

        const value =
            Number(speed);


        if (
            Number.isFinite(value) &&
            value > 0
        ) {

            this.speed = value;

        }

        else {

            this.speed = 1;

        }

    },

    setOptions(options = {}) {

        if (
            "showVertices" in options
        ) {

            this.showVertices =
                Boolean(
                    options.showVertices
                );

        }


        if (
            "showPath" in options
        ) {

            this.showPath =
                Boolean(
                    options.showPath
                );

        }




        if (
            "autoRotate" in options
        ) {

            this.autoRotate =
                Boolean(
                    options.autoRotate
                );

        }

    },

    getCurrentLiftEdges() {

        /*
        BASIC:

        100

        i1 = i - 1

        n = 2 ^ i1

        FOR j = 1 TO n

            xi(j) = vx(j)
            yi(j) = vy(j)

            xf(j) = vx(j + n)
            yf(j) = vy(j + n)

        NEXT
        */


        const i1 =
            this.currentI -
            1;


        const n =
            2 ** i1;


        const edges = [];


        for (
            let j = 0;
            j < n;
            j++
        ) {

            edges.push(

                [

                    j,

                    j + n

                ]

            );

        }


        return edges;

    },

    executeSub110() {

        /*
        BASIC:

        i1 = i - 1

        n = 2 ^ i1

        n1 = n + 1

        n2 = 2 ^ i

        FOR j = n1 TO n2

            CIRCLE ...
            PAINT ...

        NEXT


        All vertices appear during this subroutine.

        There is NO slow vertex-by-vertex animation.
        */


        const n =
            2 **
            (
                this.currentI -
                1
            );


        const n2 =
            2 **
            this.currentI;



        this.visibleVertexCount =
            n2;


        void n;

    },

    executeSub120() {




        const i =
            this.currentI;


        const i1 =
            i -
            1;


        const n =
            2 ** i1;


        /*
        BASIC:

            n1 = n + 1
            n2 = 2 ^ i
            n21 = n2 + 1

        Zero-based conversion:

            BASIC vertex j
            becomes JS index j - 1.
        */

        const n1 =
            n + 1;


        const n2 =
            2 ** i;


        const n21 =
            n2 +
            1;


        for (
            let j = n1;
            j <= n2;
            j++
        ) {

            /*
            BASIC numbering is retained inside this routine
            to make the translation easier to compare.
            */

            let jm =
                j -
                n1;


            let m1 = 0;

            let m2 = 0;

            let m3 = 0;

            let m4 = 0;

            let m5 = 0;

            let m6 = 0;


            if (
                jm > 31
            ) {

                m6 = 1;

            }


            jm =
                jm -
                m6 * 32;


            if (
                jm > 15
            ) {

                m5 = 1;

            }


            jm =
                jm -
                m5 * 16;


            if (
                jm > 7
            ) {

                m4 = 1;

            }


            jm =
                jm -
                m4 * 8;


            if (
                jm > 3
            ) {

                m3 = 1;

            }


            jm =
                jm -
                m3 * 4;


            if (
                jm > 1
            ) {

                m2 = 1;

            }


            jm =
                jm -
                m2 * 2;


            if (
                jm > 0
            ) {

                m1 = 1;

            }



            // BASIC:
            // IF m1 = 0 THEN ...


            if (
                m1 === 0
            ) {

                const jf =

                    m6 * 32 +

                    m5 * 16 +

                    m4 * 8 +

                    m3 * 4 +

                    m2 * 2 +

                    1 +

                    n1;


                if (
                    jf < n21
                ) {

                    this.addCopyEdge(

                        j - 1,

                        jf - 1

                    );

                }

            }



            // IF m2 = 0


            if (
                m2 === 0
            ) {

                const jf =

                    m6 * 32 +

                    m5 * 16 +

                    m4 * 8 +

                    m3 * 4 +

                    2 +

                    m1 +

                    n1;


                if (
                    jf < n21
                ) {

                    this.addCopyEdge(

                        j - 1,

                        jf - 1

                    );

                }

            }



            // IF m3 = 0


            if (
                m3 === 0
            ) {

                const jf =

                    m6 * 32 +

                    m5 * 16 +

                    m4 * 8 +

                    4 +

                    m2 * 2 +

                    m1 +

                    n1;


                if (
                    jf < n21
                ) {

                    this.addCopyEdge(

                        j - 1,

                        jf - 1

                    );

                }

            }



            // IF m4 = 0

            if (
                m4 === 0
            ) {

                const jf =

                    m6 * 32 +

                    m5 * 16 +

                    8 +

                    m3 * 4 +

                    m2 * 2 +

                    m1 +

                    n1;


                if (
                    jf < n21
                ) {

                    this.addCopyEdge(

                        j - 1,

                        jf - 1

                    );

                }

            }



            // IF m5 = 0


            if (
                m5 === 0
            ) {

                const jf =

                    m6 * 32 +

                    16 +

                    m4 * 8 +

                    m3 * 4 +

                    m2 * 2 +

                    m1 +

                    n1;


                if (
                    jf < n21
                ) {

                    this.addCopyEdge(

                        j - 1,

                        jf - 1

                    );

                }

            }



            if (
                m6 === 0
            ) {

                const jf =

                    32 +

                    m5 * 16 +

                    m4 * 8 +

                    m3 * 4 +

                    m2 * 2 +

                    m1 +

                    n1;


                if (
                    jf < n21
                ) {

                    this.addCopyEdge(

                        j - 1,

                        jf - 1

                    );

                }

            }

        }


        this.completedDimension =
            this.currentI;

    },

    addCopyEdge(a, b) {

        const exists =

            this.completedCopyEdges.some(

                edge =>

                    edge[0] === a &&
                    edge[1] === b

            );


        if (
            !exists
        ) {

            this.completedCopyEdges.push(

                [
                    a,
                    b
                ]

            );

        }

    },

    finishLift() {

        const edges =
            this.getCurrentLiftEdges();


        for (
            const edge
            of edges
            ) {

            const exists =

                this.completedLiftEdges.some(

                    saved =>

                        saved[0] === edge[0] &&
                        saved[1] === edge[1]

                );


            if (
                !exists
            ) {

                this.completedLiftEdges.push(
                    edge
                );

            }

        }

    },

    update(delta) {

        if (
            !this.playing ||
            this.finished
        ) {

            return;

        }


        /*
        Speed applies to both line drawing and BASIC SLEEP.
        */

        this.stageTime +=

            delta *
            this.speed;




        if (
            this.stage === "lift"
        ) {

            /*
            BASIC SUB 60:

                nc = 1000
                nc3 = nc - 20

            It draws through approximately 98% of each line.
            */

            const raw =

                this.stageTime /
                this.liftDuration;


            this.liftProgress =

                Math.min(

                    0.98,

                    raw *
                    0.98

                );


            if (
                this.stageTime >=
                this.liftDuration
            ) {

                this.liftProgress =
                    0.98;




                this.finishLift();


                this.stage =
                    "pauseAfterLift";


                this.stageTime = 0;

            }


            return;

        }


        if (
            this.stage ===
            "pauseAfterLift"
        ) {

            if (
                this.stageTime >=
                this.sleepDuration
            ) {


                this.executeSub110();


                this.stage =
                    "pauseAfterVertices";


                this.stageTime = 0;

            }


            return;

        }



        if (
            this.stage ===
            "pauseAfterVertices"
        ) {

            if (
                this.stageTime >=
                this.sleepDuration
            ) {

                /*
                BASIC:

                    GOSUB 120

                All new edges appear immediately.
                */

                this.executeSub120();


                this.stage =
                    "pauseAfterEdges";


                this.stageTime = 0;

            }


            return;

        }




        if (
            this.stage ===
            "pauseAfterEdges"
        ) {

            if (
                this.stageTime >=
                this.sleepDuration
            ) {

                this.currentI++;


                /*
                BASIC:

                    NEXT

                until i > imax
                */

                if (
                    this.currentI >
                    this.imax
                ) {

                    this.finished = true;

                    this.playing = false;

                    return;

                }


                this.stage =
                    "lift";


                this.stageTime = 0;

                this.liftProgress = 0;

            }

        }

    }

};

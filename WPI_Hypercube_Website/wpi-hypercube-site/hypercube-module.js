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


class QBasicHypercubeRenderer {

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




    // SET EXACT BASIC OPTION


    setOption(option) {

        option =
            Number(option);




        const allowed = [

            1,

            2,

            31,

            32,

            33,

            41,

            42

        ];


        if (
            !allowed.includes(option)
        ) {

            console.warn(
                "Only QBasic options 1, 2, 31, 32, 33, 41 and 42 exist."
            );

            return;

        }


        this.option = option;


        this.buildFigure(
            option
        );


        this.reset();

    }





    setDimension(dimension) {

        dimension =
            Number(dimension);




        if (
            dimension === 3
        ) {

            this.setOption(1);

        }

        else if (
            dimension === 4
        ) {

            this.setOption(2);

        }

        else if (
            dimension === 5
        ) {

            this.setOption(31);

        }

        else if (
            dimension === 6
        ) {

            this.setOption(41);

        }

        else {

            console.warn(
                "This BASIC program contains only dimensions 3 through 6."
            );

        }

    }





    setProjection(option) {

        this.setOption(option);

    }



    // BUILD FIGURE

    buildFigure(option) {

        /*
        Clear BASIC arrays.
        */

        this.vx.fill(0);

        this.vy.fill(0);

        this.dvx.fill(0);

        this.dvy.fill(0);


        if (
            option === 1
        ) {

            this.build3D();

        }


        else if (
            option === 2
        ) {

            this.build4D();

        }


        else if (
            option === 31 ||
            option === 32 ||
            option === 33
        ) {

            this.build5D(
                option
            );

        }


        else if (
            option === 41 ||
            option === 42
        ) {

            this.build6D(
                option
            );

        }

    }



    // BASIC LABEL 1
    // 3D CUBE

    build3D() {

        /*
        BASIC:

        1 l = 35

        vx(1) = 37.5
        vy(1) = 25
        */

        const l = 35;


        this.vx[0] = 37.5;

        this.vy[0] = 25;


        /*
        BASIC:

        dvx(1) = l
        dvy(1) = 0

        dvx(2) = 0
        dvy(2) = l

        dvx(3) = l / SQR(2)
        dvy(3) = dvx(3)
        */

        this.dvx[0] = l;

        this.dvy[0] = 0;


        this.dvx[1] = 0;

        this.dvy[1] = l;


        this.dvx[2] =
            l /
            Math.sqrt(2);


        this.dvy[2] =
            this.dvx[2];


        /*
        BASIC:

        FOR i = 0 TO 1
        FOR j = 0 TO 1
        FOR k = 0 TO 1

        n = 4*i + 2*j + k + 1

        vx(n) =
            vx(1)
            + k*dvx(1)
            + j*dvx(2)
            + i*dvx(3)

        vy(n) =
            vy(1)
            + k*dvy(1)
            + j*dvy(2)
            + i*dvy(3)
        */

        for (
            let i = 0;
            i <= 1;
            i++
        ) {

            for (
                let j = 0;
                j <= 1;
                j++
            ) {

                for (
                    let k = 0;
                    k <= 1;
                    k++
                ) {

                    const n =

                        4 * i +

                        2 * j +

                        k;


                    this.vx[n] =

                        this.vx[0] +

                        k *
                        this.dvx[0] +

                        j *
                        this.dvx[1] +

                        i *
                        this.dvx[2];


                    this.vy[n] =

                        this.vy[0] +

                        k *
                        this.dvy[0] +

                        j *
                        this.dvy[1] +

                        i *
                        this.dvy[2];

                }

            }

        }


        /*
        BASIC:

        ivert = 8
        imax = 3
        */

        this.ivert = 8;

        this.imax = 3;

        this.dimension = 3;

    }



    // BASIC LABEL 2
    // 4D TESSERACT

    build4D() {

        /*
        BASIC:

        2 l = 30

        vx(1) = 52.5
        vy(1) = 18
        */

        const l = 30;


        this.vx[0] = 52.5;

        this.vy[0] = 18;


        /*
        BASIC:

        dvx(1) = l
        dvy(1) = 0

        dvx(2) = 0
        dvy(2) = l

        dvx(3) = l / SQR(2)
        dvy(3) = dvx(3)

        dvx(4) = -dvx(3)
        dvy(4) = dvy(3)
        */

        this.dvx[0] = l;

        this.dvy[0] = 0;


        this.dvx[1] = 0;

        this.dvy[1] = l;


        this.dvx[2] =
            l /
            Math.sqrt(2);


        this.dvy[2] =
            this.dvx[2];


        this.dvx[3] =
            -this.dvx[2];


        this.dvy[3] =
            this.dvy[2];


        /*
        BASIC:

        FOR i = 0 TO 1
        FOR j = 0 TO 1
        FOR k = 0 TO 1
        FOR l = 0 TO 1

        n = 8*i + 4*j + 2*k + l + 1
        */

        for (
            let i = 0;
            i <= 1;
            i++
        ) {

            for (
                let j = 0;
                j <= 1;
                j++
            ) {

                for (
                    let k = 0;
                    k <= 1;
                    k++
                ) {

                    for (
                        let ll = 0;
                        ll <= 1;
                        ll++
                    ) {

                        const n =

                            8 * i +

                            4 * j +

                            2 * k +

                            ll;


                        this.vx[n] =

                            this.vx[0] +

                            ll *
                            this.dvx[0] +

                            k *
                            this.dvx[1] +

                            j *
                            this.dvx[2] +

                            i *
                            this.dvx[3];


                        this.vy[n] =

                            this.vy[0] +

                            ll *
                            this.dvy[0] +

                            k *
                            this.dvy[1] +

                            j *
                            this.dvy[2] +

                            i *
                            this.dvy[3];

                    }

                }

            }

        }


        /*
        BASIC:

        ivert = 16
        imax = 4
        */

        this.ivert = 16;

        this.imax = 4;

        this.dimension = 4;

    }



    // BASIC LABEL 3
    // 5D HYPERCUBE

    build5D(option) {

        /*
        BASIC:

        pi = 3.141592654#
        */

        const pi =
            3.141592654;


        let l1;

        let l2;


        let t1;

        let t2;

        let t3;

        let t4;

        let t5;


        // OPTION 31


        if (
            option === 31
        ) {

            /*
            BASIC:

            l1 = 25
            l2 = l1

            vx(1) = 60
            vy(1) = 20

            t1 = 0
            t2 = 36
            t3 = 2 * t2
            t4 = 3 * t2
            t5 = 4 * t2
            */

            l1 = 25;

            l2 = l1;


            this.vx[0] = 60;

            this.vy[0] = 20;


            t1 = 0;

            t2 = 36;

            t3 =
                2 *
                t2;

            t4 =
                3 *
                t2;

            t5 =
                4 *
                t2;

        }



            // OPTION 32


        else if (
            option === 32
        ) {

            /*
            BASIC:

            l1 = 25
            l2 = 67

            vx(1) = 23
            vy(1) = 15

            t1 = 0
            t2 = 90
            t3 = 45
            t4 = 135
            t5 = 15
            */

            l1 = 25;

            l2 = 67;


            this.vx[0] = 23;

            this.vy[0] = 15;


            t1 = 0;

            t2 = 90;

            t3 = 45;

            t4 = 135;

            t5 = 15;

        }



            // OPTION 33


        else {

            /*
            BASIC:

            l1 = 32
            l2 = 33

            vx(1) = 60
            vy(1) = 12

            t1 = 0
            t2 = 36
            t3 = 72
            t4 = 120
            t5 = 170
            */

            l1 = 32;

            l2 = 33;


            this.vx[0] = 60;

            this.vy[0] = 12;


            t1 = 0;

            t2 = 36;

            t3 = 72;

            t4 = 120;

            t5 = 170;

        }


        /*
        BASIC:

        th1 = t1*pi/180
        ...
        */

        const th1 =
            t1 *
            pi /
            180;


        const th2 =
            t2 *
            pi /
            180;


        const th3 =
            t3 *
            pi /
            180;


        const th4 =
            t4 *
            pi /
            180;


        const th5 =
            t5 *
            pi /
            180;


        /*
        BASIC:

        dvx(1) = l1 * COS(th1)
        dvy(1) = l1 * SIN(th1)

        ...

        dvx(5) = l2 * COS(th5)
        dvy(5) = l2 * SIN(th5)
        */

        this.dvx[0] =
            l1 *
            Math.cos(th1);

        this.dvy[0] =
            l1 *
            Math.sin(th1);


        this.dvx[1] =
            l1 *
            Math.cos(th2);

        this.dvy[1] =
            l1 *
            Math.sin(th2);


        this.dvx[2] =
            l1 *
            Math.cos(th3);

        this.dvy[2] =
            l1 *
            Math.sin(th3);


        this.dvx[3] =
            l1 *
            Math.cos(th4);

        this.dvy[3] =
            l1 *
            Math.sin(th4);


        this.dvx[4] =
            l2 *
            Math.cos(th5);

        this.dvy[4] =
            l2 *
            Math.sin(th5);


        /*
        BASIC nested loops exactly.
        */

        for (
            let i = 0;
            i <= 1;
            i++
        ) {

            for (
                let j = 0;
                j <= 1;
                j++
            ) {

                for (
                    let k = 0;
                    k <= 1;
                    k++
                ) {

                    for (
                        let l = 0;
                        l <= 1;
                        l++
                    ) {

                        for (
                            let m = 0;
                            m <= 1;
                            m++
                        ) {

                            /*
                            BASIC:

                            n =
                                16*i +
                                8*j +
                                4*k +
                                2*l +
                                m + 1

                            JS subtracts 1.
                            */

                            const n =

                                16 * i +

                                8 * j +

                                4 * k +

                                2 * l +

                                m;


                            this.vx[n] =

                                this.vx[0] +

                                m *
                                this.dvx[0] +

                                l *
                                this.dvx[1] +

                                k *
                                this.dvx[2] +

                                j *
                                this.dvx[3] +

                                i *
                                this.dvx[4];


                            this.vy[n] =

                                this.vy[0] +

                                m *
                                this.dvy[0] +

                                l *
                                this.dvy[1] +

                                k *
                                this.dvy[2] +

                                j *
                                this.dvy[3] +

                                i *
                                this.dvy[4];

                        }

                    }

                }

            }

        }


        /*
        BASIC:

        ivert = 32
        imax = 5
        */

        this.ivert = 32;

        this.imax = 5;

        this.dimension = 5;

    }



    // BASIC LABEL 4
    // 6D HYPERCUBE

    build6D(option) {

        const pi =
            3.141592654;


        let l1;

        let l2;

        let l3;


        let t1;

        let t2;

        let t3;

        let t4;

        let t5;

        let t6;



        // OPTION 41


        if (
            option === 41
        ) {

            /*
            BASIC:

            l1 = 22
            l2 = l1
            l3 = l1

            vx(1) = 60
            vy(1) = 15

            t1 = 0
            t2 = 30
            t3 = 60
            t4 = 90
            t5 = 120
            t6 = 150
            */

            l1 = 22;

            l2 = l1;

            l3 = l1;


            this.vx[0] = 60;

            this.vy[0] = 15;


            t1 = 0;

            t2 = 30;

            t3 = 60;

            t4 = 90;

            t5 = 120;

            t6 = 150;

        }



            // OPTION 42


        else {

            /*
            BASIC:

            l1 = 14
            l2 = 40
            l3 = 120

            vx(1) = 40
            vy(1) = 13

            t1 = 0
            t2 = 90
            t3 = 45
            t4 = 135
            t5 = 15
            t6 = 97
            */

            l1 = 14;

            l2 = 40;

            l3 = 120;


            this.vx[0] = 40;

            this.vy[0] = 13;


            t1 = 0;

            t2 = 90;

            t3 = 45;

            t4 = 135;

            t5 = 15;

            t6 = 97;

        }





        const th1 =
            t1 *
            pi /
            180;


        const th2 =
            t2 *
            pi /
            180;


        const th3 =
            t3 *
            pi /
            180;


        const th4 =
            t4 *
            pi /
            180;


        const th5 =
            t5 *
            pi /
            180;


        const th6 =
            t6 *
            pi /
            180;


        this.dvx[0] =
            l1 *
            Math.cos(th1);

        this.dvy[0] =
            l1 *
            Math.sin(th1);


        this.dvx[1] =
            l1 *
            Math.cos(th2);

        this.dvy[1] =
            l1 *
            Math.sin(th2);


        this.dvx[2] =
            l1 *
            Math.cos(th3);

        this.dvy[2] =
            l1 *
            Math.sin(th3);


        this.dvx[3] =
            l1 *
            Math.cos(th4);

        this.dvy[3] =
            l1 *
            Math.sin(th4);


        this.dvx[4] =
            l2 *
            Math.cos(th5);

        this.dvy[4] =
            l2 *
            Math.sin(th5);


        this.dvx[5] =
            l2 *
            Math.cos(th6);

        this.dvy[5] =
            l2 *
            Math.sin(th6);


        /*
        BASIC nested loops exactly.
        */

        for (
            let i = 0;
            i <= 1;
            i++
        ) {

            for (
                let j = 0;
                j <= 1;
                j++
            ) {

                for (
                    let k = 0;
                    k <= 1;
                    k++
                ) {

                    for (
                        let l = 0;
                        l <= 1;
                        l++
                    ) {

                        for (
                            let m = 0;
                            m <= 1;
                            m++
                        ) {

                            for (
                                let mp = 0;
                                mp <= 1;
                                mp++
                            ) {

                                /*
                                BASIC:

                                n =
                                    32*i +
                                    16*j +
                                    8*k +
                                    4*l +
                                    2*m +
                                    mp + 1
                                */

                                const n =

                                    32 * i +

                                    16 * j +

                                    8 * k +

                                    4 * l +

                                    2 * m +

                                    mp;


                                this.vx[n] =

                                    this.vx[0] +

                                    mp *
                                    this.dvx[0] +

                                    m *
                                    this.dvx[1] +

                                    l *
                                    this.dvx[2] +

                                    k *
                                    this.dvx[3] +

                                    j *
                                    this.dvx[4] +

                                    i *
                                    this.dvx[5];


                                this.vy[n] =

                                    this.vy[0] +

                                    mp *
                                    this.dvy[0] +

                                    m *
                                    this.dvy[1] +

                                    l *
                                    this.dvy[2] +

                                    k *
                                    this.dvy[3] +

                                    j *
                                    this.dvy[4] +

                                    i *
                                    this.dvy[5];

                            }

                        }

                    }

                }

            }

        }


        /*
        BASIC:

        ivert = 64
        imax = 6
        */

        this.ivert = 64;

        this.imax = 6;

        this.dimension = 6;


        /*
        Prevent unused-variable warning while still
        preserving l3 from the BASIC translation.
        */

        void l3;

    }



    // PLAY

    play() {

        /*
        BASIC restart means construction starts again.

        If already finished, Play restarts.
        */

        if (
            this.finished
        ) {

            this.reset();

        }


        this.playing = true;

    }



    // PAUSE

    pause() {

        this.playing = false;

    }



    // RESET

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

    }



    // SPEED

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

    }



    // OPTIONS

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

    }



    // BASIC SUB 100
    // GET LIFTING LINES

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

    }



    // BASIC SUB 110

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

    }



    // BASIC SUB 120

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

    }



    // ADD EDGE WITHOUT DUPLICATING

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

    }



    // FINISH CURRENT LIFT

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

    }



    // UPDATE ANIMATION

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



    // RESIZE

    resize() {

        const rect =

            this.canvas
                .getBoundingClientRect();


        const ratio =

            Math.min(

                window.devicePixelRatio || 1,

                2

            );


        this.canvas.width =

            Math.max(

                1,

                Math.floor(
                    rect.width *
                    ratio
                )

            );


        this.canvas.height =

            Math.max(

                1,

                Math.floor(
                    rect.height *
                    ratio
                )

            );


        this.ctx.setTransform(

            ratio,

            0,

            0,

            ratio,

            0,

            0

        );

    }





    getBasicColor(number) {



        switch (
            number
            ) {

            case 1:

                return "#0000aa";


            case 3:

                return "#00aaaa";


            case 4:

                return "#aa0000";


            case 14:

                return "#ffff55";


            case 15:

                return "#ffffff";


            default:

                return "#aa0000";

        }

    }



    // QBasic WINDOW to CANVAS

    toCanvas(x, y) {

        const rect =

            this.canvas
                .getBoundingClientRect();


        const width =
            rect.width;


        const height =
            rect.height;


        /*
        Keep the entire BASIC WINDOW visible.
        */

        const margin =
            20;


        const usableWidth =

            Math.max(
                1,
                width -
                margin * 2
            );


        const usableHeight =

            Math.max(
                1,
                height -
                margin * 2
            );


        const scale =

            Math.min(

                usableWidth /
                this.logicalWidth,

                usableHeight /
                this.logicalHeight

            );


        const actualWidth =

            this.logicalWidth *
            scale;


        const actualHeight =

            this.logicalHeight *
            scale;


        const offsetX =

            (
                width -
                actualWidth
            ) /
            2;


        const offsetY =

            (
                height -
                actualHeight
            ) /
            2;




        return {

            x:

                offsetX +
                x *
                scale,


            y:

                offsetY +
                actualHeight -
                y *
                scale

        };

    }



    // DRAW BASIC LINE

    drawLine(
        x1,
        y1,
        x2,
        y2
    ) {

        if (
            !this.showPath
        ) {

            return;

        }


        const p1 =

            this.toCanvas(
                x1,
                y1
            );


        const p2 =

            this.toCanvas(
                x2,
                y2
            );


        const ctx =
            this.ctx;


        ctx.beginPath();


        ctx.moveTo(

            p1.x,

            p1.y

        );


        ctx.lineTo(

            p2.x,

            p2.y

        );




        ctx.strokeStyle =
            "#a6192e";


        ctx.lineWidth =
            1.7;


        ctx.lineCap =
            "round";


        ctx.stroke();

    }



    // DRAW BASIC VERTEX

    drawVertex(index) {

        if (
            !this.showVertices
        ) {

            return;

        }


        const point =

            this.toCanvas(

                this.vx[index],

                this.vy[index]

            );


        /*
        BASIC:

        IF imax < 5 THEN r0 = 1!

        IF imax = 5 THEN r0 = .8

        IF imax = 6 THEN r0 = .5
        */

        let r0;


        if (
            this.imax < 5
        ) {

            r0 = 1;

        }

        else if (
            this.imax === 5
        ) {

            r0 = 0.8;

        }

        else {

            r0 = 0.5;

        }


        /*
        Convert logical radius to visible browser pixels.

        Keep relative BASIC sizes:
            1
            .8
            .5
        */

        const radius =

            Math.max(

                2.2,

                r0 *
                4

            );


        const ctx =
            this.ctx;


        /*
        BASIC:

            nb = 15

            CIRCLE (...), r0, nb
        */

        ctx.beginPath();


        ctx.arc(

            point.x,

            point.y,

            radius,

            0,

            Math.PI * 2

        );


        /*
        BASIC:

            PAINT ..., ncl(j), nb
        */

        ctx.fillStyle =

            this.getBasicColor(
                this.ncl[index]
            );


        ctx.fill();


        ctx.strokeStyle =

            this.getBasicColor(15);


        ctx.lineWidth =
            1.3;


        ctx.stroke();

    }



    // DRAW COMPLETED LIFT EDGES

    drawCompletedLiftEdges() {

        for (
            const [a, b]
            of this.completedLiftEdges
            ) {

            this.drawLine(

                this.vx[a],

                this.vy[a],

                this.vx[b],

                this.vy[b]

            );

        }

    }



    // DRAW SUB 120 EDGES

    drawCompletedCopyEdges() {

        for (
            const [a, b]
            of this.completedCopyEdges
            ) {

            this.drawLine(

                this.vx[a],

                this.vy[a],

                this.vx[b],

                this.vy[b]

            );

        }

    }



    // DRAW ACTIVE SUB 100 / SUB 60

    drawActiveLift() {

        if (
            this.stage !== "lift"
        ) {

            return;

        }


        const edges =
            this.getCurrentLiftEdges();


        /*
        SUB 60 draws all n lifting lines simultaneously.

        FOR ii = 1 TO nc3

            FOR jj = 1 TO n

                draw a tiny piece of every line

            NEXT

        NEXT

        Therefore every lifting line advances together.
        */

        for (
            const [a, b]
            of edges
            ) {

            const xi =
                this.vx[a];


            const yi =
                this.vy[a];


            const xf =
                this.vx[b];


            const yf =
                this.vy[b];


            const currentX =

                xi +

                (
                    xf -
                    xi
                ) *

                this.liftProgress;


            const currentY =

                yi +

                (
                    yf -
                    yi
                ) *

                this.liftProgress;


            this.drawLine(

                xi,

                yi,

                currentX,

                currentY

            );

        }

    }



    // DRAW

    draw() {

        const rect =

            this.canvas
                .getBoundingClientRect();


        const width =
            rect.width;


        const height =
            rect.height;


        const ctx =
            this.ctx;



        // CLEAR


        ctx.clearRect(

            0,

            0,

            width,

            height

        );


        /*
        Original SCREEN 12 background was black.

        If want the website's white canvas instead
        change this to "#ffffff".
        */

        ctx.fillStyle =
            "#000000";


        ctx.fillRect(

            0,

            0,

            width,

            height

        );



        // DRAW LINES ALREADY CREATED BY EARLIER DIMENSIONS


        this.drawCompletedLiftEdges();


        this.drawCompletedCopyEdges();



        // DRAW CURRENT SLOW SUB 60 LINES


        this.drawActiveLift();



        // DRAW VISIBLE VERTICES


        for (
            let i = 0;
            i < this.visibleVertexCount;
            i++
        ) {

            this.drawVertex(i);

        }



        // FINAL BASIC TEXT


        if (
            this.finished
        ) {

            ctx.fillStyle =
                "#ffffff";


            ctx.font =
                "16px monospace";


            ctx.textAlign =
                "center";


            /*
            BASIC:

            LOCATE 28, 20

            PRINT
            "THE HYPERCUBE, D ="; imax
            */

            ctx.fillText(

                `THE HYPERCUBE, D = ${this.imax}`,

                width / 2,

                height - 20

            );


            ctx.textAlign =
                "left";

        }

    }



    // MAIN LOOP

    loop(now) {

        const delta =

            Math.min(

                50,

                now -
                this.lastTime

            );


        this.lastTime =
            now;


        this.update(
            delta
        );


        this.draw();


        requestAnimationFrame(
            this.loop
        );

    }



    // RETURN VERTICES

    getVertexData() {

        const data = [];


        for (
            let i = 0;
            i < this.ivert;
            i++
        ) {

            data.push({

                index:
                    i + 1,

                x:
                    this.vx[i],

                y:
                    this.vy[i]

            });

        }


        return data;

    }



    // BASIC OUTPUT VERTICES TO FILE

    downloadVertices() {

        /*
        BASIC:

        IF nch = 1 THEN
            OPEN "cube3v.txt"

        ELSEIF nch = 2 THEN
            OPEN "cube4v.txt"

        ELSEIF nch > 30 AND nch < 35 THEN
            OPEN "cube5v.txt"

        ELSEIF nch = 41 OR nch = 42 THEN
            OPEN "cube6v.txt"
        */


        let filename;

        let heading;


        if (
            this.option === 1
        ) {

            filename =
                "cube3v.txt";


            heading =
                "Below are the vertices x y of the cube:";

        }


        else if (
            this.option === 2
        ) {

            filename =
                "cube4v.txt";


            heading =
                "Below are the vertices x y of the tesseract:";

        }


        else if (
            this.option === 31 ||
            this.option === 32 ||
            this.option === 33
        ) {

            filename =
                "cube5v.txt";


            heading =
                "Below are the vertices x y of the 5-d cube:";

        }


        else {

            filename =
                "cube6v.txt";


            heading =
                "Below are the vertices x y of the 6-d cube:";

        }


        const lines = [

            heading

        ];


        /*
        BASIC:

        FOR i = 1 TO ivert

            PRINT #10, vx(i), vy(i)

        NEXT
        */

        for (
            let i = 0;
            i < this.ivert;
            i++
        ) {

            lines.push(

                `${this.vx[i]}\t${this.vy[i]}`

            );

        }


        const text =
            lines.join("\n");


        const blob =

            new Blob(

                [text],

                {
                    type:
                        "text/plain"
                }

            );


        const url =

            URL.createObjectURL(
                blob
            );


        const link =

            document.createElement(
                "a"
            );


        link.href =
            url;


        link.download =
            filename;


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();


        URL.revokeObjectURL(
            url
        );

    }



    // GET EXACT LIST OF FIGURES

    getAvailableFigures() {

        /*
        EXACTLY the menu printed by the BASIC file.

        Nothing more.
        */

        return [

            {
                option: 1,
                dimension: 3,
                name: "CUBE (IN 3-D)"
            },

            {
                option: 2,
                dimension: 4,
                name: "TESSERACT OR 4-D CUBE"
            },

            {
                option: 31,
                dimension: 5,
                name: "5-D HYPERCUBE (ISOMETRIC PROJECTION)"
            },

            {
                option: 32,
                dimension: 5,
                name: "5-D HYPERCUBE (TESSERACT PROJECTION)"
            },

            {
                option: 33,
                dimension: 5,
                name: "5-D HYPERCUBE (DISTORTED ISOMETRIC PROJECTION)"
            },

            {
                option: 41,
                dimension: 6,
                name: "6-D HYPERCUBE (ISOMETRIC PROJECTION)"
            },

            {
                option: 42,
                dimension: 6,
                name: "6-D HYPERCUBE (TESSERACT PROJECTION)"
            }

        ];

    }



    // CLEANUP

    destroy() {

        this.playing = false;


        if (
            this.resizeObserver
        ) {

            this.resizeObserver.disconnect();

        }

    }

}




// MAKE AVAILABLE TO app.js


window.HypercubeRenderer =
    QBasicHypercubeRenderer;
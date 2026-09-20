export const figure_buildersMethods = {

    setOption(option) {

        option =
            Number(option);


        const allowed = [

            1,
            101,

            2,
            102,

            31,
            32,
            33,
            130,

            41,
            42,
            140

        ];


        if (
            !allowed.includes(option)
        ) {

            console.warn(
                "This option does not exist."
            );

            return;

        }


        this.option =
            option;


        this.autoRotate = [

            101,
            102,
            130,
            140

        ].includes(option);


        if (
            this.autoRotate
        ) {

            if (
                option === 101
            ) {

                this.rotationDimension = 3;

            }

            else if (
                option === 102
            ) {

                this.rotationDimension = 4;

            }

            else if (
                option === 130
            ) {

                this.rotationDimension = 5;

            }

            else if (
                option === 140
            ) {

                this.rotationDimension = 6;

            }


            this.buildRotationHypercube(
                this.rotationDimension
            );


            this.reset();

            return;

        }


        this.buildFigure(
            option
        );


        this.reset();

    },

    setProjection(option) {

        this.setOption(option);

    },

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

    },

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

    },

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

    },

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

    },

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

};

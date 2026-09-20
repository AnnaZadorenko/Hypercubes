export const rotationMethods = {

    buildRotationHypercube(dimension) {

        this.rotationDimension = dimension;

        this.dimension = dimension;

        this.imax = dimension;

        this.ivert = 2 ** dimension;

        this.rotationVertices = [];

        this.rotationEdges = [];


        for (
            let i = 0;
            i < this.ivert;
            i++
        ) {

            const vertex = [];


            for (
                let d = 0;
                d < dimension;
                d++
            ) {

                vertex.push(
                    (i & (1 << d))
                        ? 1
                        : -1
                );

            }


            this.rotationVertices.push(
                vertex
            );

        }


        for (
            let i = 0;
            i < this.ivert;
            i++
        ) {

            for (
                let d = 0;
                d < dimension;
                d++
            ) {

                const other =
                    i ^ (1 << d);


                if (
                    i < other
                ) {

                    this.rotationEdges.push(
                        [
                            i,
                            other
                        ]
                    );

                }

            }

        }

    },

    rotatePlane(
        point,
        a,
        b,
        angle
    ) {

        const x =
            point[a];

        const y =
            point[b];


        const cos =
            Math.cos(angle);

        const sin =
            Math.sin(angle);


        point[a] =
            x * cos -
            y * sin;


        point[b] =
            x * sin +
            y * cos;

    },

    getRotatedPoint(vertex) {

        const point =
            vertex.slice();


        const angle =
            this.rotationAngle;


        if (
            point.length >= 3
        ) {

            this.rotatePlane(
                point,
                0,
                1,
                angle * 0.63
            );

            this.rotatePlane(
                point,
                0,
                2,
                angle * 0.41
            );

            this.rotatePlane(
                point,
                1,
                2,
                angle * 0.27
            );

        }


        if (
            point.length >= 4
        ) {

            this.rotatePlane(
                point,
                0,
                3,
                angle * 0.37
            );

            this.rotatePlane(
                point,
                1,
                3,
                angle * 0.29
            );

            this.rotatePlane(
                point,
                2,
                3,
                angle * 0.21
            );

        }


        if (
            point.length >= 5
        ) {

            this.rotatePlane(
                point,
                0,
                4,
                angle * 0.31
            );

            this.rotatePlane(
                point,
                1,
                4,
                angle * 0.23
            );

            this.rotatePlane(
                point,
                2,
                4,
                angle * 0.19
            );

            this.rotatePlane(
                point,
                3,
                4,
                angle * 0.17
            );

        }


        if (
            point.length >= 6
        ) {

            this.rotatePlane(
                point,
                0,
                5,
                angle * 0.26
            );

            this.rotatePlane(
                point,
                1,
                5,
                angle * 0.20
            );

            this.rotatePlane(
                point,
                2,
                5,
                angle * 0.16
            );

            this.rotatePlane(
                point,
                3,
                5,
                angle * 0.13
            );

            this.rotatePlane(
                point,
                4,
                5,
                angle * 0.11
            );

        }


        return point;

    },

    projectRotationPoint(vertex) {

        let point =
            this.getRotatedPoint(
                vertex
            );


        while (
            point.length > 3
            ) {

            const w =
                point[
                point.length - 1
                    ];


            const distance =
                8;


            const scale =
                distance /
                (distance - w);


            point =
                point
                    .slice(
                        0,
                        point.length - 1
                    )
                    .map(
                        value =>
                            value * scale
                    );

        }


        const x =
            point[0];

        const y =
            point[1];

        const z =
            point[2] || 0;


        const rect =
            this.canvas
                .getBoundingClientRect();


        const cameraDistance =
            12;


        const perspective =
            cameraDistance /
            (cameraDistance - z);


        let size =
            Math.min(
                rect.width,
                rect.height
            );


        if (
            this.rotationDimension === 3
        ) {

            size *= 0.22;

        }

        else if (
            this.rotationDimension === 4
        ) {

            size *= 0.19;

        }

        else if (
            this.rotationDimension === 5
        ) {

            size *= 0.20;

        }

        else {

            size *= 0.16;

        }


        return {

            x:
                rect.width / 2 +
                x *
                perspective *
                size,

            y:
                rect.height / 2 -
                y *
                perspective *
                size

        };

    },

    drawRotationHypercube() {

        const ctx =
            this.ctx;


        const points =
            this.rotationVertices.map(
                vertex =>
                    this.projectRotationPoint(
                        vertex
                    )
            );


        if (
            this.showPath
        ) {

            for (
                const [a, b]
                of this.rotationEdges
                ) {

                const p1 =
                    points[a];

                const p2 =
                    points[b];


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

        }


        if (
            this.showVertices
        ) {

            for (
                let i = 0;
                i < points.length;
                i++
            ) {

                const point =
                    points[i];


                let radius =
                    4;


                if (
                    this.rotationDimension === 5
                ) {

                    radius = 3.2;

                }


                if (
                    this.rotationDimension === 6
                ) {

                    radius = 2.7;

                }


                ctx.beginPath();


                ctx.arc(
                    point.x,
                    point.y,
                    radius,
                    0,
                    Math.PI * 2
                );


                ctx.fillStyle =
                    "#ffffff";


                ctx.fill();


                ctx.strokeStyle =
                    "#a6192e";


                ctx.lineWidth =
                    1.5;


                ctx.stroke();

            }

        }

    }

};

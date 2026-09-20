export const drawingMethods = {

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

    },

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

    },

    toCanvas(x, y) {

        const rect =
            this.canvas
                .getBoundingClientRect();


        const width =
            rect.width;


        const height =
            rect.height;


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

    },

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

    },

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

    },

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

    },

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

    },

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

    },

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
            "#ffffff";


        ctx.fillRect(

            0,

            0,

            width,

            height

        );

        if (
            this.autoRotate
        ) {

            this.drawRotationHypercube();

            return;

        }

        // DRAW LINES ALREADY CREATED BY EARLIER DIMENSIONS


        this.drawCompletedLiftEdges();


        this.drawCompletedCopyEdges();



        // DRAW CURRENT SLOW SUB 60 LINES


        if (
            !this.autoRotate
        ) {

            this.drawActiveLift();

        }



        // DRAW VISIBLE VERTICES


        for (
            let i = 0;
            i < this.visibleVertexCount;
            i++
        ) {

            this.drawVertex(i);

        }
        if (
            this.autoRotate &&
            this.playing
        ) {

            this.rotationAngle +=

                delta *
                0.0006 *
                this.speed;

        }

        // FINAL BASIC TEXT


        if (
            this.finished &&
            !this.autoRotate
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

    },

    loop(now) {

        const delta =

            Math.min(

                50,

                now -
                this.lastTime

            );


        this.lastTime =
            now;


        if (
            this.autoRotate &&
            this.playing
        ) {

            this.rotationAngle +=

                delta *
                0.0005 *
                this.speed;

        }


        this.update(
            delta
        );


        this.draw();


        requestAnimationFrame(
            this.loop
        );

    }

};

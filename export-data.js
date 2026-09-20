export const export_dataMethods = {

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

    },

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
            this.dimension === 3
        ) {

            filename =
                "cube3v.txt";


            heading =
                "Below are the vertices x y of the cube:";

        }


        else if (
            this.dimension === 4
        ) {

            filename =
                "cube4v.txt";


            heading =
                "Below are the vertices x y of the tesseract:";

        }


        else if (
            this.dimension === 5
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

    },

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
                option: 101,
                dimension: 3,
                name: "CUBE (IN 3-D) ROTATE"
            },

            {
                option: 2,
                dimension: 4,
                name: "TESSERACT OR 4-D CUBE"
            },

            {
                option: 102,
                dimension: 4,
                name: "TESSERACT OR 4-D CUBE ROTATE"
            },

            {
                option: 31,
                dimension: 5,
                name: "5-D HYPERCUBE (ISOMETRIC PROJECTION)"
            },

            {
                option: 131,
                dimension: 5,
                name: "5-D HYPERCUBE (ISOMETRIC PROJECTION) ROTATE"
            },

            {
                option: 32,
                dimension: 5,
                name: "5-D HYPERCUBE (TESSERACT PROJECTION)"
            },

            {
                option: 130,
                dimension: 5,
                name: "5-D HYPERCUBE ROTATE"
            },

            {
                option: 41,
                dimension: 6,
                name: "6-D HYPERCUBE (ISOMETRIC PROJECTION)"
            },

            {
                option: 141,
                dimension: 6,
                name: "6-D HYPERCUBE (ISOMETRIC PROJECTION) ROTATE"
            },

            {
                option: 140,
                dimension: 6,
                name: "6-D HYPERCUBE ROTATE"
            }

        ];

    },

    destroy() {

        this.playing = false;


        if (
            this.resizeObserver
        ) {

            this.resizeObserver.disconnect();

        }

    }

};

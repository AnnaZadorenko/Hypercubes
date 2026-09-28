function formatText(text) {

    const superscripts = {
        "0": "⁰",
        "1": "¹",
        "2": "²",
        "3": "³",
        "4": "⁴",
        "5": "⁵",
        "6": "⁶",
        "7": "⁷",
        "8": "⁸",
        "9": "⁹",
        "n": "ⁿ",
        "+": "⁺",
        "-": "⁻"
    };

    text = text.replace(
        /\^\{([^}]+)\}/g,
        (match, exponent) => {
            return exponent
                .split("")
                .map(char => superscripts[char] || char)
                .join("");
        }
    );

    text = text.replace(/ x /g, " × ");
    text = text.replace(/-->/g, "→");

    return text;
}


// --------------------------------------------------
// ESCAPE HTML
// --------------------------------------------------

function escapeHTML(text) {

    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}


// --------------------------------------------------
// SIMPLE TXT FORMATTING
// --------------------------------------------------

function formatSectionHTML(text) {

    text = formatText(text);
    text = escapeHTML(text);


    // --------------------------------------------------
    // TABLES
    // --------------------------------------------------

    text = text.replace(
        /\[TABLE\]([\s\S]*?)\[\/TABLE\]/g,
        (match, tableContent) => {

            const rows = tableContent
                .trim()
                .split(/\r?\n/)
                .filter(row => row.trim() !== "");

            let html = '<div class="dcube-table-wrap">';
            html += '<table class="dcube-table">';

            rows.forEach((row, rowIndex) => {

                const cells = row
                    .split("|")
                    .map(cell => cell.trim());

                html += "<tr>";

                cells.forEach(cell => {

                    if (rowIndex === 0) {

                        html += `<th>${cell}</th>`;

                    } else {

                        html += `<td>${cell}</td>`;
                    }

                });

                html += "</tr>";
            });

            html += "</table>";
            html += "</div>";

            return html;
        }
    );


    // --------------------------------------------------
    // CENTERED HEADING
    // # References
    // # The elements of a d-cube
    // --------------------------------------------------

    text = text.replace(
        /^# (.+)$/gm,
        '<div class="text-page-heading">$1</div>'
    );


    // --------------------------------------------------
    // BOLD
    // **text**
    // --------------------------------------------------

    text = text.replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>"
    );


    // --------------------------------------------------
    // ITALIC
    // *text*
    // --------------------------------------------------

    text = text.replace(
        /\*(.*?)\*/g,
        "<em>$1</em>"
    );


    // --------------------------------------------------
    // PARAGRAPHS / LINE BREAKS
    // --------------------------------------------------

    const blocks = text.split(/\n\s*\n/);

    text = blocks
        .map(block => {

            const trimmed = block.trim();

            if (!trimmed) {
                return "";
            }

            // Do not wrap generated HTML blocks in <p>
            if (
                trimmed.startsWith('<div class="text-page-heading">') ||
                trimmed.startsWith('<div class="dcube-table-wrap">')
            ) {
                return trimmed;
            }

            return `<p>${trimmed.replace(/\r?\n/g, "<br>")}</p>`;
        })
        .join("");


    return text;
}


// --------------------------------------------------
// FIGURE TEXT
// --------------------------------------------------

export async function loadFigureText(
    filename,
    infoText,
    pageTitle,
    infoTitle
) {

    try {

        const response = await fetch(
            `content/${filename}`
        );

        if (!response.ok) {

            throw new Error(
                `Could not load content/${filename}`
            );
        }


        const text = await response.text();

        const lines = text.split(/\r?\n/);


        const mainHeadingLine = lines.find(line =>
            line
                .trim()
                .startsWith("Main heading =")
        );


        const aboutHeadingLine = lines.find(line =>
            line
                .trim()
                .startsWith("About heading =")
        );


        if (mainHeadingLine) {

            pageTitle.textContent =
                mainHeadingLine
                    .split("=")
                    .slice(1)
                    .join("=")
                    .trim();
        }


        if (aboutHeadingLine) {

            infoTitle.textContent =
                aboutHeadingLine
                    .split("=")
                    .slice(1)
                    .join("=")
                    .trim();
        }


        const description = lines
            .filter(line =>
                !line
                    .trim()
                    .startsWith("Main heading =") &&

                !line
                    .trim()
                    .startsWith("About heading =")
            )
            .join("\n")
            .trim();


        infoText.textContent =
            formatText(description);

    }

    catch (error) {

        infoText.textContent =
            "Information is unavailable.";

        console.error(error);
    }
}


// --------------------------------------------------
// PROJECT SECTION TEXT
// --------------------------------------------------

export async function loadSectionText(
    section,
    infoText
) {

    if (section.contentFile) {

        try {

            const response = await fetch(
                `content/${section.contentFile}`
            );


            if (!response.ok) {

                throw new Error(
                    `Could not load content/${section.contentFile}`
                );
            }


            const text = await response.text();


            infoText.innerHTML =
                formatSectionHTML(text);


            // References styling

            if (
                section.contentFile ===
                "references.txt"
            ) {

                infoText.classList.add(
                    "references-text"
                );

            } else {

                infoText.classList.remove(
                    "references-text"
                );
            }


            // D-cube styling

            if (
                section.contentFile ===
                "more-about-d-cube.txt"
            ) {

                infoText.classList.add(
                    "dcube-text"
                );

            } else {

                infoText.classList.remove(
                    "dcube-text"
                );
            }

        }

        catch (error) {

            infoText.textContent =
                "Information is unavailable.";

            console.error(error);
        }

    }

    else {

        infoText.innerHTML =
            formatSectionHTML(
                section.body || ""
            );
    }
}
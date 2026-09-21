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

    return text;
}


export async function loadFigureText(filename, infoText) {

    try {

        const response = await fetch(`content/${filename}`);

        if (!response.ok) {
            throw new Error(`Could not load content/${filename}`);
        }

        const text = await response.text();

        infoText.textContent = formatText(text);

    } catch (error) {

        infoText.textContent = "Information is unavailable.";

        console.error(error);
    }
}


export async function loadSectionText(section, infoText) {

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

            infoText.textContent = formatText(text);

        } catch (error) {

            infoText.textContent = "Information is unavailable.";

            console.error(error);
        }

    } else {

        infoText.textContent = formatText(section.body);
    }
}
export async function loadFigureText(filename, infoText) {
    try {
        const response = await fetch(`content/${filename}`);

        if (!response.ok) {
            throw new Error(`Could not load content/${filename}`);
        }

        const text = await response.text();
        infoText.textContent = text;
    } catch (error) {
        infoText.textContent = "Information is unavailable.";
        console.error(error);
    }
}

export async function loadSectionText(section, infoText) {
    if (section.contentFile) {
        try {
            const response = await fetch(`content/${section.contentFile}`);

            if (!response.ok) {
                throw new Error(`Could not load content/${section.contentFile}`);
            }

            const text = await response.text();
            infoText.textContent = text;
        } catch (error) {
            infoText.textContent = "Information is unavailable.";
            console.error(error);
        }
    } else {
        infoText.textContent = section.body;
    }
}

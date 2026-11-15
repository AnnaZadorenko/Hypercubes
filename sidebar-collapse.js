
document.addEventListener("DOMContentLoaded", () => {

    const appShell = document.querySelector(".app-shell");
    const toggle = document.getElementById("sidebarCollapseButton");
    const icon = toggle?.querySelector("span");
    const sidebar = document.getElementById("mainSidebar");

    if (!appShell || !toggle || !icon || !sidebar) {
        return;
    }

    const icons = {
        "1": "3D",
        "101": "3D",
        "2": "4D",
        "102": "4D",
        "31": "5D",
        "130": "5D",
        "41": "6D",
        "140": "6D",
        "203": "HC"
    };

    const sectionIcons = {
        about: "☷",
        instructions: "☷",
        more: "☷",
        references: "☷",
        credits: "☷"
    };

    sidebar.querySelectorAll(".nav-item").forEach(button => {

        const originalName = button.textContent.trim();

        let symbol = "•";

        if (button.dataset.kiss) {
            symbol = "HD";
        } else if (button.dataset.section) {
            symbol = sectionIcons[button.dataset.section] || "•";
        } else if (button.dataset.option) {
            symbol = icons[button.dataset.option] || "•";
        }

        const iconElement = document.createElement("span");
        iconElement.className = "sidebar-nav-icon";
        iconElement.textContent = symbol;
        iconElement.setAttribute("aria-hidden", "true");

        const nameElement = document.createElement("span");
        nameElement.className = "sidebar-nav-text";
        nameElement.textContent = originalName;

        button.replaceChildren(iconElement, nameElement);

        button.title = originalName;
        button.setAttribute("aria-label", originalName);
    });

    toggle.addEventListener("click", () => {

        const collapsed = appShell.classList.toggle(
            "sidebar-collapsed"
        );

        icon.textContent = collapsed ? "›" : "‹";

        toggle.setAttribute(
            "aria-expanded",
            String(!collapsed)
        );

        toggle.setAttribute(
            "aria-label",
            collapsed ? "Expand sidebar" : "Collapse sidebar"
        );

        toggle.title = collapsed
            ? "Expand sidebar"
            : "Collapse sidebar";

        window.dispatchEvent(new Event("resize"));

        setTimeout(() => {
            window.dispatchEvent(new Event("resize"));
        }, 300);
    });

});

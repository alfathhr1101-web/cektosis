export function initDarkMode() {

    const themeToggle =
        document.getElementById("themeToggle");

    if (!themeToggle) return;

    if (localStorage.getItem("theme") === "dark") {

        document.body.classList.add("dark");

        themeToggle.innerHTML = "☀️";

    }

    themeToggle.addEventListener("click", () => {

        document.body.classList.toggle("dark");

        if (document.body.classList.contains("dark")) {

            localStorage.setItem("theme","dark");

            themeToggle.innerHTML = "☀️";

        } else {

            localStorage.setItem("theme","light");

            themeToggle.innerHTML = "🌙";

        }

    });

}
export async function loadPage(page){

    const app =
        document.getElementById("app");

    const response =
        await fetch(`/src/pages/${page}.html`);

    app.innerHTML =
        await response.text();


if (page === "checker") {

    const { initChecker } =
        await import("./checker.js");

    const { initDarkMode } =
        await import("./darkmode.js");

    const { initLoading } =
        await import("./loading.js");

    initChecker();
    initDarkMode();
    initLoading();

}

if (page === "wd") {

    const { initWD } =
        await import("./wd.js");

    initWD();

    const back =
        document.getElementById("backChecker");

    if (back) {

        back.onclick = () => {

            loadPage("checker");

        };

    }

}

}
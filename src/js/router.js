import { initLayout } from "./layout.js";

export async function loadPage(page){

    const app =
        document.getElementById("app");

    const response =
        await fetch(`/pages/${page}.html`);

    app.innerHTML =
        await response.text();

    initLayout();

    if(page==="checker"){

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

    if(page==="wd"){

        const { initWD } =
            await import("./wd.js");

        initWD();

    }

    if(page==="depo"){

        const { initDepo } =
            await import("./depo.js");

        initDepo();

    }

}
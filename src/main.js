import "./css/style.css";

import { loadPage } from "./js/router.js";

async function init(){

    await loadPage("checker");

}

init();
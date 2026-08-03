import "./css/style.css";

import "./js/checker.js";

import { loadPage } from "./js/router.js";

async function init(){

    await loadPage("checker");

}

init();
export function initLoading() {

    const intro =
        document.getElementById("introLoading");

    if (!intro) return;

    setTimeout(() => {

        intro.classList.add("hide");

        setTimeout(() => {

            intro.remove();

        },500);

    },1800);

}
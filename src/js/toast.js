export function showToast() {

    const toast =
        document.getElementById("toast");

    if (!toast) return;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    },2000);

}
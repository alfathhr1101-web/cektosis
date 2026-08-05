export function initLayout(){

    const csvToggle =
        document.getElementById("csvToggle");

    const csvMenu =
        document.getElementById("csvMenu");

    if(!csvToggle || !csvMenu){

        return;

    }

    // ==========================
    // Hapus event lama
    // ==========================

    csvToggle.onclick = null;

    document.onclick = null;

    // ==========================
    // Toggle Menu
    // ==========================

    csvToggle.onclick = (e)=>{

        e.stopPropagation();

        csvMenu.classList.toggle("show");

    };

    // ==========================
    // Klik di luar menu
    // ==========================

    document.onclick = (e)=>{

        if(

            !e.target.closest(".csv-dropdown")

        ){

            csvMenu.classList.remove("show");

        }

    };

}
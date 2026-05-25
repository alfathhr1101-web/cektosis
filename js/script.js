function hitungTO(){

    const input =
        document.getElementById("inputData").value;

    const lines =
        input.split("\n");

    let totalTO = 0;

    let targetTO = 0;

    let saldoBonus = 0;

    let jenisBonus = "-";

    let multiplier = 0;

    let tbody = "";

    // ====================================
    // CEK TRANSAKSI TERBARU
    // ====================================

    for(let line of lines){

        const cols =
            line.split("\t");

        // BONUS MANIAK SLOT
        if(
            line.includes("BONUS MANIAK SLOT")
        ){

            let balance =
                cols[8] || "0";

            balance =
                balance.replace(/,/g, "");

            balance =
                parseFloat(balance);

            if(!isNaN(balance)){

                saldoBonus = balance;

                multiplier = 5;

                targetTO =
                    saldoBonus * multiplier;

                jenisBonus =
                    "MANIAK SLOT";

                break;
            }

        }
        // ====================================
// BONUS LUCKY SPIN
// ====================================

if(

    line.includes("LUCKY SPIN")
    ||
    line.includes("Lucky Spin")

){

    let balance =
        cols[8] || "0";

    balance =
        balance.replace(/,/g, "");

    balance =
        parseFloat(balance);

    if(!isNaN(balance)){

        saldoBonus = balance;

        multiplier = 8;

        targetTO =
            saldoBonus * multiplier;

        jenisBonus =
            "LUCKY SPIN";

        break;
    }

}

        // QRIS
        if(
            line.includes("APPROVED")
            &&
            line.includes("QRIS")
        ){

            let deposit =
                cols[7] || "0";

            deposit =
                deposit.replace(/,/g, "");

            deposit =
                parseFloat(deposit);

            if(
                !isNaN(deposit)
                &&
                deposit > 0
            ){

                saldoBonus = deposit;

                multiplier = 1;

                targetTO =
                    saldoBonus * multiplier;

                jenisBonus =
                    "QRIS";

                break;
            }

        }

        // PULSA
        if(

            line.includes("APPROVED Telkomsel")
            ||
            line.includes("APPROVED Axiata")
            ||
            line.includes("APPROVED XL")
            ||
            line.includes("APPROVED Indosat")

        ){

            let balance =
                cols[8] || "0";

            balance =
                balance.replace(/,/g, "");

            balance =
                parseFloat(balance);

            if(
                !isNaN(balance)
                &&
                balance > 0
            ){

                saldoBonus = balance;

                multiplier = 3;

                targetTO =
                    saldoBonus * multiplier;

                jenisBonus =
                    "PULSA";

                break;
            }

        }

        // DANA = NO TO
        if(
            line.includes("APPROVED DANA")
        ){

            jenisBonus =
                "NO TO";

            saldoBonus = 0;

            targetTO = 0;

            multiplier = 0;

            break;
        }

    }

    // ====================================
    // HITUNG TO
    // ====================================

    lines.forEach(line => {

        if(
            line.includes("Withdraw")
        ){
            return;
        }

        const cols =
            line.split("\t");

        const tanggal =
            cols[1] || "-";

        const game =
            cols[3] || "-";

        const deskripsi =
            cols[5] || "-";
        
        const transaksiID =
            cols[4] || "-";

        let debit =
            cols[6] || "0";

        debit =
            debit.replace(/,/g, "");

        debit =
            parseFloat(debit);

        if(
            isNaN(debit)
            ||
            debit <= 0
        ){
            return;
        }

        // NO TO
        if(
            jenisBonus === "NO TO"
        ){
            return;
        }

        // MANIAK SLOT
        if(

    jenisBonus === "MANIAK SLOT"
    ||
    jenisBonus === "LUCKY SPIN"

){

            if(
                !line.includes("Video Slots")
            ){
                return;
            }

        }

        // QRIS / PULSA
        if(
            jenisBonus === "QRIS"
            ||
            jenisBonus === "PULSA"
        ){

            const isGame =

                line.includes("Slots")
                ||
                line.includes("Live")
                ||
                line.includes("Sports")
                ||
line.includes(
    "Megawin Gaming"
)
                ||
                line.includes("JiLi Gaming");

            if(!isGame){
                return;
            }

        }

        totalTO += debit;

        tbody += `

            <tr>

                <td>${tanggal}</td>

                <td>${game}</td>

                <td>${transaksiID}</td>

                <td>${deskripsi}</td>

                <td>${debit.toLocaleString()}</td>

            </tr>

        `;

    });

    let sisaTO =
        targetTO - totalTO;

    if(sisaTO < 0){
        sisaTO = 0;
    }

    document.getElementById("bonusType")
        .innerText =
        jenisBonus;

    document.getElementById("bonusSaldo")
        .innerText =
        saldoBonus.toLocaleString();

    document.getElementById("targetTO")
        .innerText =
        targetTO.toLocaleString();

    document.getElementById("playedTO")
        .innerText =
        totalTO.toLocaleString();

    document.getElementById("sisaTO")
        .innerText =
        sisaTO.toLocaleString();
// ====================================
// PROGRESS BAR
// ====================================

let percent = 0;

if(targetTO > 0){

    percent =
        (totalTO / targetTO) * 100;

    if(percent > 100){
        percent = 100;
    }

}

percent =
    percent.toFixed(0);

document.getElementById(
    "progressPercent"
).innerText =
    percent + "%";

const progressFill =
    document.getElementById(
        "progressFill"
    );

progressFill.style.width =
    percent + "%";

// warna progress

if(percent < 50){

    progressFill.style.background =
        "#ef4444";

}else if(percent < 90){

    progressFill.style.background =
        "#f59e0b";

}else{

    progressFill.style.background =
        "#22c55e";
}
    document.getElementById("resultBody")
        .innerHTML =
        tbody;

}

window.addEventListener("load", () => {

    setTimeout(() => {

        document
            .getElementById("introLoading")
            .classList.add("hide");

    }, 1800);

});

// ====================================
// COPY HASIL
// ====================================

function copyHasil(){

    const target =
        document.getElementById(
            "targetTO"
        ).innerText;

    const played =
        document.getElementById(
            "playedTO"
        ).innerText;

    const sisa =
        document.getElementById(
            "sisaTO"
        ).innerText;

    const jenis =
    document.getElementById(
        "bonusType"
    ).innerText;

const hasil =

`Jenis TO : ${jenis}
Target TO : ${target}
TO Dimainkan : ${played}
Sisa TO : ${sisa}`;

    navigator.clipboard.writeText(
        hasil
    );
const toast =
    document.getElementById(
        "toast"
    );

toast.classList.add("show");

setTimeout(() => {

    toast.classList.remove(
        "show"
    );

}, 2000);
    

}

// ====================================
// DARK MODE
// ====================================

const themeToggle =
    document.getElementById(
        "themeToggle"
    );

// cek local storage

if(

    localStorage.getItem("theme")
    === "dark"

){

    document.body.classList.add(
        "dark"
    );

    themeToggle.innerHTML = "☀️";
}

// toggle mode

themeToggle.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "dark"
        );

        // cek dark aktif

        if(

            document.body.classList.contains(
                "dark"
            )

        ){

            localStorage.setItem(
                "theme",
                "dark"
            );

            themeToggle.innerHTML =
                "☀️";

        }else{

            localStorage.setItem(
                "theme",
                "light"
            );

            themeToggle.innerHTML =
                "🌙";
        }

    }
);
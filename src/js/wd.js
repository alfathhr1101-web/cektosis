import { loadPage } from "./router.js";

let hasilWD = [];

let currentCS = "ALL";

export function initWD() {

// ==========================
// BUTTON
// ==========================

const parseBtn =
    document.getElementById("parseWD");

const copyBtn =
    document.getElementById("copyWD");

const backBtn =
    document.getElementById("backWD");

    if (parseBtn) {
        parseBtn.onclick = parseHistory;
    }

    if (copyBtn) {
        copyBtn.onclick = copySpreadsheet;
    }

    if(backBtn){

    backBtn.onclick = ()=>{

        loadPage("checker");

    };

}

// ==========================
// FILTER CS
// ==========================

    document.querySelectorAll(".cs-btn").forEach(btn => {

        btn.onclick = () => {

            document.querySelectorAll(".cs-btn").forEach(x => {

                x.classList.remove("active");

            });

            btn.classList.add("active");

            currentCS = btn.dataset.cs;

            renderTable();

        };

    });

} 



async function copySpreadsheet(){

    if(!hasilWD.length){

        showToast("Belum ada data 😅");

        return;

    }

    let hasil = "";

const data = hasilWD.filter(item=>{

    if(currentCS==="ALL"){

        return true;

    }

    return item.cs.toLowerCase()===currentCS.toLowerCase();

});

data.forEach(item=>{

hasil +=
baris(

    item.nama,

    item.nominal,

    item.user

) + "\n";

        // ==================================
        // BIAYA TRANSFER
        // ==================================

        if(

            item.bank !== "BCA"
            &&
            item.bank !== "DANA"

        ){

hasil +=
baris(

    "BIAYA TRANSFER",

    "2,500",

    ""

) + "\n";

        }

    });

    try{

        await navigator.clipboard.writeText(

            hasil

        );

        showToast(

            "✅ Berhasil di Copy Bre 😎"

        );

    }catch(err){

        console.error(err);

        showToast(

            "❌ Gagal Copy"

        );

    }

}

function baris(

    nama,
    nominal,
    user=""

){

    return [

        nama,

        nominal,

        "",

        "",

        user

    ].join("\t");

}

function parseHistory() {

    hasilWD = [];

    const input = document
        .getElementById("wdInput")
        .value
        .replace(/\r/g, "");

    if (!input.trim()) return;

    const lines = input
        .split("\n")
        .map(x => x.trim());

    let i = 0;

    while (i < lines.length) {

        if (!/^\d+\t/.test(lines[i])) {

            i++;

            continue;

        }

        const header =
            lines[i].split("\t");

        const tanggal =
            header[1]
                .split(" ")
                .slice(0,2)
                .join(" ");

        const user =
            header[header.length - 1];

// Ambil semua baris transaksi sampai ketemu nomor berikutnya

const block = [];

i++;

while (

    i < lines.length &&
    !/^\d+\t/.test(lines[i])

){

    if(lines[i] !== ""){

        block.push(lines[i]);

    }

    i++;

}

// Cari data berdasarkan isi

const tujuan =
    block.find(x => x.includes("xxxxx")) || "";

const asal =
    block.find(x => x.includes(" - ") && x !== tujuan) || "";

const nominal =
    block.find(x => /^\d[\d,]*$/.test(x)) || "";

const note =
    block.find(x => x === "---") || "";

const cs =
    block[block.length - 1] || "";

// Pecah bank & nama

const pecah =
    tujuan.split("-");

const bank =
    (pecah[0] || "").trim();

const nama =
    (pecah[pecah.length - 1] || "").trim();

hasilWD.push({

    tanggal,

    user,

    bank,

    nama,

    nominal,

    cs,

    note

});

    }

hasilWD.reverse();

console.log(hasilWD);

renderTable();

}



function renderTable(){

    const tbody =
        document.getElementById("wdResult");

    let html = "";

    let totalNominal = 0;

    const data = hasilWD.filter(item => {

        if(currentCS === "ALL"){

            return true;

        }

        return item.cs.toLowerCase() === currentCS.toLowerCase();

    });


data.forEach(item => {

const nominal = parseInt(
    String(item.nominal)
        .replace(/[^\d]/g, ""),
    10
);

if (!isNaN(nominal)) {

    totalNominal += nominal;

}

        html+=`

        <tr>

            <td>${item.tanggal}</td>

            <td>${item.nama}</td>

            <td>${item.nominal}</td>

            <td></td>

            <td></td>

            <td>${item.user}</td>

            <td>${item.cs}</td>

            <td></td>

        </tr>

        `;

        const bank =
    item.bank
        .trim()
        .toUpperCase();

if (

    bank !== "BCA"
    &&
    bank !== "DANA"

){

            html+=`

            <tr class="biaya">

                <td>${item.tanggal}</td>

                <td>BIAYA TRANSFER</td>

                <td>2,500</td>

                <td></td>

                <td></td>

                <td></td>

                <td></td>

                <td>AUTO</td>

            </tr>

            `;

        }

    });

    tbody.innerHTML=html;

document.getElementById("wdTotal").innerText =
    data.length;

    document.getElementById("wdNominal").innerText=
        totalNominal.toLocaleString();

}

function showToast(text){

    const toast =
        document.getElementById("toast");

    if(!toast) return;

    toast.innerText = text;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },1800);

}
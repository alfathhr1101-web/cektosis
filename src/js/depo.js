import { loadPage } from "./router.js";

let hasilDepo = [];

let currentAdmin = "ALL";

// ===================================
// INIT
// ===================================

export function initDepo(){

    const parseBtn =
        document.getElementById("parseDepo");

    const copyBtn =
        document.getElementById("copyDepo");

    const backBtn =
        document.getElementById("backDepo");

    if(parseBtn){

        parseBtn.onclick =
            parseHistoryDepo;

    }

    if(copyBtn){

        copyBtn.onclick =
            copySpreadsheet;

    }

    if(backBtn){

        backBtn.onclick = ()=>{

            loadPage("checker");

        };

    }

    document
    .querySelectorAll(".cs-btn")
    .forEach(btn=>{

        btn.onclick=()=>{

            document
            .querySelectorAll(".cs-btn")
            .forEach(x=>{

                x.classList.remove("active");

            });

            btn.classList.add("active");

            currentAdmin =
                btn.dataset.cs;

            renderTable();

        };

    });

}

// ===================================
// COPY USER ID
// ===================================

async function copySpreadsheet(){

    const data = hasilDepo.filter(item=>{

        if(currentAdmin==="ALL"){

            return true;

        }

        return item.cs.toLowerCase()===

            currentAdmin.toLowerCase();

    });

    if(!data.length){

        showToast(

            "Belum ada data 😅"

        );

        return;

    }

    const hasil =

        data
        .map(item=>item.user)
        .join("\n");

    try{

        await navigator.clipboard.writeText(

            hasil

        );

        showToast(

            "✅ ID berhasil di Copy"

        );

    }

    catch(err){

        console.error(err);

        showToast(

            "❌ Gagal Copy"

        );

    }

}

// ===================================
// PARSE HISTORY
// ===================================

function parseHistoryDepo(){

    hasilDepo = [];

    const input =
        document
        .getElementById("depoInput")
        .value
        .replace(/\r/g,"");

    if(!input.trim()){

        return;

    }

    const lines =
        input
        .split("\n")
        .map(x=>x.trim())
        .filter(x=>x !== "");

    let i = 0;

    while(i < lines.length){

        if(!/^\d+\t/.test(lines[i])){

            i++;

            continue;

        }

        const block = [];

        block.push(lines[i]);

        i++;

        while(

            i < lines.length &&

            !/^\d+\t/.test(lines[i])

        ){

            block.push(lines[i]);

            i++;

        }

        hasilDepo.push(

            parseBlock(block)

        );

    }

    hasilDepo.reverse();

    renderTable();

}

// ===================================
// PARSE BLOCK
// ===================================

function parseBlock(block){

    const header =
        block[0].split("\t");

    const tanggal =
        (header[1] || "")
        .split(" ")
        .slice(0,2)
        .join(" ");

    const user =
        header[2] || "";

    const bankAsal =
        block[1] || "";

    const bankTujuan =
        block[2] || "";

    const bonus =
        block[3] || "";

    const bonusNominal =
        block[4] || "";

    const nominal =
        block[5] || "";

    const note =
        block[6] || "";

    const cs =
        block[7] || "";

    const pecah =
        bankAsal.split("-");

    return{

        tanggal,

        user,

        bank:
            (pecah[0] || "").trim(),

        nama:
            (pecah[2] || "").trim(),

        bankAsal,

        bankTujuan,

        bonus,

        bonusNominal,

        nominal,

        note,

        cs

    };

}

// ===================================
// RENDER TABLE
// ===================================

function renderTable(){

    const tbody =
        document.getElementById("depoResult");

    let html = "";

    let totalNominal = 0;

    const data = hasilDepo.filter(item=>{

        if(currentAdmin==="ALL"){

            return true;

        }

        return item.cs.toLowerCase()===

            currentAdmin.toLowerCase();

    });

    data.forEach(item=>{

        const nominal = parseInt(

            String(item.nominal)
                .replace(/[^\d]/g,""),

            10

        );

        if(!isNaN(nominal)){

            totalNominal += nominal;

        }

        html += `

        <tr>

            <td>${item.tanggal}</td>

            <td>${item.user}</td>

            <td>${item.bankAsal}</td>

            <td>${item.bankTujuan}</td>

            <td>${item.bonus}</td>

            <td>${item.nominal}</td>

            <td>${item.note}</td>

            <td>${item.cs}</td>

        </tr>

        `;

    });

    tbody.innerHTML = html;

    document.getElementById("depoTotal").innerText =
        data.length;

    document.getElementById("depoNominal").innerText =
        totalNominal.toLocaleString();

}

// ===================================
// TOAST
// ===================================

function showToast(text){

    const toast =
        document.getElementById("toast");

    if(!toast){

        return;

    }

    toast.innerText = text;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },1800);

}
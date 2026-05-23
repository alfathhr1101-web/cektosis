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

    document.getElementById("resultBody")
        .innerHTML =
        tbody;

}
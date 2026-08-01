/*

SPIRITBOX
Vigenère decode terminal for Operator transmissions.

To post a new encrypted document:
1. Write your plaintext message.
2. Encrypt it with a Vigenère cipher using whatever key you want
   the Operators to need (letters only, spaces/punctuation pass through
   unchanged).
3. Paste the resulting ciphertext into CIPHERTEXT below.
4. Update DOC_ID / DOC_STATUS if you want.

The key entered by the user is never checked against a "correct"
answer — any key decodes the text into *something*. Only the
right key produces a readable result. This is intentional: it
mirrors how a real Vigenère cipher works.

*/

const CIPHERTEXT =
    "HZR TJUBVNHDOB ONG IEJWE BZUHJNZ OHS GCSMAHGEG REFW NZRAMK JOOCVWQ";

function vigDecrypt(text, key){

    const keyLetters = key
        .toUpperCase()
        .split("")
        .filter(c => c >= "A" && c <= "Z");

    if(keyLetters.length === 0) return null;

    let ki = 0;
    let out = "";

    for(const c of text.toUpperCase()){

        if(c >= "A" && c <= "Z"){

            const shift = keyLetters[ki % keyLetters.length].charCodeAt(0) - 65;
            const code = ((c.charCodeAt(0) - 65 - shift) + 26) % 26;
            out += String.fromCharCode(code + 65);
            ki++;

        } else {

            out += c;

        }

    }

    return out;

}

function lockedView(text){

    // strip existing spacing, rechunk into blocks of 5
    // to keep word boundaries hidden while encrypted
    const letters = text.replace(/[^A-Z]/gi, "").toUpperCase();
    const blocks = [];

    for(let i = 0; i < letters.length; i += 5){

        blocks.push(letters.slice(i, i + 5));

    }

    // wrap into rows of 8 blocks for the framed look
    const rows = [];

    for(let i = 0; i < blocks.length; i += 8){

        rows.push(blocks.slice(i, i + 8).join("  "));

    }

    return rows.join("\n");

}

function render(){

    const display = document.getElementById("cipher-display");
    const status = document.getElementById("decode-status");
    const docStatus = document.getElementById("doc-status");
    const key = document.getElementById("cipher-key").value.trim();

    if(key.length === 0){

        display.textContent = lockedView(CIPHERTEXT);
        display.classList.remove("decoded");
        status.textContent = "";
        docStatus.textContent = "ENCRYPTED";
        return;

    }

    const decoded = vigDecrypt(CIPHERTEXT, key);

    display.textContent = decoded;
    display.classList.add("decoded");
    status.textContent = "— KEY APPLIED : " + key.toUpperCase() + " —";
    docStatus.textContent = "DECODED";

}

function clearKey(){

    document.getElementById("cipher-key").value = "";
    render();

}

document.addEventListener("DOMContentLoaded", () => {

    render();

    document
        .getElementById("cipher-key")
        .addEventListener("input", render);

});

console.log("SPIRITBOX ONLINE");
console.log("EVERY KEY OPENS SOMETHING. ONLY ONE OPENS THE TRUTH.");

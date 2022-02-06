/*
Last Author: K1llf0rce
Date: 09.10.2021
*/

//exec in strict mode
'use strict'

//checkboxes

let includeSpecial = document.getElementById('includeSpecial');
let includeUpper = document.getElementById('includeUppercase');
let includeLower = document.getElementById('includeLowercase');
let includeNumbers = document.getElementById('includeNumbers');
let hidePassword = document.getElementById('hidePassword');

//numerical inputs

let passLength = document.getElementById('passLength');
let passPhrase = document.getElementById('passPhrase');

//buttons

let buttonPihole = document.getElementById('buttonPihole');
let buttonGenerate = document.getElementById('buttonGenerate');
let buttonPassphraseGenerate = document.getElementById('buttonPassphraseGenerate');
let buttonCopy = document.getElementById('copyButton');
let buttonPassphraseCopy = document.getElementById('copyPhraseButton');

//outputs

const mainPassOut = document.getElementById('passOut');
const mainPassphraseOut = document.getElementById('passPhraseOut');
let cryptGenOut;
let phraseGenOut;
let cryptShadowPass;

//charsets

const charSetNum='1234567890';
const charSetSpec='!?$%&@#[](){}+-';
const charSetPassPhr='!?$%&#[](){}+-';
const charSetUpper='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const charSetLower='abcdefghijklmnopqrstuvwxyz';

//functions

function generateCrypticPass()  {
    let rndmNum;
    let rndmSpec;
    let rndmUpper;
    let rndmLower;
    let genPass = "";
    let password;
    if (includeNumbers.checked == true || includeSpecial.checked == true || includeUpper.checked == true || includeLower.checked == true) {
        while (genPass.length<passLength.value) {
            //generate random numbers
            rndmNum = Math.ceil(charSetNum.length * Math.random()*Math.random());
            rndmSpec = Math.ceil(charSetSpec.length * Math.random()*Math.random());
            rndmUpper = Math.ceil(charSetUpper.length * Math.random()*Math.random());
            rndmLower = Math.ceil(charSetLower.length * Math.random()*Math.random());
            //assemble password
            if (includeNumbers.checked == true && genPass.length<passLength.value) {
                genPass += charSetNum.charAt(rndmNum);
            }
            if (includeSpecial.checked == true && genPass.length<passLength.value) {
                genPass += charSetSpec.charAt(rndmSpec);
            }
            if (includeUpper.checked == true && genPass.length<passLength.value) {
                genPass += charSetUpper.charAt(rndmUpper);
            }
            if (includeLower.checked == true && genPass.length<passLength.value) {
                genPass += charSetLower.charAt(rndmLower);
            }
        }
        //change order
        password = genPass;
        password = password.split('').sort( function() {
            return Math.random()-Math.random()
        }).join('');
        document.getElementById("copyButton").style.display = 'unset';
        return password;
    } else {
        document.getElementById("copyButton").style.display = 'none';
        return "Tick at least one option!"
    }
}

//generate passphrase

function generatePassphrase(phrase) {
    document.getElementById("copyPhraseButton").style.display = 'unset';
    //get the value
    let userPhrase = phrase.value;
    //replace spaces with random number between 1-99 and replace normal chars with special chars
    userPhrase = userPhrase.replace(/\s+/g,'')
                .replace(/a/gi, '@')
                .replace(/i/gi, '1')
                .replace(/o/gi, '0')
                .replace(/e/gi, '3');
    //add leading and trailing special char
    userPhrase = charSetPassPhr.charAt(Math.ceil(charSetPassPhr.length * Math.random()*Math.random())) + 
    userPhrase + charSetPassPhr.charAt(Math.ceil(charSetPassPhr.length * Math.random()*Math.random()));
    //return final passphrase
    return userPhrase;
}

//copy to clipboard

function copyToClipboard(val) {
    navigator.clipboard.writeText(val).then(function() {
        console.log('Async: Copying to clipboard was successful!');
    }, function() {
        console.error('Async: Could not copy text, using fallback method');
        let dummy = document.createElement("input");
        document.body.appendChild(dummy);
        dummy.setAttribute("id", "dummy_id");
        document.getElementById("dummy_id").value=val;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
    });
}

//pihole button

buttonPihole.onclick = function() {
    location.href='/admin/';
}

//generate cryptic button

buttonGenerate.onclick = function() {
    if (passLength.value <= 99) {
        cryptGenOut = generateCrypticPass();
        if (hidePassword.checked == true) {
            cryptShadowPass = "";
            for (let i=0; i < cryptGenOut.length; i++) {
                cryptShadowPass += "*";
            }
            mainPassOut.innerHTML = cryptShadowPass;
        } else {
            mainPassOut.innerHTML = cryptGenOut;
        }
    } else {
        document.getElementById('copyButton').style.display = 'none';
        mainPassOut.innerHTML = '99 Characters Max!';
    }
    document.getElementById("mainOut").style.display = 'block';
}

//generate passphrase

buttonPassphraseGenerate.onclick = function() {
    if (passPhrase.value.length > 0) {
        phraseGenOut = generatePassphrase(passPhrase)
        mainPassphraseOut.innerHTML = phraseGenOut;
    } else {
        document.getElementById('copyPhraseButton').style.display = 'none';
        mainPassphraseOut.innerHTML = 'Provide an Input!';
    }
    document.getElementById("secOut").style.display = 'block';
}

// hide password button

hidePassword.onchange = function() {
    if (hidePassword.checked == true) {
        mainPassOut.innerHTML = cryptShadowPass;
    } else {
        mainPassOut.innerHTML = cryptGenOut;
    }
}

//copy cryptic button

buttonCopy.onclick = function() {
    copyToClipboard(cryptGenOut);
}

//copy passphrase button

buttonPassphraseCopy.onclick = function() {
    copyToClipboard(phraseGenOut)
}
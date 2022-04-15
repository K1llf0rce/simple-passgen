/*
Project: simple-passgen
Last Author: K1llf0rce
*/

// exec in strict mode
'use strict'

// general vars

let cryptGenOut;
let phraseGenOut;
let cryptShadowPass;
let rndmNum;
let rndmSpec;
let rndmUpper;
let rndmLower;

// checkboxes

let includeSpecial = document.getElementById('includeSpecial');
let includeUpper = document.getElementById('includeUppercase');
let includeLower = document.getElementById('includeLowercase');
let includeNumbers = document.getElementById('includeNumbers');
let hidePassword = document.getElementById('hidePassword');
let avoidCharRepeat = document.getElementById('avoidCharRepeat');

// numerical inputs

let passLength = document.getElementById('passLength');
let passPhrase = document.getElementById('passPhrase');

// buttons

let buttonPihole = document.getElementById('buttonPihole');
let buttonGenerate = document.getElementById('buttonGenerate');
let buttonPassphraseGenerate = document.getElementById('buttonPassphraseGenerate');
let buttonCopy = document.getElementById('copyButton');
let buttonPassphraseCopy = document.getElementById('copyPhraseButton');

// outputs

const mainOut = document.getElementById('mainOut');
const secOut = document.getElementById('secOut');
const mainPassOut = document.getElementById('passOut');
const mainPassphraseOut = document.getElementById('passPhraseOut');
const passLengthOut = document.getElementById('passLengthDisplay');

// charsets

const charSetNum='1234567890';
const charSetSpec='^*!?$%&@#[](){}+-';
const charSetSpecPhr='^*!?$%&#[](){}+-';
const charSetUpper='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const charSetLower='abcdefghijklmnopqrstuvwxyz';

// functions

function randomFromCharset(charset) {
    // generate random chars
    switch (charset) {
        case 'num':
            rndmNum = Math.ceil(charSetNum.length * Math.random()*Math.random());
            return charSetNum.charAt(rndmNum)
        case 'spec':
            rndmSpec = Math.ceil(charSetSpec.length * Math.random()*Math.random());
            return charSetSpec.charAt(rndmSpec);
        case 'up':
            rndmUpper = Math.ceil(charSetUpper.length * Math.random()*Math.random());
            return charSetUpper.charAt(rndmUpper);
        case 'low':
            rndmLower = Math.ceil(charSetLower.length * Math.random()*Math.random());
            return charSetLower.charAt(rndmLower);
    }
}

function generateCrypticPass()  {
    let password = "";
    if (includeNumbers.checked == true || includeSpecial.checked == true || includeUpper.checked == true || includeLower.checked == true) {
        while (password.length<passLength.value) {
            // assemble password
            if (password.length<passLength.value) {
                if (includeNumbers.checked) {
                    password += randomFromCharset('num');
                }
                if (includeSpecial.checked) {
                    password += randomFromCharset('spec');
                }
                if (includeUpper.checked) {
                    password += randomFromCharset('up');
                }
                if (includeLower.checked) {
                    password += randomFromCharset('low');
                }
            }
        }
        password = password.split('').sort( function() {
            // randomize character placement after first assembly
            return Math.random()-Math.random()
        }).join('');
        // avoid character repetition
        if (avoidCharRepeat.checked) {
            for (let i=1; i < password.length; i++) {
                if ( password[i] == password[i-1] ) {
                    if (charSetNum.includes(password[i])) {
                        password = password.substring(0, i) + randomFromCharset('num') + password.substring(i + 1);
                    }
                    else if (charSetSpec.includes(password[i])) {
                        password = password.substring(0, i) + randomFromCharset('spec') + password.substring(i + 1);
                    }
                    else if (charSetUpper.includes(password[i])) {
                        password = password.substring(0, i) + randomFromCharset('up') + password.substring(i + 1);
                    }
                    else if (charSetLower.includes(password[i])) {
                        password = password.substring(0, i) + randomFromCharset('low') + password.substring(i + 1);
                    }
                }
            }
        }
        buttonCopy.style.display = 'unset';
        return password;
    } else {
        buttonCopy.style.display = 'none';
        return "Tick at least one option!"
    }
}

function generatePassphrase(phrase) {
    buttonPassphraseCopy.style.display = 'unset';
    // get the value
    let userPhrase = phrase.value;
    // replace spaces with random number between 1-99 and replace normal chars with special chars
    userPhrase = userPhrase.replace(/\s+/g,'')
                .replace(/a/gi, '@')
                .replace(/i/gi, '1')
                .replace(/o/gi, '0')
                .replace(/e/gi, '3');
    // add leading and trailing special char
    userPhrase = charSetSpecPhr.charAt(Math.ceil(charSetSpecPhr.length * Math.random()*Math.random())) + 
    userPhrase + charSetSpecPhr.charAt(Math.ceil(charSetSpecPhr.length * Math.random()*Math.random()));
    // return final passphrase
    return userPhrase;
}

function copyToClipboard(val) {
    // use new method to copy
    navigator.clipboard.writeText(val).then(function() {
        console.log('Async: Copying to clipboard was successful!');
    }, function() {
        // if new method somehow fails try depreciated method
        // method consists of creating a dummy input element and copying from it
        console.error('Async: Could not copy text, using fallback method');
        let dummy = document.createElement("input");
        document.body.appendChild(dummy);
        dummy.setAttribute("id", "dummy_id");
        document.getElementById("dummy_id").value=val;
        dummy.select();
        // !! DEPRECIATED !!
        document.execCommand("copy");
        document.body.removeChild(dummy);
    });
}

// buttons

buttonPihole.onclick = function() {
    // relocate to admin page
    location.href='/admin/';
}

buttonGenerate.onclick = function() {
    if (passLength.value <= 128) {
        cryptGenOut = generateCrypticPass();
        if (hidePassword.checked == true) {
            cryptShadowPass = "";
            for (let i=0; i < cryptGenOut.length; i++) {
                if (cryptShadowPass.length < 16) {
                    cryptShadowPass += "*";
                }
            }
            mainPassOut.innerHTML = cryptShadowPass;
        } else {
            mainPassOut.innerHTML = cryptGenOut;
        }
    } else {
        buttonCopy.style.display = 'none';
        mainPassOut.innerHTML = '128 Characters Max!';
    }
    mainOut.style.display = 'block';
}

buttonPassphraseGenerate.onclick = function() {
    if (passPhrase.value.length > 0) {
        phraseGenOut = generatePassphrase(passPhrase)
        mainPassphraseOut.innerHTML = phraseGenOut;
    } else {
        buttonPassphraseCopy.style.display = 'none';
        mainPassphraseOut.innerHTML = 'Provide an Input!';
    }
    secOut.style.display = 'block';
}

hidePassword.onchange = function() {
    if (hidePassword.checked == true) {
        mainPassOut.innerHTML = cryptShadowPass;
    } else {
        mainPassOut.innerHTML = cryptGenOut;
    }
}

buttonCopy.onclick = function() {
    copyToClipboard(cryptGenOut);
}

buttonPassphraseCopy.onclick = function() {
    copyToClipboard(phraseGenOut)
}

passLength.oninput = function() {
    passLengthOut.innerHTML = passLength.value;
}

window.onload = function() {
    passLengthOut.innerHTML = passLength.value;
}

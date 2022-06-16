// exec in strict mode

'use strict'

// checkboxes

const includeSpecial = document.getElementById('includeSpecial');
const includeExtSpecial = document.getElementById('includeExtSpecial');
const includeUpper = document.getElementById('includeUppercase');
const includeLower = document.getElementById('includeLowercase');
const includeNumbers = document.getElementById('includeNumbers');
const hidePassword = document.getElementById('hidePassword');
const avoidCharRepeat = document.getElementById('avoidCharRepeat');

// numerical inputs

const passLength = document.getElementById('passLength');
const passPhrase = document.getElementById('passPhrase');

// buttons

const buttonGenerate = document.getElementById('buttonGenerate');
const buttonPassphraseGenerate = document.getElementById('buttonPassphraseGenerate');
const buttonCopy = document.getElementById('copyButton');
const buttonPassphraseCopy = document.getElementById('copyPhraseButton');

// outputs

const mainOut = document.getElementById('mainOut');
const secOut = document.getElementById('secOut');
const mainPassOut = document.getElementById('passOut');
const mainPassphraseOut = document.getElementById('passPhraseOut');
const passLengthOut = document.getElementById('passLengthDisplay');

// charsets

const charSetNum='1234567890';
const charSetSpecBsc='!?$%&@#';
const charSetSpecExt='!?$%&@#[](){}+-:,~_./^*';
const charSetUpper='ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const charSetLower='abcdefghijklmnopqrstuvwxyz';

// general vars

let cryptGenOut;
let phraseGenOut;

// functions

function randomFromCharset(charset) {
    /* 
        generate a random number based on how many chars we have in our chosen charset and
        use that to pick a char and return it
    */
    switch (charset) {
        case 'num':
            var rndmNum = Math.ceil((charSetNum.length-1) * Math.random());
            return charSetNum.charAt(rndmNum)
        case 'spec':
            var rndmSpec
            if (includeExtSpecial.checked) {
                rndmSpec = Math.ceil((charSetSpecExt.length-1) * Math.random());
                return charSetSpecExt.charAt(rndmSpec);
            } else {
                rndmSpec = Math.ceil((charSetSpecBsc.length-1) * Math.random());
                return charSetSpecBsc.charAt(rndmSpec);
            }
        case 'specPhr':
            var rndmSpecPhr = Math.ceil((charSetSpecBsc.length-1) * Math.random());
            return charSetSpecBsc.charAt(rndmSpecPhr);
        case 'up':
            var rndmUpper = Math.ceil((charSetUpper.length-1) * Math.random());
            return charSetUpper.charAt(rndmUpper);
        case 'low':
            var rndmLower = Math.ceil((charSetLower.length-1) * Math.random());
            return charSetLower.charAt(rndmLower);
    }
}

function correctRepeat(string) {
    /* 
        we check if the character at current index matches the character of the previous
        index. If this is the case we generate a new random char from the corresponding
        charset and check again, just to be sure. 
    */
    let i=0;
    while (i < string.length) {
        if ( string[i] == string[i-1] ) {
            if (charSetNum.includes(string[i])) {
                string = string.substring(0, i) + randomFromCharset('num') + string.substring(i + 1);
            }
            else if (charSetSpecExt.includes(string[i])) {
                string = string.substring(0, i) + randomFromCharset('spec') + string.substring(i + 1);
            }
            else if (charSetUpper.includes(string[i])) {
                string = string.substring(0, i) + randomFromCharset('up') + string.substring(i + 1);
            }
            else if (charSetLower.includes(string[i])) {
                string = string.substring(0, i) + randomFromCharset('low') + string.substring(i + 1);
            }
        } else {
            i++;
        }
    }
    return string;
}

function generateCrypticPass()  {
    let password = "";
    let ctr=0;
    if (
        includeNumbers.checked == true ||
        includeSpecial.checked == true ||
        includeUpper.checked == true ||
        includeLower.checked == true
        ) {
        while (ctr < passLength.value) {
            // assemble password
            if (includeNumbers.checked) {
                password += randomFromCharset('num');
                ctr++;
            }
            if (includeSpecial.checked && ctr < passLength.value) {
                password += randomFromCharset('spec');
                ctr++;
            }
            if (includeUpper.checked && ctr < passLength.value) {
                password += randomFromCharset('up');
                ctr++;
            }
            if (includeLower.checked && ctr < passLength.value) {
                password += randomFromCharset('low');
                ctr++;
            }
        }
        password = password.split('').sort( function() {
            // randomize character placement after first assembly
            return Math.random()-Math.random()
        }).join('');
        // avoid character repetition
        if (avoidCharRepeat.checked) {
            password = correctRepeat(password);
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
    userPhrase = randomFromCharset('specPhr') + userPhrase + randomFromCharset('specPhr');
    // return final passphrase
    return userPhrase;
}

function copyToClipboard(val) {
    // use new method to copy
    navigator.clipboard.writeText(val).then(function() {
        console.log('Copying to clipboard was successful!');
    }, function() {
        // if new method somehow fails try depreciated method
        // method consists of creating a dummy input element and copying from it
        console.error('Copying failed, using fallback method');
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

// basic string replacement to make password "*" formatted
function hidePass(string) { return string.replace(/./g, '*').substring(0,12); }

// password generation button
buttonGenerate.onclick = function() {
    cryptGenOut = generateCrypticPass();
    if (hidePassword.checked == true) {
        // if we hide password, replace all chars in string with '*'
        mainPassOut.innerHTML = hidePass(cryptGenOut);
    } else {
        mainPassOut.innerHTML = cryptGenOut;
    }
    mainOut.style.display = 'block';
}

// passphrase generation button
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

// hide password by default, or if user wants
hidePassword.onchange = function() {
    if (hidePassword.checked == true) {
        mainPassOut.innerHTML = hidePass(cryptGenOut);
    } else {
        mainPassOut.innerHTML = cryptGenOut;
    }
}

// these are just some buttons that do basic things
buttonCopy.onclick = function() { copyToClipboard(cryptGenOut); }
buttonPassphraseCopy.onclick = function() { copyToClipboard(phraseGenOut) }
passLength.oninput = function() { passLengthOut.innerHTML = passLength.value; }
window.onload = function() { passLengthOut.innerHTML = passLength.value; }

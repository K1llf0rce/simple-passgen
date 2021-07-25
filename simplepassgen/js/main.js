/*
Last Author: K1llf0rce
Date: 05.06.2021
*/

//exec in strict mode
'use strict'

//checkboxes

let includeSpecial = document.getElementById('includeSpecial');
let includeUpper = document.getElementById('includeUppercase');
let includeLower = document.getElementById('includeLowercase');
let includeNumbers = document.getElementById('includeNumbers');

//numerical inputs

let passLength = document.getElementById('passLength');

//buttons

let buttonPihole = document.getElementById('buttonPihole');
let buttonGenerate = document.getElementById('buttonGenerate');
let buttonCopy = document.getElementById('copyButton');

//outputs

const mainPassOut = document.getElementById('passOut');

//charsets

const charSetNum='1234567890'
const charSetSpec='!?$%&@#[](){}+-'
const charSetUpper='ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const charSetLower='abcdefghijklmnopqrstuvwxyz'

//functions

function generateCrypticPass()  {
    let rndmNum
    let rndmSpec
    let rndmUpper
    let rndmLower
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
            if (includeNumbers.checked == true) {
                genPass += charSetNum.charAt(rndmNum);
            }
            if (includeSpecial.checked == true) {
                genPass += charSetSpec.charAt(rndmSpec);
            }
            if (includeUpper.checked == true) {
                genPass += charSetUpper.charAt(rndmUpper);
            }
            if (includeLower.checked == true) {
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

//pihole button
buttonPihole.onclick = function() {
    location.href='../../../admin/'
}

//generate button
buttonGenerate.onclick = function() {
    if (passLength.value <= 99) {
        mainPassOut.innerHTML = generateCrypticPass();
        document.getElementById('copyButton').style.borderColor = '#ffffff'
    } else {
        document.getElementById("copyButton").style.display = 'none';
        mainPassOut.innerHTML = '99 Characters Max!';
    }
    document.getElementById("mainOut").style.display = 'block';
}

//copy button
buttonCopy.onclick = function() {
    //create a dummy input
    let dummy = document.createElement("input");
    document.body.appendChild(dummy);
    dummy.setAttribute("id", "dummy_id");
    //set value of dummy input to generated password
    document.getElementById("dummy_id").value=mainPassOut.value;
    //select it
    dummy.select();
    //copy it
    document.execCommand("copy");
    document.body.removeChild(dummy);
    //inform user
    document.getElementById('copyButton').style.borderColor = '#00ff00'
}
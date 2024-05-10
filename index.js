const apiURL = "https://script.google.com/macros/s/AKfycby8NLCcS6R1HqS5LqCV8eTjoo-2VCStiCnzCUyAGh_EqvZJpUm7Be3dEnPbRqAlXsKFRg/exec";
const interval = 10;
let myNumber = -1;

function startSearch() {
    let numberInput = document.getElementsByClassName("numberInput")[0];
    if (numberInput.value == "") return;

    myNumber = parseInt(numberInput.value);
    saveData();

    //要素取得
    let outputText = document.getElementsByClassName("output")[0];
    let welcomeText = document.getElementsByClassName("welcome")[0];

    let durations = {};

    //APIからデータを取得
    fetch(apiURL)
    .then(function (fetch_data) {
        return fetch_data.json();
    })
    .then(function (json) {
        for (var i in json) {
            durations[json[i].number] = json[i].duration;
        }

        //スプレッドシートからその受付番号の予定時間を文字列で取得
        let numberInputText = durations[parseInt(numberInput.value)];

        let beforeHourAndMinute = numberInputText.split("-").map(s => parseInt(s));
        let afterHourAndMinute = beforeHourAndMinute.slice();
        afterHourAndMinute[1] += interval;
        if (afterHourAndMinute[1] >= 60) {
            afterHourAndMinute[1] -= 60;
            afterHourAndMinute[0]++;
        }

        outputText.style.border = "double 5px black";
        welcomeText.innerHTML = "にお越しください";
        outputText.innerText = 
        `${beforeHourAndMinute[0]}:${beforeHourAndMinute[1].toString().padStart(2,'0')} ~ ${afterHourAndMinute[0]}:${afterHourAndMinute[1].toString().padStart(2,'0')}`;
    });
}

function openUnivSite() {
    location.href = "https://www.ritsumei.ac.jp/";
}

function saveData() {
    if (document.getElementsByClassName("numberInput")[0].value == "") return;
    localStorage.setItem("myNumber",myNumber.toString());
}

function loadData() {
    if (localStorage.getItem("myNumber") == null) return;
    myNumber = parseInt(localStorage.getItem("myNumber"));
}

function onLoad() {
    loadData();
    document.getElementsByClassName("numberInput")[0].value = (myNumber == -1 ? "" : myNumber.toString());
}
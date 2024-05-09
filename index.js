const apiURL = "https://script.google.com/macros/s/AKfycbzlISXKYbNZHT8c31dZUr3zqx1AGciFpD4QqTcHDlLhApN3zYCIJlzFq5QYSZwpFa9MSA/exec";
const interval = 10;
let myNumber = -1;

function startSearch() {
    if (document.getElementsByClassName("numberInput")[0].value == "") return;

    myNumber = parseInt(document.getElementsByClassName("numberInput")[0].value);
    saveData();

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

        //html要素の取得
        let outputText = document.getElementsByClassName("outputMain")[0];
        let numberInput = document.getElementsByClassName("numberInput")[0];

        //スプレッドシートからその受付番号の予定時間を文字列で取得
        let numberInputText = durations[parseInt(numberInput.value)];

        let beforeHourAndMinute = numberInputText.split("-").map(s => parseInt(s));
        let afterHourAndMinute = beforeHourAndMinute.slice();
        afterHourAndMinute[1] += interval;
        if (afterHourAndMinute[1] >= 60) {
            afterHourAndMinute[1] -= 60;
            afterHourAndMinute[0]++;
        }

        outputText.innerText = 
        `${beforeHourAndMinute[0]}:${beforeHourAndMinute[1].toString().padStart(2,'0')} ~ ${afterHourAndMinute[0]}:${afterHourAndMinute[1].toString().padStart(2,'0')}`;
    });
}

function saveData() {
    if (document.getElementsByClassName("numberInput")[0].value == "") return;

    localStorage.setItem("myNumber",myNumber.toString());
}

function loadData() {
    //初回入力の時
    if (localStorage.getItem("myNumber") == null) return;

    //一度保存していた場合
    myNumber = parseInt(localStorage.getItem("myNumber"));
}

function onLoad() {
    loadData();
    document.getElementsByClassName("numberInput")[0].value = (myNumber == -1 ? "" : myNumber.toString());
}
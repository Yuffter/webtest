function clickButton() {
    var btn = document.getElementById("btn_1");
    btn.innerText = "clicked";
}

const apiURL = "https://script.google.com/macros/s/AKfycbzlISXKYbNZHT8c31dZUr3zqx1AGciFpD4QqTcHDlLhApN3zYCIJlzFq5QYSZwpFa9MSA/exec";
const interval = 10;
function startSearch() {
    let durations = {};
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
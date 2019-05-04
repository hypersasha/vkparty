export function XhrFilesUpload(files, host, onFinish, onProgress) {
    let xhr = new XMLHttpRequest();

    let formData = new FormData();
    for (let i = 0; i < files.length; i++) {
        formData.append('file[]', files[i], files[i].name);
    }

    // On progress
    xhr.upload.onprogress = function(event) {
        let percentage = (event.loaded / event.total) * 100;
        if (onProgress) {
            onProgress(percentage);
        }
    };

    // On upload completed.
    xhr.onload = xhr.onerror = function() {
        if (this.status === 200) {
            if (onFinish) {
                onFinish(JSON.parse(this.response));
            }
        } else {
            console.log("XhrFilesUpload Error: " + this.status);
        }
    };

    xhr.open("POST", host, true);
    xhr.send(formData);
}

export function getTextDate(date) {
    let daysMap = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    const monthsMap = ['Янв.', 'Фев.', 'Март', 'Апр.', 'Май', 'Июн.', 'Июл.', 'Авг.', 'Сент.', 'Окт.', 'Ноя.'];
    let day = daysMap[date.getDay()];
    let month = monthsMap[date.getMonth()];
    return day + ', ' + date.getDate() + ' ' + month;
}

export function declOfNum(number, titles) {
    let cases = [2, 0, 1, 1, 1, 2];
    return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
}

export const SERVER_URL = "https://hypersasha.club:443";
const DAYS = ['月', '火', '水', '木', '金', '土'];
const PERIODS = 7;
const TABLE_BODY_ID = 'course-body';
const STORAGE_KEY = 'myTimetableData';

/**
 * 時間割の表本体を動的に生成する
 */
function generateTimetable() {
    const table = document.getElementById('timetable').getElementsByTagName('tbody')[0];
    table.innerHTML = ''; // 既存の内容をクリア

    for (let i = 1; i <= PERIODS; i++) {
        const row = table.insertRow();
        
        // 1列目: 時限
        const periodCell = row.insertCell();
        periodCell.textContent = i;
        
        // 2列目以降: 曜日ごとの授業セル (編集可能)
        for (let j = 0; j < DAYS.length; j++) {
            const dataCell = row.insertCell();
            
            // contenteditable属性をtrueに設定することで、ユーザーがセルを直接編集できるようにする
            dataCell.setAttribute('contenteditable', 'true');
            
            // セルに一意のIDを設定 (読み書き込み時に使用)
            dataCell.id = `cell-${i}-${j}`;
            
            // 初期データ（ローカルストレージから読み込む）
            dataCell.textContent = '';
        }
    }
    loadTimetable(); // 表の生成後、保存されたデータを読み込む
}

/**
 * 時間割の内容をブラウザのローカルストレージに保存する
 */
function saveTimetable() {
    const data = {};
    const editableCells = document.querySelectorAll('#timetable td[contenteditable="true"]');
    
    editableCells.forEach(cell => {
        // セルのIDをキー、内容を値として保存
        data[cell.id] = cell.textContent;
    });

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        showMessage("時間割を保存しました！", 'green');
    } catch (e) {
        showMessage("保存に失敗しました。ブラウザの設定を確認してください。", 'red');
    }
}

/**
 * ローカルストレージから時間割の内容を読み込む
 */
function loadTimetable() {
    try {
        const savedDataJSON = localStorage.getItem(STORAGE_KEY);
        if (savedDataJSON) {
            const data = JSON.parse(savedDataJSON);
            
            for (const id in data) {
                const cell = document.getElementById(id);
                if (cell) {
                    cell.textContent = data[id];
                }
            }
            showMessage("保存された時間割を読み込みました。", 'blue');
        } else {
            showMessage("保存された時間割データはありません。", 'orange');
        }
    } catch (e) {
        showMessage("データの読み込み中にエラーが発生しました。", 'red');
    }
}

/**
 * ユーザーへのメッセージを表示する
 */
function showMessage(text, color) {
    const msgElement = document.getElementById('message');
    msgElement.textContent = text;
    msgElement.style.color = color;
    
    // 3秒後にメッセージを消す
    setTimeout(() => {
        msgElement.textContent = '';
    }, 3000);
}

// ページがロードされたときに実行
document.addEventListener('DOMContentLoaded', generateTimetable);
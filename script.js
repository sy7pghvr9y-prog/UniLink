// 単位データを格納する配列
let courses = [];

/**
 * 単位データをローカルストレージに保存する
 */
function saveCourses() {
    try {
        // 配列をJSON文字列に変換して保存
        localStorage.setItem('acquiredCoursesData', JSON.stringify(courses));
        showMessage('✅ 取得単位を保存しました。');
    } catch (e) {
        showMessage('⚠️ 保存に失敗しました。', true);
        console.error("Failed to save data to localStorage:", e);
    }
}

/**
 * ローカルストレージから単位データを読み込む
 */
function loadCourses() {
    try {
        // 保存されたJSON文字列を読み込む
        const storedData = localStorage.getItem('acquiredCoursesData');
        if (storedData) {
            // JSON文字列をJavaScriptのオブジェクト（配列）に戻す
            courses = JSON.parse(storedData);
            renderCourses(); // 読み込んだデータで表示を更新
            showMessage('📥 取得単位を読み込みました。');
            return true;
        }
    } catch (e) {
        showMessage('⚠️ データの読み込みに失敗しました。', true);
        console.error("Failed to load data from localStorage:", e);
    }
    return false;
}

/**
 * メッセージを表示する
 */
function showMessage(text, isError = false) {
    const messageElement = document.getElementById('message');
    messageElement.textContent = text;
    messageElement.style.color = isError ? '#e74c3c' : '#2ecc71';
    setTimeout(() => {
        messageElement.textContent = '';
    }, 3000);
}


// --- 既存の関数の変更点 ---

/**
 * 単位を追加する
 */
function addCourse() {
    const type = document.getElementById('courseType').value;
    const name = document.getElementById('courseName').value.trim();
    const credits = parseInt(document.getElementById('credits').value);

    // 入力チェック
    if (!name || isNaN(credits) || credits <= 0) {
        alert("科目名と有効な単位数を入力してください。");
        return;
    }

    const newCourse = {
        id: Date.now(), // 一意のIDとしてタイムスタンプを使用
        type: type,
        name: name,
        credits: credits
    };

    courses.push(newCourse);
    
    // 入力フィールドをクリア
    document.getElementById('courseName').value = '';
    document.getElementById('credits').value = '';

    renderCourses();
    // ★ 単位追加後に自動保存
    saveCourses();
}

/**
 * 単位一覧を表示し、集計を更新する
 */
function renderCourses() {
    const listBody = document.getElementById('courseList');
    listBody.innerHTML = ''; // 一旦リストをクリア

    // リストの描画 (変更なし)
    courses.forEach(course => {
        const row = listBody.insertRow();
        
        row.insertCell().textContent = course.type;
        row.insertCell().textContent = course.name;
        row.insertCell().textContent = course.credits;
        
        // 削除ボタンの追加
        const actionCell = row.insertCell();
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '削除';
        deleteBtn.className = 'delete-btn';
        deleteBtn.onclick = () => deleteCourse(course.id);
        actionCell.appendChild(deleteBtn);
    });

    updateSummary();
}

/**
 * 単位を削除する
 */
function deleteCourse(id) {
    // 該当IDを持つ要素を配列から除外
    courses = courses.filter(course => course.id !== id);
    renderCourses(); // 再描画
    // ★ 単位削除後に自動保存
    saveCourses(); 
}

/**
 * 総単位数と分類ごとの単位数を集計し、表示を更新する (変更なし)
 */
function updateSummary() {
    let totalCredits = 0;
    const breakdown = {};

    // 集計
    courses.forEach(course => {
        totalCredits += course.credits;

        if (breakdown[course.type]) {
            breakdown[course.type] += course.credits;
        } else {
            breakdown[course.type] = course.credits;
        }
    });

    // 総単位数の表示
    document.getElementById('totalCredits').textContent = totalCredits;

    // 分類ごとの内訳の表示
    const breakdownDiv = document.getElementById('creditBreakdown');
    breakdownDiv.innerHTML = ''; // クリア
    
    for (const type in breakdown) {
        const p = document.createElement('p');
        p.textContent = `${type}: ${breakdown[type]} 単位`;
        breakdownDiv.appendChild(p);
    }
}

/**
 * 初期化処理
 * ページロード時に実行し、保存されたデータを読み込む
 */
function init() {
    loadCourses(); // データを読み込み、成功すれば renderCourses() が呼ばれる
    if (courses.length === 0) {
        // 読み込みデータがない場合も表示を初期化
        renderCourses();
    }
}

// 初期表示時に実行
// ★ renderCourses() の代わりに init() を呼び出す
document.addEventListener('DOMContentLoaded', init);


// 単位データを格納する配列
let courses = [];

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
}

/**
 * 単位一覧を表示し、集計を更新する
 */
function renderCourses() {
    const listBody = document.getElementById('courseList');
    listBody.innerHTML = ''; // 一旦リストをクリア

    // リストの描画
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
}

/**
 * 総単位数と分類ごとの単位数を集計し、表示を更新する
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

// 初期表示時に実行
renderCourses();
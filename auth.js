// ===============================================
// ★★★ 認証・登録ロジック (auth.js) ★★★
// ===============================================

// ユーザーデータを格納するローカルストレージのキー
const STORAGE_KEY = 'uniLinkUsers';

// 認証モード (login または register)
let authMode = 'login'; 

/**
 * ユーザーデータをローカルストレージから読み込む
 * @returns {Array} ユーザーオブジェクトの配列
 */
function loadUsers() {
    const usersJson = localStorage.getItem(STORAGE_KEY);
    return usersJson ? JSON.parse(usersJson) : [];
}

/**
 * ユーザーデータをローカルストレージに保存する
 * @param {Array} users - ユーザーオブジェクトの配列
 */
function saveUsers(users) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

// ページタイトルとリンクの切り替え
document.getElementById('toggle-auth-mode').addEventListener('click', function(e) {
    e.preventDefault();
    const title = document.getElementById('form-title');
    const button = document.getElementById('auth-button');
    const link = document.getElementById('toggle-auth-mode');
    
    if (authMode === 'login') {
        authMode = 'register';
        title.textContent = 'UniLink 新規登録';
        button.textContent = '新規登録して時間割へ';
        link.textContent = 'すでにアカウントをお持ちの方はこちらからログイン';
    } else {
        authMode = 'login';
        title.textContent = 'UniLink ログイン';
        button.textContent = 'ログインして時間割へ';
        link.textContent = 'アカウントをお持ちでない場合はこちらから新規登録';
    }
    document.getElementById('auth-message').textContent = '';
});


document.getElementById('authForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const password = document.getElementById('password').value;
    const faculty = document.getElementById('faculty').value;
    const messageElement = document.getElementById('auth-message');
    let users = loadUsers();

    // 学部とパスワードの必須チェック
    if (password === "" || faculty === "") {
        messageElement.textContent = '学部を選択し、パスワードを入力してください。';
        return;
    }

    if (authMode === 'register') {
        // --- 新規登録処理 ---
        
        // 1. 学部名の重複チェック (学部名がIDの役割を果たす)
        if (users.find(u => u.faculty === faculty)) {
            messageElement.textContent = `エラー: 学部「${faculty}」はすでに登録済みです。ログインしてください。`;
            return;
        }

        // 2. 新しいユーザーを作成
        const newUser = {
            // 学部名を一意のキー（ID）として使用
            id: faculty, 
            password: password, 
            faculty: faculty
        };
        
        users.push(newUser);
        saveUsers(users); // ユーザーリストを保存
        
        // 3. 登録成功後、自動ログイン
        performLogin(newUser, messageElement);

    } else {
        // --- ログイン処理 ---

        // 学部名とパスワードでユーザーを検索
        const user = users.find(u => u.faculty === faculty);

        if (user && user.password === password) {
            // 認証成功
            performLogin(user, messageElement);
        } else {
            // 認証失敗
            messageElement.textContent = '学部またはパスワードが違います。';
        }
    }
});

/**
 * ログイン成功後の処理を実行し、ページを遷移させる
 * @param {Object} user - ログインしたユーザーオブジェクト
 * @param {HTMLElement} messageElement - メッセージ表示要素
 */
function performLogin(user, messageElement) {
    // ログイン情報（学部名と認証フラグ）をローカルストレージに保存
    localStorage.setItem('currentUser', JSON.stringify({
        id: user.id,
        faculty: user.faculty,
        isAuthenticated: true
    }));

    messageElement.textContent = `${user.faculty} のユーザーとして時間割ページへ移動します...`;
    messageElement.style.color = '#2ecc71';

    // 認証後のページへリダイレクト
    setTimeout(() => {
        window.location.href = 'indexs.html';
    }, 500);

}

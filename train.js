// 3駅の時刻表データ（24時間表記の文字列配列）
// 実際の時刻表に合わせて、データを自由に変更してください。
const timetableData = {
    "近鉄長瀬駅　大阪上本町方面": [
        "05:17", "05:34", "05:50", "06:08", "06:24", "06:33", "06:46", "06:59",
        "07:15", "07:32", "07:46", "07:55", "08:10", "08:21","08:35","08:48","09:01","09:11","09:21",
        "09:29", "09:37", "09:50", "10:01", "10:15", "10:27", "10:33", "10:44", "11:00", "11:07",
        "11:19", "11:32", "11:46", "11:58", "12:08","12:24","12:34","12:46","13:00","13:08","13:24","13:34","13:46","14:00",
        "14:07","14:24","14:34","14:46","15:01","15:07","15:19","15:25","15:34","15:46","16:01","16:08","16:25","16:34","16:43",
        "16:47","16:52","17:00","17:09","17:17","17:27","17:39","17:51","18:02","18:15","18:22","18:31","18:36","18:42","18:53",
        "19:07","19:19","19:31","19:44","19:58","20:03","20:17","20:30","20:42","20:50","21:08","21:19","21:29","21:42","21:50",
        "22:05","22:16","22:33","22:47","23:02","23:10","23:26","23:39","23:50",
    ],
    "八戸ノ里駅　大阪難波　尼崎": [
        "05:07", "05:21", "05:33", "05:49", "06:00", "06:12", "06:24", "06:37","06:48","06:59","07:06","07:17","07:30","07:40","07:50",
        "08:02", "08:10", "08:18", "08:30", "08:41", "08:53","09:04","09:18","09:26","09:41","09:54","10:02","10:13","10:20","10:33","10:40","10:53",
        "11:00", "11:13", "11:20", "11:33", "11:40", "11:53", "12:00", "12:13", "12:20", "12:33","12:40","12:53","13:00","13:13","13:20","13:33","13:40","13:53",
        "14:00","14:13","14:20","14:33","14:40","14:53","15:00","15:13","15:20","15:33","15:40","15:53","16:00","16:13","16:20","16:31","16:43","16:53","17:03","17:12",
        "17:21","17:34","17:41","17:52","18:01","18:12","18:22","18:32","18:42","18:52","19:02","19:12","19:22","19:32","19:42","19:46","19:54","20:05","20:15","20:28",
        "20:40", "20:53", "21:01", "21:12", "21:24","21:36","21:48","21:59","22:14","22:28","22:36","22:48","22:58","23:12","23:27","23:37","23:49",
    ],
    "JR長瀬駅 大阪": [
        "05:38", "06:08", "06:37", "06:55", "07:08", "07:23", "07:34", "07:48","08:01","08:20","08:34","08:49","09:03","09:25","09:41","10:01","10:22","10:37","10:52",
        "11:07", "11:22", "12:37", "11:52", "12:07", "12:22","12:37","12:52","13:07","13:22","13:37","13:52","14:07","14:22","14:37","14:52","15:07","15:23","15:38","15:53",
        "16:08", "16:23", "16:38", "16:53", "17:08", "17:23", "17:38", "17:53", "18:08", "18:23","18:38","18:53","19:08","19:23","19:38","19:53","20:08","20:23","20:38","20:53",
        "21:13", "21:33", "21:53", "22:13", "22:39","23:04","23:25","23:53"
    ]
};

/**
 * 現在時刻を取得し、ミリ秒に変換する
 * @returns {number} 現在の時刻（午前0時からのミリ秒）
 */
function getCurrentTimeMs() {
    const now = new Date();
    // 0時からの経過ミリ秒を計算
    return now.getHours() * 3600000 + now.getMinutes() * 60000 + now.getSeconds() * 1000;
}

/**
 * 時刻文字列 (HH:MM) をミリ秒に変換する
 * @param {string} timeStr - 時刻文字列 ("HH:MM")
 * @returns {number} 0時からの経過ミリ秒
 */
function timeStrToMs(timeStr) {
    // 念のため、末尾にコンマがある場合（JR長瀬駅のデータ）に対応
    const cleanTimeStr = timeStr.replace(',', '');
    const [hours, minutes] = cleanTimeStr.split(':').map(Number);
    return hours * 3600000 + minutes * 60000;
}

/**
 * ミリ秒をHH:MM形式の時刻文字列に変換する
 * @param {number} ms - 0時からの経過ミリ秒
 * @returns {string} 時刻文字列 ("HH:MM")
 */
function msToTimeStr(ms) {
    const totalMinutes = Math.floor(ms / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const pad = (num) => String(num).padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)}`;
}

/**
 * 時刻表全体を生成し、最も近い時刻とその1時間以内のみを表示する
 */
function generateTimetables() {
    const container = document.getElementById('timetable-container');
    const currentTimeMs = getCurrentTimeMs();
    // 1時間をミリ秒で定義
    const ONE_HOUR_MS = 3600000; 

    container.innerHTML = ''; // コンテンツをクリア

    for (const station in timetableData) {
        const times = timetableData[station];
        
        // すべての時刻文字列をミリ秒に変換
        const timesMs = times.map(timeStr => timeStrToMs(timeStr));
        
        let nextTimeMs = null;
        
        // 1. 最も近い次の時刻を見つける
        for (const timeMs of timesMs) {
            if (timeMs >= currentTimeMs) {
                nextTimeMs = timeMs;
                break;
            }
        }

        // 2. フィルタリング範囲を決定
        // 最も近い時刻（nextTimeMs）がない場合、つまり最終電車後であれば、
        // 翌日（0時台）の始発を範囲に含めるため、nextTimeMsをリストの最初の要素とする
        if (nextTimeMs === null && timesMs.length > 0) {
            nextTimeMs = timesMs[0];
            // この場合、始発時刻から1時間以内を表示範囲とする
        }
        
        // 次の時刻が見つからなかった場合（時刻表が空など）はスキップ
        if (nextTimeMs === null) continue;


        // 3. 1時間以内の時刻をフィルタリング
        const filteredTimes = timesMs.filter(timeMs => {
            // nextTimeMs から 1時間後までの範囲内にある時刻を抽出
            return timeMs >= nextTimeMs && timeMs <= nextTimeMs + ONE_HOUR_MS;
        });
        
        
        // --- 4. 駅ブロックの作成と表示 ---
        const stationBlock = document.createElement('div');
        stationBlock.className = 'station-block';
        
        const stationTitle = document.createElement('h2');
        stationTitle.textContent = station;
        stationBlock.appendChild(stationTitle);

        const timesList = document.createElement('ul');
        timesList.className = 'times-list';
        
        // フィルタリングされた時刻を表示
        if (filteredTimes.length > 0) {
            filteredTimes.forEach(timeMs => {
                const timeStr = msToTimeStr(timeMs);
                const listItem = document.createElement('li');
                listItem.textContent = timeStr;

                // 最も近い次の時刻をハイライト
                if (timeMs === nextTimeMs) {
                    listItem.classList.add('next-time');
                }
                
                timesList.appendChild(listItem);
            });
        } else {
            // フィルタリングで何も残らなかった場合（通常は発生しないが安全策として）
            const listItem = document.createElement('li');
            listItem.textContent = '本日の運行は終了しました。';
            timesList.appendChild(listItem);
        }

        stationBlock.appendChild(timesList);
        container.appendChild(stationBlock);
    }
}

// ページロード時と、リアルタイム性を出すために30秒ごとに更新
generateTimetables();
setInterval(generateTimetables, 30000); // 30秒ごとに時刻表を更新

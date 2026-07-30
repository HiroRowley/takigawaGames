// =========================
// 最悪記録取得
// =========================

export async function getWorstScore() {
    const response = await fetch("/api/scores/worst");

    if (!response.ok) {
        throw new Error(`最悪記録の取得に失敗しました: ${response.status}`);
    }

    return response.json();
}

// =========================
// スコア保存
// =========================

export async function saveScore(score) {
    const response = await fetch("/api/scores", {
        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            score
        })
    });

    if (!response.ok) {
        throw new Error(`スコアの保存に失敗しました: ${response.status}`);
    }

    return response.json();
}
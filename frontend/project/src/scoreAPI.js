
// =========================
// 最悪記録取得
// =========================

export async function getWorstScore() {

    const response = await fetch(
        "http://localhost:8080/scores/worst"
    );

    return await response.json();
}

// =========================
// スコア保存
// =========================

export async function saveScore(score) {

    const response = await fetch(
        "http://localhost:8080/scores",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                score: score
            })
        }
    );

    return await response.json();
}

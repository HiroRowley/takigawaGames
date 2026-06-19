# TakigawaGames セットアップ手順

## 必要なもの

* PostgreSQL 16.13
* Java 17
* Node.js 24.15

---

## PostgreSQL の設定

psql にログイン後、以下を実行してください。

```sql
CREATE USER gamedata WITH PASSWORD 'gameDataPass';
CREATE DATABASE game_db OWNER gameData;
GRANT ALL PRIVILEGES ON DATABASE game_db TO gameData;
```

---

## ゲーム起動方法

`TakigawaGames.bat` をダブルクリックしてください。

初回起動時は少し時間がかかる場合があります。

ブラウザが自動で開いたら、そのままゲームを遊べます。

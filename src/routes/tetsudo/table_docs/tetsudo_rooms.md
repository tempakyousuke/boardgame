# tetsudo_rooms

ゲームのルーム情報を管理するテーブル。

| Column Name  | Type        | Constraints                     | Description                                     |
| :----------- | :---------- | :------------------------------ | :---------------------------------------------- |
| `id`         | `text`      | `PRIMARY KEY`                   | ルームの一意なID (CUID/UUID等)                  |
| `name`       | `text`      | `NOT NULL`                      | ルーム名 (部屋名)                               |
| `play_years` | `integer`   | `NOT NULL`                      | プレイ年数設定                                  |
| `status`     | `text`      | `NOT NULL`, `DEFAULT 'waiting'` | ゲームの状態 (`waiting`, `playing`, `finished`) |
| `created_at` | `timestamp` | `NOT NULL`, `DEFAULT now()`     | 作成日時                                        |
| `updated_at` | `timestamp` | `NOT NULL`, `DEFAULT now()`     | 更新日時                                        |

## 備考

- `status` カラムでゲームの進行状況を管理します。
- 作成時に `play_years` と `name` が設定されます。

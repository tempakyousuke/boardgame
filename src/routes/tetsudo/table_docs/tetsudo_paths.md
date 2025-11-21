# tetsudo_paths

マス同士の接続（線路）を管理するテーブル。双方向の移動が可能。

| Column Name  | Type   | Constraints   | Description                              |
| :----------- | :----- | :------------ | :--------------------------------------- |
| `id`         | `text` | `PRIMARY KEY` | パスの一意なID                           |
| `square1_id` | `text` | `NOT NULL`    | 接続するマス1のID (`tetsudo_squares.id`) |
| `square2_id` | `text` | `NOT NULL`    | 接続するマス2のID (`tetsudo_squares.id`) |

## 備考

- `square1_id` と `square2_id` の間に順序関係はありません（双方向移動可能）。
- アプリケーション側で隣接マスを取得する際は、両方のカラムを検索する必要があります。

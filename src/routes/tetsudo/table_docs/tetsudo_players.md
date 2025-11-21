# tetsudo_players

ゲームに参加するプレイヤー情報を管理するテーブル。ユーザーとルームの中間テーブルとしての役割も果たします。

| Column Name | Type        | Constraints                                   | Description                      |
| :---------- | :---------- | :-------------------------------------------- | :------------------------------- |
| `id`        | `text`      | `PRIMARY KEY`                                 | プレイヤー参加レコードの一意なID |
| `room_id`   | `text`      | `NOT NULL`, `FOREIGN KEY -> tetsudo_rooms.id` | 参加しているルームのID           |
| `user_id`   | `text`      | `NOT NULL`, `FOREIGN KEY -> user.id`          | 参加しているユーザーのID         |
| `is_host`   | `boolean`   | `NOT NULL`, `DEFAULT false`                   | ゲームマスター（ホスト）かどうか |
| `joined_at` | `timestamp` | `NOT NULL`, `DEFAULT now()`                   | 参加日時                         |

## 備考

- `user_id` は既存の `user` テーブルの `id` を参照します。
- 1つのルームに複数のプレイヤーが紐づきます。
- `is_host` が `true` のユーザーがそのルームの作成者（ゲームマスター）となります。

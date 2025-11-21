# tetsudo_squares

ゲームボード上のマス（駅、イベントマスなど）を管理するテーブル。

| Column Name | Type      | Constraints   | Description                                         |
| :---------- | :-------- | :------------ | :-------------------------------------------------- |
| `id`        | `text`    | `PRIMARY KEY` | マスの一意なID                                      |
| `type`      | `text`    | `NOT NULL`    | マスの種類 (`blue`, `red`, `property`, `card` など) |
| `name`      | `text`    |               | マスの表示名 (例: "東京駅")                         |
| `x`         | `integer` | `NOT NULL`    | 描画用のX座標                                       |
| `y`         | `integer` | `NOT NULL`    | 描画用のY座標                                       |
| `metadata`  | `text`    |               | 追加情報 (JSON形式などで格納)                       |

## 備考

- `type` によってマスの色やイベントが決まります。
- `x`, `y` はマップ画像上の相対座標または絶対座標として使用されます。

# tetsudo_properties

物件（お店、会社、土地など）を管理するテーブル。各物件は特定のマス（駅）に紐付きます。

| Column Name   | Type      | Constraints   | Description                                      |
| :------------ | :-------- | :------------ | :----------------------------------------------- |
| `id`          | `text`    | `PRIMARY KEY` | 物件の一意なID                                   |
| `square_id`   | `text`    | `NOT NULL`    | 物件が存在するマスのID (`tetsudo_squares.id`)    |
| `name`        | `text`    | `NOT NULL`    | 物件名 (例: "ラーメン屋")                        |
| `price`       | `integer` | `NOT NULL`    | 購入価格                                         |
| `profit_rate` | `integer` | `NOT NULL`    | 収益率 (%)                                       |
| `type`        | `text`    | `NOT NULL`    | 物件の業種 (`food`, `industry`, `commerce` など) |

## 備考

- 決算時には `price * (profit_rate / 100)` の収益が発生します。
- 1つのマス（駅）に複数の物件が紐付くことがあります。

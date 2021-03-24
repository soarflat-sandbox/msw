# msw（Mock Service Worker）

[Mock Service Worker](https://mswjs.io/)の学習用リポジトリ。

## msw とは

サービスワーカーを利用して、実際のリクエストをインターセプトする API モックライブラリ。

## インストール

```shell
$ npm install msw --save-dev
# or
$ yarn add msw --dev
```

## REST API のモック

以下の`rest.post`のようにリクエストハンドラを定義することで、指定したリクエストをインターセプトし、それに対するレスポンスを定義できる。

```js
import { rest } from 'msw';

// モッキングするリクエストを指定する
export const handlers = [
  /**
   * req: マッチしたリクエストに関する情報
   * res：モックアップされたレスポンスを作成するためのユーティリティ
   * ctx: モックアップされたレスポンスのステータスコード、ヘッダー、ボディなどを設定するための関数群
   */
  rest.post('/login', (req, res, ctx) => {
    // ユーザーの認証をセッションに残す
    sessionStorage.setItem('is-authenticated', 'true');
    // インターセプトしたリクエストに対してレスポンスを返すには res（レスポンスリゾルバ）を実行して、レスポンスを指定する。
    return res(
      // ステータスコードを 200 でレスポンスを返す
      ctx.status(200)
    );
  }),

  rest.get('/user', (req, res, ctx) => {
    // ユーザーがこのセッションで認証されているかどうかを確認する
    const isAuthenticated = sessionStorage.getItem('is-authenticated');
    if (!isAuthenticated) {
      // 認証されていない場合、エラーを返す
      return res(
        ctx.status(403),
        ctx.json({
          errorMessage: 'Not authorized',
        })
      );
    }
    // 認証されている場合、ユーザー情報を返す
    return res(
      ctx.status(200),
      ctx.json({
        username: 'admin',
      })
    );
  }),
];
```

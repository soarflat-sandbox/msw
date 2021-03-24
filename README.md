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

## モックサーバーのセットアップ

Jest でモック API を動作させたい場合、以下のようにモックサーバーを構成する。

```js
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// 引数で渡したリクエストハンドラ（handlers）が動作するモックサーバーを構成する。
export const server = setupServer(...handlers);
```

そして、テストコードに以下のように記述することで、リクエストをインターセプトするモックサーバーが起動する。

```js
// すべてのテストの前に、APIのモッキングを確立する。
beforeAll(() => server.listen());

// テスト中に追加したリクエストハンドラをリセットして、他のテストに影響を与えないようにする。
afterEach(() => server.resetHandlers());

// クリーンアップ
afterAll(() => server.close());
```

ドキュメントにも書いてあるが、実際にはサーバーが起動するわけではない（サーバーという表現の方がわかりやすいのでサーバーという言葉を用いている）。

> Although there is "server" in setupServer, the library does not establish any actual servers, but operates by augmenting native request issuing modules (such as https or XMLHttpRequest). The namespace is chosen for what the logic represents, not how it works internally.

インターセプターが動作しているとイメージすると良いかもしれない。

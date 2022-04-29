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

  rest.post('/login2', (req, res, ctx) => {
    const { username } = req.body;

    return res(
      ctx.json({
        id: 'f79e82e8-c34a-4dc7-a49e-9fadc0979fda',
        username,
        firstName: 'John',
        lastName: 'Maverick',
      })
    );
  }),
];

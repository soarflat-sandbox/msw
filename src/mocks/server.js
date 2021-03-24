import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// 引数で渡したリクエストハンドラ（handlers）が動作するモックサーバーを構成する。
export const server = setupServer(...handlers);

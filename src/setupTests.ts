// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

import { server } from './mocks/server.js';

// すべてのテストの前に、APIのモッキングを確立する。
beforeAll(() => server.listen());

// テスト中に追加したリクエストハンドラをリセットして、他のテストに影響を与えないようにする。
afterEach(() => server.resetHandlers());

// クリーンアップ
afterAll(() => server.close());

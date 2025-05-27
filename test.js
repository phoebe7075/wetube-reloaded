import { pathToRegexp } from 'path-to-regexp'; // ESM 방식
// 또는 const { pathToRegexp } = require('path-to-regexp'); // CJS 방식 (프로젝트 설정에 따라)

const path = '/:id(\\d+)'; // userRouter.js의 문제되는 경로
// const path = '/users/:id(\\d+)'; // server.js에서 마운트된 최종 경로로도 테스트

try {
    const keys = [];
    const regexp = pathToRegexp(path, keys);
    console.log('Regex:', regexp);
    console.log('Keys:', keys);
    console.log('Path parsed successfully!');
} catch (error) {
    console.error('Error parsing path:', error);
}
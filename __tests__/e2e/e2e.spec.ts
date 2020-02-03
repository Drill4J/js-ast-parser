import axios from 'axios';
import { readFileSync } from 'fs';

const URl = 'http://localhost:8080';
const rootFolder = './__tests__/fixtures/todomvc';
const uuid = '6b46ea8e-28e8-4fa0-b535-f1fc95f1fad4';
const expected = readJsonFile(`${rootFolder}/single/expected.json`);

test('e2e test', async () => {
  const coverage = readJsonFile(`${rootFolder}/single/coverage.json`);

  let res = await axios.post('http://localhost:8080/coverage', coverage);

  expect(res.status).toBe(200);

  res = await axios.get(`http://localhost:8080/coverage?uuid=${uuid}`);

  expect(res.status).toBe(200);
  expect(res.data).toEqual(expected);
});

function readJsonFile(name) {
  return JSON.parse(readFileSync(name, 'utf-8'));
}

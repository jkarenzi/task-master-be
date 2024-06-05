import { test } from '../src/controllers/testController';

const res: any = {};

(res.json = jest.fn((x: Object) => x)),
  (res.status = jest.fn((x: number) => res));

const req: any = {
  body: {
    name: 'test',
  },
};

describe('Test', () => {
  it('should return 200 successful upon testing route', async () => {
    await test(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});

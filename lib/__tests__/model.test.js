import { Model, instanceOf } from '../model';

class Dated extends Model {
  static schema = {
    date: instanceOf(Date),
  };
}

test('serialize/deserialize model with Date member', () => {
  const dated = new Dated({ date: new Date() });
  const datedJs = dated.toJS();
  const datedRehydrated = new Dated(datedJs);
  expect(datedRehydrated.date).toBeInstanceOf(Date);
});

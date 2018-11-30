import { Model, instanceOf, deserialize } from '../model';

class Dated extends Model {
  static schema = {
    date: instanceOf(Date),
  };
}

Dated.register();

test('instantiate model with Date member', () => {
  const dated = new Dated({ date: new Date() });
  expect(dated.date).toBeInstanceOf(Date);
});

test('instantiate model with Date member with no date', () => {
  const dated = new Dated();
  expect(dated.date).toBeUndefined();
});

test('serialize/deserialize', () => {
  const dated = new Dated({ date: new Date() });
  const ser = dated.serialize();
  const deser = deserialize(ser);
  expect(deser).toBeInstanceOf(Dated);
});

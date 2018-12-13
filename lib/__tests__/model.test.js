import { Model, instanceOf, toModel } from '../model';
import { serialize, deserialize } from '../serialize';

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
  const ser = serialize(dated);
  const deser = toModel(deserialize(ser));
  expect(deser).toBeInstanceOf(Dated);
});

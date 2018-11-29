import PropTypes from 'prop-types';

const classesForName = {};

const classForName = name => classesForName[name];

export const deserialize = json => toModel(JSON.parse(json));

const toModel = obj => {
  const ModelClass = classForName(obj._c_);
  if (ModelClass) {
    return new ModelClass(obj);
  }
  throw new Error(`Could not convert to model: ${JSON.stringify(obj)}`);
};

const coerce = (propsRaw, schema) => {
  const props = {};
  Object.keys(schema).forEach(key => {
    const val = propsRaw[key];
    if (val && schema[key]._c_) {
      const Clazz = classForName(schema[key]._c_);
      if (Clazz && !(val instanceof Clazz)) {
        props[key] = new Clazz(val);
      } else {
        props[key] = val;
      }
    } else {
      props[key] = val;
    }
  });
  return props;
};

export class Model {
  constructor(propsRaw = {}, editable = false) {
    const { schema, defaultValues = {}, name } = this.constructor;

    const props = coerce(propsRaw, schema);

    PropTypes.checkPropTypes(schema, props, 'prop', name);

    classesForName[name] = this.constructor;

    Object.defineProperty(this, '_props_', { value: {}, writable: false, enumerable: false });
    Object.defineProperty(this, '_updates_', { value: {}, writable: false, enumerable: false });
    Object.defineProperty(this, '_c_', { value: name, writable: false, enumerable: true });

    Object.keys(schema).forEach(key => {
      const val = props[key] === undefined ? defaultValues[key] : props[key];
      if (val !== undefined) {
        this._props_[key] = val;
      }

      Object.defineProperty(this, key, {
        enumerable: true,
        get() {
          return this._updates_[key] === undefined ? this._props_[key] : this._updates_[key];
        },
        set(value) {
          if (editable) {
            if (value !== this._updates_[key]) {
              this._updates_[key] = value;
            }
          } else {
            throw new Error(`Not writable: ${name}.${key}`);
          }
        },
      });
    });
  }

  updates() {
    return this._updates_;
  }

  resetUpdates() {
    Object.keys(this._updates_).forEach(key => {
      this._props_[key] = this._updates_[key];
      delete this._updates_[key];
    });
  }

  serialize() {
    return JSON.stringify(this);
  }

  toJS() {
    return JSON.parse(JSON.stringify(this));
  }
}

export const {
  any,
  array,
  bool,
  func,
  number,
  object,
  string,
  node,
  element,
  symbol,
  oneOf,
  oneOfType,
  arrayOf,
  objectOf,
  shape,
  exact,
} = PropTypes;

export const instanceOf = Clazz => {
  const InstanceOf = PropTypes.instanceOf;
  const fn = new InstanceOf(Clazz);
  if (Clazz) {
    console.log('Clazz', Clazz.name, Clazz);
    fn._c_ = Clazz.name;
    classesForName[Clazz.name] = Clazz;
  }
  return fn;
};

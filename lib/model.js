import PropTypes from 'prop-types';
import md5 from 'md5';

const registeredClasses = {};

export const deserialize = json => toModel(JSON.parse(json));

const toModel = val => {
  if (val instanceof Array) {
    const arr = val;
    return arr.map(toModel);
  }
  if (val && typeof val === 'object') {
    const obj = val;
    Object.keys(obj).forEach(k => {
      obj[k] = toModel(obj[k]);
    });
    const { _h_ } = obj;
    if (_h_) {
      const Clazz = registeredClasses[_h_];
      if (Clazz) {
        return new Clazz(obj);
      }
      throw new Error(`Unknown model hash: ${_h_}`);
    }
  }
  return val;
};

export class Model {
  constructor(props = {}, editable = false) {
    const { schema, defaultValues = {}, name } = this.constructor;

    PropTypes.checkPropTypes(schema, props, 'prop', name);

    this.constructor.register();

    Object.defineProperty(this, '_props_', { value: {}, writable: false, enumerable: false });
    Object.defineProperty(this, '_updates_', { value: {}, writable: false, enumerable: false });
    Object.defineProperty(this, '_h_', { value: this.constructor.hash(), writable: false, enumerable: true });

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

  static register() {
    const hash = this.hash();
    if (registeredClasses[hash] && registeredClasses[hash] !== this) {
      throw new Error('Attempt to overwrite registeredClass');
    }
    registeredClasses[this.hash()] = this;
  }

  static hashIgnore(key) {
    this._hash_ignores_ = this._hash_ignores_ || [];
    this._hash_ignores_.push(key);
  }

  static hash() {
    const { schema, _hash_ignores_: hashIgnores = [] } = this;
    return md5(
      Object.keys(schema)
        .filter(key => !hashIgnores.includes(key))
        .sort()
        .join(' ')
    );
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
  instanceOf,
  symbol,
  oneOf,
  oneOfType,
  arrayOf,
  objectOf,
  shape,
  exact,
} = PropTypes;

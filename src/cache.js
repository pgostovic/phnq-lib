export class Cache {
  constructor() {
    this.entries = {};
    this.cacheTime = 60 * 60 * 1000; // 1 hour
  }

  get(key) {
    const entry = this.entries[key];
    if (entry) {
      if (Date.now() > entry.staleTime) {
        delete this.entries[key];
        return null;
      }
      return entry.value;
    }
    return (this.entries[key] || {}).value;
  }

  put(key, value, options = {}) {
    const opts = { postPut: true, ...options };

    this.entries[key] = { value, staleTime: Date.now() + this.cacheTime };
    if (opts.postPut) {
      this.postPut(key, value);
    }
    return value;
  }

  prune() {
    const toRemove = [];
    const now = Date.now();
    Object.keys(this.entries).forEach(k => {
      if (now > this.entries[k].staleTime) {
        toRemove.push(k);
      }
    });
    console.info(`Pruning cache ${this.storageKey}: removing ${toRemove.length} entries`);
    toRemove.forEach(k => delete this.entries[k]);
  }

  postPut() {
    if (this) {
      throw new Error('Implement in sublclass');
    }
  }
}

export class MemoryCache extends Cache {
  postPut() { } // eslint-disable-line
}

export class StorageCache extends Cache {
  constructor(storageKey) {
    super();
    this.storageKey = storageKey;
    this.persistPid = null;

    const serializedEntries = window.localStorage[this.storageKey];
    if (serializedEntries) {
      console.log(`Hydrating cache ${this.storageKey} (${serializedEntries.length} chars)`);
      this.entries = JSON.parse(serializedEntries);
    }
  }

  postPut() {
    if (this.persistPid) {
      clearTimeout(this.persistPid);
    }

    this.persistPid = setTimeout(() => {
      try {
        window.localStorage[this.storageKey] = JSON.stringify(this.entries);
      } catch (error) {
        if (error.name === 'QuotaExceededError') {
          this.prune();
          window.localStorage[this.storageKey] = JSON.stringify(this.entries);
        }
      }
      this.persistPid = null;
    }, 1000);
  }
}

export class updateEventTarget extends EventTarget{
  on(event, callback) {
    this.addEventListener(event, callback);
    return () => {
      this.removeEventListener(event, callback);
    }
  }
  emit(event, data) {
    let emit = (evt,data)=>data?
    this.dispatchEvent(new CustomEvent(evt, { detail: data })):
    this.dispatchEvent(new Event(evt));
    data?emit(event,data):emit(event);
    data?emit("debug",{event,data}):emit("debug",{event});
    data?emit("debug:"+event,data):emit("debug:"+event);
  }
}

export class localStorageDbItem {
  constructor(localStorageParent, key) {
    this.parent = localStorageParent;
    this.key = key;
    this.Change = this.ItemEvent("Change");
    this.init = this.ItemEvent("init");
    this.Storage = this.parent.Storage("Update");
  }
  get data() {
    return localStorage.getItem(this.key)
  }
  set data(data) {
    const {emit} = this.Change;
    if (typeof data != "string") throw "require type string for save"
    localStorage.setItem(this.key, data);
    emit(this);
  }
  defaultData(defaultData) {
    const {emit} = this.init;
    if (defaultData && this.data == null) this.data = defaultData;
    emit(this);
    return this;
  }
  Destroy() {
    this.parent.keys = this.parent.keys.filter(e => {
      localStorage.removeItem(e.key);
      return e.key != this.key;
    }).map(e => e.getBase())
  }
  getBase() {
    return { key: this.key }
  }
  toJSON(data) {
    return JSON.parse(data ? data : this.data);
  }
  toString(data) {
    return data ? JSON.stringify(data) : this.data;
  }
  StorageUpdate(fns) {
    return this.Storage.on(({ detail: { key, newValue, oldValue } }) => {
      if (key == this.key) fns({ newValue, oldValue });
    })
  }
  ItemEvent(type){
    return {
      on:(callback)=>this.on(this.key+":"+type,callback),
      emit:(data)=>this.emit(this.key+":"+type,data)
    }
  }
  on(event, callback) {
    return this.parent.on(event, callback);
  }
  emit(event, data) {
    this.parent.emit(event, data)
  }
}

export default class localStorageDb extends updateEventTarget {
  constructor() {
    super();
    this._keys = [];
    const {emit:emitUpdate} = this.Storage("Update");
    const {emit:emitClear} = this.Storage("Clear");
    window.addEventListener("storage", ({ key, newValue, oldValue }) =>key!==null?
      emitUpdate({ key, newValue, oldValue }):
      emitClear()
    )
  }
  get keys() {
    return this._keys.map(({ key }) => new localStorageDbItem(this, key))
  }
  set keys(data) {
    if(!Array.isArray(data))throw "not is array";
    this._keys = data.map(e=>e.key?e.getBase():e);
  }
  get(key) {
    const Item = this.keys.find((e) => e.key == key);
    if (!Item) throw "not exist element"
    return Item
  }
  add(key) {
    if (typeof key !== "string") throw "require key type string";
    const Item = new localStorageDbItem(this, key);
    this.keys = [...this.keys, Item];
    this.emit("add", Item)
    return Item;
  }
  clear() {
    localStorage.clear();
    this.emit("clear");
  }
  Storage(type){
    return {
      emit:(data)=>this.emit("Storage:"+type,data),
      on:(callback)=>this.on("Storage:"+type,callback)
    };
  }
}
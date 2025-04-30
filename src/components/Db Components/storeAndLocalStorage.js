import localStorageDb from "./localStorage";
import Store from "./store"

export default class StoreUseLocalStorage extends Store {
  constructor(fnsUnsuscribe) {
    super((setInternalStore) => {
      this.Keys = new localStorageDb();
      const {on:onClear} = this.Keys.Storage("Clear")
      const store = this.Keys.add("store").defaultData("[]")
      setInternalStore(store.toJSON());
      store.StorageUpdate(({ newValue: data }) => {
        if (!document.hasFocus()) setInternalStore(store.toJSON(data))
      })
      onClear(()=>setInternalStore([]));
      return fnsUnsuscribe;
    });
    this.Destroy = this.subscribe((data) => {
      const store = this.Keys.get("store");
      store.data = store.toString(data);
    })
    this.subscribe(e=>{if(e.length==0)this.emit("void")})
  }
}
export class EventTargetStorage extends EventTarget{
    constructor(){
        super();
        this._emit = (evt,data)=>data?
            this.dispatchEvent(new CustomEvent(evt, { detail: data })):
            this.dispatchEvent(new Event(evt));
    }
    on(event, callback) {
        this.addEventListener(event, callback);
        return () => this.removeEventListener(event, callback);
    }
    emit(event, data) {
        data?emit(event,data):emit(event);
    }
}
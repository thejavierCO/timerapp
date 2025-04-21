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

export class Clock extends updateEventTarget {
  constructor() {
    super();
    this._status = false;
    this.idCancel = 0;
  }
  get currentTime() {
    return new Date().getTime();
  }
  init = () => {
    this.emit("clock", this.currentTime)
    this.idCancel = window.requestAnimationFrame(this.init);
    return this;
  };
  Cancel = () => {
    window.cancelAnimationFrame(this.idCancel);
    this.idCancel = 0;
    return this;
  };
  subscribe(fns) {
    let unsus = this.on("clock", ({ detail }) => {
      try{fns(detail)}catch(e){unsus();throw e;}
    });
  }
}

export default class Timer extends Clock {
  constructor({ milliseconds,seconds,time ,status }) {
    super();
    this.time = time || { start: 0, pause: 0, end: 0 };
    this.posicion = 0;
    this.status = status || "Stop";
    if(seconds) this.seconds = seconds;
    else this.milliseconds = milliseconds || 0;
  }
  get posicion(){
    return this._posicion;
  }
  set posicion(update){
    if(typeof update !== "number")throw "Not number";
    if(Number.isNaN(update))throw "Not a number";
    this._posicion = update;
    this.emit("posicion",update);
  }
  get time() {
    return this._time;
  }
  set time(time) {
    if(typeof time !== "object")throw "Not object";
    if(Array.isArray(time))throw "Require object";
    let {start,pause,end} = time;
    if(typeof start !== "number"&&!Number.isNaN(start))throw "Not number";
    if(typeof pause !== "number"&&!Number.isNaN(pause))throw "Not number";
    if(typeof end !== "number"&&!Number.isNaN(end))throw "Not number";
    this._time = time;
    this.emit("time",time);
  }
  get status() {
    return this._status
  }
  set status(state) {
    const fnsState = {
      Play: "Play",
      Stop: "Stop",
      Pause: "Pause"
    }
    if(!fnsState.hasOwnProperty(state))throw "not exist state "+state;
    this._status = fnsState[state];
    this.emit("status",state);
  }
  
  get milliseconds(){
    return this._milliseconds;
  }
  set milliseconds(millis){
    if(typeof millis !== "number")throw "Not number";
    return this._milliseconds = millis;
  }
  get seconds(){
    return this._milliseconds/1000;
  }
  set seconds(seconds){
    if(typeof seconds !== "number")throw "Not number";
    this._milliseconds = seconds * 1000;
  }

  loop = (fns)=>{
    let call = (data)=>fns&&typeof fns == "function"?fns(data):this.emit("Playing", data);
    if(this.status=="Play")this.init();
    if(this.status=="Pause"){
      call(this.time.end - this.time.pause)
    }
    this.subscribe((t) => {
      if(this.status=="Play"){
        const {end} = this.time;
        if(!Number.isNaN(end)){
          this.posicion = end - t;
          if(this.posicion <= 0)this.Stop();
          call(this.posicion);
        }else throw "not exist end";
      }else if(this.posicion!=0&&this.status=="Stop"){
        this.posicion = 0;
        call(this.posicion)
      }
    });
  }

  Play = (fns)=>{
    if (this.status=="Play") return this.emit("Error","isPlaying");
    this.status = "Play";
    let { start ,pause ,end} = this.time;
    const millis = this.milliseconds || 0;
    const currentTime = this.currentTime;
    if (pause != 0) {
      let posPause = Math.round(pause - start),
        timePause = end - start,
        timeOff = timePause - posPause;
      start = currentTime;
      end = start + timeOff 
      this.time = { start, pause: 0, end};
    } else if (pause == 0 || (start == 0 && end == 0)) {
      start = currentTime;
      this.time = { start, pause: 0, end: start + millis }
    }
    this.posicion = end - start;
    this.emit("Play");
    if(fns&&typeof fns === "function")fns();
    this.init();
  }
  Stop = (fns)=>{
    if (this.status=="Stop") return this.emit("Error","isStopped");
    this.status = "Stop";
    this.time = { start: 0, pause: 0, end: 0 };
    this.posicion = 0;
    this.emit("Stop");
    if(fns&&typeof fns === "function")fns();
    this.Cancel();
  }
  Pause = (fns)=>{
    let { start ,pause ,end} = this.time;
    const currentTime = this.currentTime;
    if (this.status=="Pause") return this.emit("Error","isPaused");
    this.status = "Pause";
    if (pause == 0) this.time = { start, pause: currentTime, end }
    this.posicion = end - pause;
    this.emit("Pause")
    if(fns&&typeof fns === "function")fns();
    this.Cancel();
  }
}
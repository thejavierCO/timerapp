export class Clock extends EventTarget {
  constructor() {
    super();
    this._currentTime = 0;
    const updateClock = () => {
      this._currentTime = new Date().getTime();
      this.emit("clock", this._currentTime)
      window.requestAnimationFrame(updateClock);
    };
    updateClock();
  }
  subscribe(fns) {
    let unsus = this.on("clock", ({ detail }) => {
      try{
        fns(detail);
      }catch(e){
        unsus();
        throw e;
      }
    });
  }
  get currentTime() {
    return this._currentTime
  }
  on(event, callback) {
    this.addEventListener(event, callback);
    return () => {
      this.removeEventListener(event, callback);
    }
  }
  emit(event, data) {
    return this.dispatchEvent(new CustomEvent(event, { detail: data }));
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
    this.emit("Posicion",this.Posicion)
  }
  get time() {
    return this._time;
  }
  set time(time) {
    if(typeof time !== "object")throw "Not object"
    this._time = time;
    this.emit("Time", this._time);
  }
  get status() {
    return this._status
  }
  set status(state) {
    const fnsState = {
      Play: this.Play,
      Stop: this.Stop,
      Pause: this.Pause
    }
    if(!fnsState.hasOwnProperty(state))throw "not exist state "+state;
    fnsState[state]();
    this.emit("Status", this.status);
    this.emit(state);
  }
  
  get milliseconds(){
    return this._milliseconds;
  }
  set milliseconds(millis){
    return this._milliseconds = millis;
  }
  get seconds(){
    return this._milliseconds/1000;
  }
  set seconds(seconds){
    if(seconds) this._milliseconds = seconds * 1000;
  }

  loop = (fns)=>{
    let call = (data)=>fns&&typeof fns == "function"?fns(data):this.emit("Playing", data);
    return this.subscribe((t) => {
      if(this.status=="Play"){
        const {end} = this.time;
        if(!Number.isNaN(end)){
          this.posicion = end - t;
          if(this.posicion <= 0) this.status = "Stop";
          call(this.posicion);
        }else{
          console.log(end,this.milliseconds)
        }
      }else if(this.posicion!=0&&this.status=="Stop"){
        this.posicion = 0;
        call(this.posicion)
      }
    });
  }
  Play = ()=>{
    if (this.status=="Play") return this.emit("Error","isPlaying");
    this._status = "Play";
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
  }
  Stop = ()=>{
    if (this.status=="Stop") return this.emit("Error","isStopped");
    this._status = "Stop";
    this.time = { start: 0, pause: 0, end: 0 };
    this.posicion = 0;
  }
  Pause = ()=>{
    let { start ,pause ,end} = this.time;
    const currentTime = this.currentTime;
    if (this.status=="Pause") return this.emit("Error","isPaused");
    this._status = "Pause";
    if (pause == 0) this.time = { start, pause: currentTime, end }
    this.posicion = end - pause;
  }
}
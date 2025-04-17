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
    return this.on("clock", ({ detail }) => fns(detail));
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
  constructor(milliseconds) {
    super();
    this._time = { start: 0, pause: 0, end: 0 };
    this._posicion = 0;
    this._status = "Stop";
    this._milliseconds = milliseconds | 0;
  }
  get CurrentPosicion(){
    return this._posicion;
  }
  get time() {
    return this._time;
  }
  get status() {
    return this._status
  }
  set time(time) {
    this._time = time;
    this.emit("Time", this._time);
  }
  set status(state) {
    const fnsState = {
      Play: this.Play,
      Stop: this.Stop,
      Pause: this.Pause
    }
    if(!fnsState.hasOwnProperty(state))throw "not exist state";
    fnsState[state]();
    this.emit("Status", this.status);
    this.emit(state);
  }
  
  get milliseconds(){
    return this._milliseconds
  }

  seconds = (seconds)=>{
    this._milliseconds = seconds * 1000;
    return this;
  }

  loop = ()=>{
    this.subscribe((t) => {
      if (this.status == "Play") {
        this._posicion = this.time.end - t;
        this.emit("Playing", this._posicion);
        if (this._posicion <= 0) this.status = "Stop";
      }else if(this._posicion!=0&&this.status=="Stop"){
        this._posicion = 0;
      }
    });
  }
  Play = ()=>{
    if (this.status=="Play") return this.emit("Error","isPlaying");
    this._status = "Play";
    let { start ,pause ,end} = this.time;
    const currentTime = this.currentTime;
    if (pause != 0) {// is pause
      let posPause = Math.round(pause - start),
        timePause = end - start,
        timeOff = timePause - posPause;
      start = currentTime;
      end = start + timeOff 
      this.time = { start, pause: 0, end};
    } else if (pause == 0 || (start == 0 && end == 0)) {
      start = currentTime;
      this.time = { start, pause: 0, end: start + this.milliseconds }
    }
    this._posicion = end - start;
  }
  Stop = ()=>{
    if (this.status=="Stop") return this.emit("Error","isStopped");
    this._status = "Stop";
    this.time = { start: 0, pause: 0, end: 0 };
    this._posicion = 0;
  }
  Pause = ()=>{
    let { start ,pause ,end} = this.time;
    const currentTime = this.currentTime;
    if (this.status=="Pause") return this.emit("Error","isPaused");
    this._status = "Pause";
    if (pause == 0) this.time = { start, pause: currentTime, end }
    this._posicion = end - pause;
  }
}
export class AudioManager {
  private audio: HTMLAudioElement | null = null;
  private currentSession: any = null;
  private listeners: Set<(event: string, data?: any) => void> = new Set();

  constructor() {
    this.audio = new Audio();
    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.audio) return;

    this.audio.addEventListener('loadstart', () => this.emit('loadstart'));
    this.audio.addEventListener('canplay', () => this.emit('canplay'));
    this.audio.addEventListener('play', () => this.emit('play'));
    this.audio.addEventListener('pause', () => this.emit('pause'));
    this.audio.addEventListener('ended', () => this.emit('ended'));
    this.audio.addEventListener('timeupdate', () => {
      this.emit('timeupdate', {
        currentTime: this.audio?.currentTime || 0,
        duration: this.audio?.duration || 0
      });
    });
    this.audio.addEventListener('error', (e) => this.emit('error', e));
  }

  loadSession(session: any) {
    if (!this.audio) return;
    
    this.currentSession = session;
    this.audio.src = session.audioUrl;
    this.audio.load();
  }

  play() {
    if (!this.audio) return Promise.reject('No audio element');
    return this.audio.play();
  }

  pause() {
    if (!this.audio) return;
    this.audio.pause();
  }

  stop() {
    if (!this.audio) return;
    this.audio.pause();
    this.audio.currentTime = 0;
  }

  setCurrentTime(time: number) {
    if (!this.audio) return;
    this.audio.currentTime = time;
  }

  getCurrentTime(): number {
    return this.audio?.currentTime || 0;
  }

  getDuration(): number {
    return this.audio?.duration || 0;
  }

  isPlaying(): boolean {
    return this.audio ? !this.audio.paused : false;
  }

  setVolume(volume: number) {
    if (!this.audio) return;
    this.audio.volume = Math.max(0, Math.min(1, volume));
  }

  getVolume(): number {
    return this.audio?.volume || 1;
  }

  addEventListener(callback: (event: string, data?: any) => void) {
    this.listeners.add(callback);
  }

  removeEventListener(callback: (event: string, data?: any) => void) {
    this.listeners.delete(callback);
  }

  private emit(event: string, data?: any) {
    this.listeners.forEach(callback => callback(event, data));
  }

  destroy() {
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
      this.audio.load();
    }
    this.listeners.clear();
  }
}

export const audioManager = new AudioManager();

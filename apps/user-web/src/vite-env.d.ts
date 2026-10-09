/// <reference types="vite/client" />

declare module 'three/addons/misc/Timer.js' {
  export class Timer {
    constructor();
    connect(document: Document): void;
    disconnect(): void;
    getDelta(): number;
    getElapsed(): number;
    getTimescale(): number;
    setTimescale(timescale: number): this;
    reset(): this;
    dispose(): void;
    update(timestamp?: number): this;
  }
}

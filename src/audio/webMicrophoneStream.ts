export type AudioBufferFrame = {
  data: ArrayBuffer;
  sampleRate: number;
  channels: number;
  timestamp: number;
};

export class WebMicrophoneStream {
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private startTime = 0;

  constructor(private readonly onBuffer?: (buffer: AudioBufferFrame) => void) {}

  async start(): Promise<void> {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      throw new Error('Microphone is not supported in this browser.');
    }

    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: false,
      },
    });

    this.audioContext = new AudioContext({ sampleRate: 44100 });
    await this.audioContext.resume();
    this.startTime = this.audioContext.currentTime;

    this.source = this.audioContext.createMediaStreamSource(this.mediaStream);
    this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);

    this.processor.onaudioprocess = (event) => {
      if (!this.audioContext || !this.onBuffer) {
        return;
      }

      const channel = event.inputBuffer.getChannelData(0);
      const samples = new Float32Array(channel);
      this.onBuffer({
        data: samples.buffer,
        sampleRate: this.audioContext.sampleRate,
        channels: 1,
        timestamp: this.audioContext.currentTime - this.startTime,
      });
    };

    this.source.connect(this.processor);
    this.processor.connect(this.audioContext.destination);
  }

  stop(): void {
    this.processor?.disconnect();
    this.source?.disconnect();
    this.processor = null;
    this.source = null;
    this.mediaStream?.getTracks().forEach((track) => track.stop());
    this.mediaStream = null;
    void this.audioContext?.close();
    this.audioContext = null;
  }
}

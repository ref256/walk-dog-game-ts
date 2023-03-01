export type Sound = {
    buffer: AudioBuffer;
};

export class Audio {
    private _context: AudioContext;

    constructor() {
        this._context = new AudioContext();
    }

    async loadSound(filename: string): Promise<Sound> {
        const sound = await fetch(filename);
        const soundBuffer = await sound.arrayBuffer();
        const decodedArray = await this._context.decodeAudioData(soundBuffer);

        return {buffer: decodedArray};
    }

    playSound(sound: Sound, looping?: boolean) {
        const trackSource = this._context.createBufferSource();
        trackSource.buffer = sound.buffer;
        const gainNode = this._context.createGain();
        gainNode.gain.value = 0.25;
        trackSource.connect(gainNode).connect(this._context.destination);
        if (looping) {
            trackSource.loop = true;
        }

        trackSource.start();
    }
}

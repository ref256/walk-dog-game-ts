export function getContext() {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement | null;
    if (!canvas) {
        throw new Error('No Canvas Element found');
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        throw new Error('No 2d context found');
    }
    return ctx;
}

export function getNow() {
    const performance = window?.performance;
    if (!performance) {
        throw new Error('Performace object not found');
    }
    return performance.now();
}

export async function loadImage(source: string) {
    const image: HTMLImageElement = new Image();
    return new Promise((res: (result: HTMLImageElement) => void, rej: OnErrorEventHandler) => {
        image.onload = () => res(image);
        image.onerror = rej;
        image.src = source;
    });
}

export function findHtmlElementById(id: string) {
    const element = document.getElementById(id);
    if (!element) {
        throw new Error(`Element with id ${id} not found`);
    }
    return element;
}

export function drawUi(html: string) {
    findHtmlElementById('ui').insertAdjacentHTML('afterbegin', html);
}

export function hideUi() {
    const ui = findHtmlElementById('ui');
    if (ui.firstChild) {
        ui.removeChild(ui.firstChild);
        document.getElementById('canvas')?.focus();
    }
}

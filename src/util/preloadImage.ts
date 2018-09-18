let preloads: any = {};

function preloadImage(name: string, expectedWidth: number, expectedHeight: number, delay: number) {
  let img: HTMLImageElement = new Image();
  preloads[name] = img;
  let timeout;
  let errorHandler = () => {
    clearTimeout(timeout);
    img.onerror = null;
    img.onabort = null;
    img.onload = null;
    setTimeout(preloadImage.bind(null, name, expectedWidth, expectedHeight, Math.min(delay+100, 5000)), delay);
  };
  img.onerror = (err) => {
    let message = err ? err.message : null;
    console.warn(`WARNING: failed to load image ${name}: ${message}`);
    errorHandler();
  };
  timeout = setTimeout(() => {
    console.warn(`WARNING: timed out trying to load image ${name}: ${1000+delay}ms`);
    errorHandler();
  }, 1000+delay);
  img.onabort = () => {
    console.warn(`WARNING: image load aborted for image ${name}`);
    errorHandler();
  };
  img.onload = () => {
    clearTimeout(timeout);
    if (img.width !== expectedWidth || img.height !== expectedHeight) {
      console.warn(`WARNING: image size doesn't match for image ${name}: expected ${expectedWidth}x${expectedHeight}, got ${img.width}x${img.height}`);
      errorHandler();
    }
  };
  img.src = `/assets/imgs/${name}.png`;
}

export {preloadImage, preloads};

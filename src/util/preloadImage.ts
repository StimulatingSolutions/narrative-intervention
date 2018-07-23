let preloads: any = {};

function preloadImage(name: string, expectedWidth: number, expectedHeight: number, delay: number) {
  let img: HTMLImageElement = new Image();
  preloads[name] = img;
  let timeout;
  img.onerror = () => {
    img.onerror = null;
    img.onabort = null;
    img.onload = null;
    clearTimeout(timeout);
    setTimeout(preloadImage.bind(null, name, Math.min(delay+100, 5000)), delay);
  };
  timeout = setTimeout(img.onerror, 1000+delay);
  img.onabort = <(UIError)=>any> img.onerror;
  img.onload = () => {
    if (img.width !== 1104 || img.width !== 1104) {
      img.onerror(null);
    }
  };
  img.src = `/assets/imgs/${name}.png`;
}

export {preloadImage, preloads};

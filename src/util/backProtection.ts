import {Platform} from "ionic-angular";

let backBusterCount: number = 1;

function enableBackProtection(platform: Platform) {
  platform.registerBackButtonAction(() => {});

  let parts: string[] = window.location.href.split('#');
  let fragment: string = parts[1] ? '#'+parts[1] : '';
  let currLoc = parts[0].split('?')[0];
  window.history.pushState(null, null, currLoc+`?backBuster${backBusterCount++}${fragment}`);
  window.history.pushState(null, null, currLoc+`?backBuster${backBusterCount++}${fragment}`);
  window.history.pushState(null, null, currLoc+`?backBuster${backBusterCount++}${fragment}`);
  window.history.pushState(null, null, currLoc+`?backBuster${backBusterCount++}${fragment}`);
  window.addEventListener('popstate', (event) => {
    window.history.pushState(null, null, currLoc+`?backBuster${backBusterCount++}${fragment}`);
    window.history.pushState(null, null, currLoc+`?backBuster${backBusterCount++}${fragment}`);
  });
  window.document.addEventListener("deviceready", () => {
    window.document.addEventListener("backbutton",() => {
      window.history.pushState(null, null, currLoc+`?backBuster${backBusterCount++}${fragment}`);
      window.history.pushState(null, null, currLoc+`?backBuster${backBusterCount++}${fragment}`);
      return false;
    }, false);
  }, false);
}

export {
  enableBackProtection
}

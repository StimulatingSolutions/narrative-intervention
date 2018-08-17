import {Platform} from "ionic-angular";

let backBusterCount: number = 1;

function enableBackProtection(platform: Platform) {
  platform.registerBackButtonAction(() => {});

  let currLoc: string = window.location.href.split('?')[0];
  window.history.pushState(null, null, currLoc+`?backBuster${backBusterCount++}`);
  window.history.pushState(null, null, currLoc+`?backBuster${backBusterCount++}`);
  window.history.pushState(null, null, currLoc+`?backBuster${backBusterCount++}`);
  window.history.pushState(null, null, currLoc+`?backBuster${backBusterCount++}`);
  window.addEventListener('popstate', (event) => {
    window.history.pushState(null, null, currLoc+`?backBuster${backBusterCount++}`);
    window.history.pushState(null, null, currLoc+`?backBuster${backBusterCount++}`);
  });
  window.document.addEventListener("deviceready", () => {
    window.document.addEventListener("backbutton",() => {
      window.history.pushState(null, null, currLoc+`?backBuster${backBusterCount++}`);
      window.history.pushState(null, null, currLoc+`?backBuster${backBusterCount++}`);
      return false;
    }, false);
  }, false);
}

export {
  enableBackProtection
}

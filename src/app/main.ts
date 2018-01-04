import 'meteor-client';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { MeteorObservable } from 'meteor-rxjs';
import { Meteor } from 'meteor/meteor';
import { AppModule } from './app.module';

//import * shortid from 'shortid';

Meteor.startup(() => {

  //shortid.characters('0123456789');  // NEEDS 64 chars

  const subscription = MeteorObservable.autorun().subscribe(() => {

    if (Meteor.loggingIn()) {
      return;
    }

    setTimeout(() => { if (subscription) subscription.unsubscribe() });
    platformBrowserDynamic().bootstrapModule(AppModule);
  });
});


import {Component} from "@angular/core";
import {NavController} from "ionic-angular";
import {DestructionAwareComponent} from "../../util/destructionAwareComponent";
import {MeteorObservable} from "meteor-rxjs";
import {ErrorAlert} from "../../services/errorAlert";
import {intersection} from 'lodash';


@Component({
  selector: 'videos',
  templateUrl: 'videos.html'
})
export class VideosPage extends DestructionAwareComponent {

  public isAdmin: boolean;
  public showSessionManagement: boolean;
  public showDataManagement: boolean;

  constructor(
    private errorAlert: ErrorAlert,
    private navCtrl: NavController
  ) {
    super();
    this.isAdmin = false;
    this.showSessionManagement = false;
    this.showDataManagement = false;

    MeteorObservable.call<string[]>('getUserRoles')
    .takeUntil(this.componentDestroyed$)
    .subscribe({
      next: (result: string[]) => {
        this.showSessionManagement = !!intersection(result, ['admin', 'teacher']).length;
        this.showDataManagement = !!intersection(result, ['admin', 'researcher']).length;
        this.isAdmin = result.indexOf('admin') !== -1;
      },
      error: this.errorAlert.presenter(8)
    });
  }

  dismiss() {
    this.navCtrl.goToRoot({});
  }
}

import {Injectable} from "@angular/core";
import {AlertController} from "ionic-angular";

@Injectable()
export class ErrorAlert {
  constructor(private alertCtrl: AlertController) {}

  public present(e: Error, id: number): void {
    console.error(e);

    let content:any = {
      title: `Oops! (#${ id })`,
      buttons: ['OK']
    };
    if (e && e.message) {
      content.message = e.message;
    } else {
      content.message = ((typeof e) === 'string') ? e : JSON.stringify(e);
    }
    const alert = this.alertCtrl.create(content);
    alert.present();
  }

  public presenter(id: number): (e: Error) => void {
    return (e: Error) => {
      this.present(e, id);
    }
  }

  public handler(id: number): (e: Error, result: any) => void {
    return (e: Error) => {
      if (typeof e === 'undefined') {
        return;
      }
      this.present(e, id);
    }
  }
}

import {Injectable, OnDestroy} from "@angular/core";
import {Subject} from "rxjs/Subject";

@Injectable()
export class DestructionAwareComponent implements OnDestroy {
  protected componentDestroyed$: Subject<boolean> = new Subject();

  ngOnDestroy(): void {
    this.componentDestroyed$.next(true);
    this.componentDestroyed$.complete();
  }
}

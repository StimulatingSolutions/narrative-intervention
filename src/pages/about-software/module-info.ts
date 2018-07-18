
import {Component, Input} from "@angular/core";

@Component({
  selector: 'module-info',
  templateUrl: 'module-info.html'
})
export class ModuleInfo  {

  @Input() info: any;
  @Input() disallowCopyright: boolean;

  constructor(
  ) {
  }

}

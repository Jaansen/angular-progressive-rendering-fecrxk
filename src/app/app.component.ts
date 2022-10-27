import { Component } from "@angular/core";
import { Subject } from "rxjs";
import { RenderRequest } from "./list.component";

const ELEMENT_COUNT = 50000;

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  private _data = new Subject<RenderRequest>();
  readonly data$ = this._data.asObservable();

  progessive() {
    this._data.next({
      progressiveRender: true,
      payload: Array.from({ length: ELEMENT_COUNT }, (_, idx) => ({
        id: idx,
        content: Math.random() + idx
      }))
    });
  }

  classic() {
    this._data.next({
      progressiveRender: false,
      payload: Array.from({ length: ELEMENT_COUNT }, (_, idx) => ({
        id: idx,
        content: Math.random() + idx
      }))
    });
  }
}

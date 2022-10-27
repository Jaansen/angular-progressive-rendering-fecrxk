import { Component, OnInit, Input, OnDestroy } from "@angular/core";
import { iif, Observable, Subscription, of, from } from "rxjs";
import { switchMap, concatMap, delay } from "rxjs/operators";

const CHUNK_SIZE = 5000;
function* slicer(payload) {
  for (let i = 0; i < payload.length; i += CHUNK_SIZE) {
    yield payload.slice(i, i + CHUNK_SIZE);
  }
  return;
}

interface ListContent {
  id: number;
  content: number;
}

export interface RenderRequest {
  progressiveRender: boolean;
  payload: ListContent[];
}

@Component({
  selector: "list-component",
  template: `
    <div style="overflow-y: auto; height: 40vh;">
      <p *ngFor="let i of array; trackBy: trackByFn">{{ i.content }}</p>
    </div>
  `
})
export class ListComponent implements OnInit, OnDestroy {
  array: ListContent[] = [];
  private subscription = new Subscription();
  @Input() data$: Observable<RenderRequest>;
  ngOnInit() {
    this.subscription.add(
      this.data$
        .pipe(
          switchMap(request => {
            this.array = [];
            return iif(
              () => !request.progressiveRender,
              of(request.payload),
              from(slicer(request.payload)).pipe(
                concatMap(chunk => of(chunk).pipe(delay(0)))
              )
            );
          })
        )
        .subscribe(array => {
          this.array = this.array.concat(array);
        })
    );
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  trackByFn(index, item) {
    return item.id;
  }
}

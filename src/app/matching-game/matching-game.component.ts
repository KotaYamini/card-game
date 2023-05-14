import { Component, ContentChild, EventEmitter, Input, OnInit, Output, OnDestroy, TemplateRef } from '@angular/core';
import { Pair } from '../models/pair';
import { EMPTY, Observable, Subject, Subscription, filter, from, iif, of, pairwise } from 'rxjs';
import { map, mergeAll, mergeMap, partition } from 'rxjs/operators';
@Component({
  selector: 'app-matching-game',
  templateUrl: './matching-game.component.html',
  styleUrls: ['./matching-game.component.scss']
})
export class MatchingGameComponent implements OnInit, OnDestroy {
  @Input() pairs!: Pair[];
  @ContentChild('leftpart', { static: false }) leftpart_temp!: TemplateRef<any>;
  @ContentChild('rightpart', { static: false }) rightpart_temp!: TemplateRef<any>;
  @Output() leftPartSelected = new EventEmitter<number>();
  @Output() rightPartSelected = new EventEmitter<number>();
  @Output() leftPartUnselected = new EventEmitter();
  @Output() rightPartUnselected = new EventEmitter();
  assignmentStream = new Subject<{ pair: Pair, side: string }>();

  private solvedStream = new Observable<Pair>();
  private failedStream = new Observable<string>();

  private s_Subscription!: Subscription;
  private f_Subscription!: Subscription;

  solvedPairs: Pair[] = [];
  unsolvedPairs: Pair[] = [];
  test!: number;

  ngOnInit(): void {
    for (let i = 0; i < this.pairs.length; i++) {
      this.unsolvedPairs.push(this.pairs[i]);
    }

    const stream = this.assignmentStream.pipe(
      pairwise(),
      filter(comb => comb[0].side != comb[1].side)
    );


    const [stream1, stream2]: any = partition((comb: any) =>
      comb[0].pair === comb[1].pair)(stream);


    // const [stream1, stream2]:any = from(stream).pipe(
    //   mergeMap((comb: any) => {
    //     return iif(
    //       () => comb[0].pair === comb[1].pair,
    //       of([comb]),
    //       EMPTY
    //     );
    //   }),
    // );

    this.solvedStream = stream1.pipe(
      map((comb: any) => comb[0].pair)
    );
    this.failedStream = stream2.pipe(
      map((comb: any) => comb[0].side)
    );

    this.s_Subscription = this.solvedStream.subscribe(pair =>
      this.handleSolvedAssignment(pair));
    this.f_Subscription = this.failedStream.subscribe((side) =>
      this.handleFailedAssignment(side));
  }

  private handleSolvedAssignment(pair: Pair): void {
    this.solvedPairs.push(pair);
    this.remove(this.unsolvedPairs, pair);
    this.leftPartUnselected.emit();
    this.rightPartUnselected.emit();
    this.test = Math.random() * 10;
  }

  private handleFailedAssignment(side1: string): void {
    if (side1 == "left") {
      this.leftPartUnselected.emit();
    } else {
      this.rightPartUnselected.emit();
    }

  }

  remove(unsolvedArray: Pair[], pair: Pair) {
    const objWithIdIndex = unsolvedArray.findIndex((obj) => obj.id === pair.id);
    if (objWithIdIndex !== -1) {
      unsolvedArray.splice(objWithIdIndex, 1);
    }
  }


  ngOnDestroy() {
    this.s_Subscription.unsubscribe();
    this.f_Subscription.unsubscribe();
  }

}

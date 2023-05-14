import { Component, ContentChild, EventEmitter, Input, OnInit, Output, OnDestroy, TemplateRef } from '@angular/core';
import { Pair } from '../models/pair';
import { Observable, Subject, Subscription, filter, pairwise } from 'rxjs';
import { partition, map } from 'rxjs/operators';
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

    const [stream1, stream2] = partition((comb: any) =>
      comb[0].pair === comb[1].pair)(stream);

    this.solvedStream = stream1.pipe(
      map((comb: any) => comb[0].pair)
    );
    this.failedStream = stream2.pipe(
      map((comb: any) => comb[0].side)
    );

    this.s_Subscription = this.solvedStream.subscribe(pair =>
      this.handleSolvedAssignment(pair));
    this.f_Subscription = this.failedStream.subscribe((pair) =>
      this.handleFailedAssignment(pair));
  }

  private handleSolvedAssignment(pair: Pair): void {
    this.solvedPairs.push(pair);
    this.remove(this.unsolvedPairs, pair);
    this.leftPartUnselected.emit();
    this.rightPartUnselected.emit();
    //workaround to force update of the shuffle pipe
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
    return unsolvedArray.splice(0, pair.id);
  }


  ngOnDestroy() {
    this.s_Subscription.unsubscribe();
    this.f_Subscription.unsubscribe();
  }

}

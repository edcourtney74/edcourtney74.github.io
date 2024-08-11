import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-week-selector',
  templateUrl: './week-selector.component.html',
  styleUrls: ['./week-selector.component.scss'],
})
export class SelectorComponent {
  @Input() weeks: number[] = [];
  @Output() sendWeek: EventEmitter<number> = new EventEmitter();
  selectedWeek: number;

  constructor() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['weeks'] && changes['weeks'].currentValue) {
      this.selectedWeek = this.weeks[0];
    }
  }

  onClick(week: number): void {
    this.sendWeek.emit(week);
    this.selectedWeek = week;
  }
}

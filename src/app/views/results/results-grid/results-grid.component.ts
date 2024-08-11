import { Component, Input, OnInit } from '@angular/core';
import { TeamStats } from 'src/app/interfaces';
import { PointsService } from 'src/app/services/points.service';

@Component({
  selector: 'app-results-grid',
  templateUrl: './results-grid.component.html',
  styleUrls: ['./results-grid.component.scss']
})
export class ResultsGridComponent implements OnInit {

  @Input() teams: TeamStats[];

  constructor(public pointsService: PointsService) { }

  ngOnInit(): void {
  }
}

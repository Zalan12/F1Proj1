import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../services/api.service';
import { Team } from '../../interfaces/team';
import { CommonModule } from '@angular/common';
import { Circuit } from '../../interfaces/circuit';
import { Race } from '../../interfaces/race';
import { Driver } from '../../interfaces/driver';
import {MatTabsModule} from '@angular/material/tabs';
import { Result } from '../../interfaces/result';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [MatCardModule, MatIconModule, MatButtonModule, CommonModule,MatTabsModule, MatTableModule,MatPaginatorModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, AfterViewInit{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
    constructor(private api: ApiService) { }

    teams: Team[] = [];
    circuits: Circuit[] = [];
    races: Race[] = [];
    drivers: Driver[] = [];
    results: Result[] = [];

    ngOnInit() {
        this.getTeams();
        this.getCircuits();
        this.getRaces();
        this.getDrivers();
        this.getResults();

    }
    driversDataSource = new MatTableDataSource<Driver>([]);
    ngAfterViewInit(): void {
        this.driversDataSource.paginator = this.paginator;
    }

    getTeams() {
        this.api.readAll('teams').subscribe(data => {
            console.log('Teams data:', data);
            this.teams = data as Team[];
        });
    }
    getCircuits() {
        this.api.readAll('circuits').subscribe(data => {
            console.log('Circuits data:', data);
            this.circuits = data as Circuit[];
        });
    }
    getRaces() {
        this.api.readAll('races').subscribe(data => {
            console.log('Races data:', data);
            this.races = data as Race[];
        });
    }
    getDrivers() {
        this.api.readAll('drivers').subscribe(data => {
            console.log('Drivers data:', data);
            this.drivers = data as Driver[];
            this.driversDataSource.data = this.drivers;
        });
    }

    getResults() {
        this.api.readAll('race-results').subscribe(data => {
            console.log('Results data:', data);
            this.results = data as Result[];
        });
    }

    displayedColumns: string[] = ['id', 'firstName', 'lastName', 'nationality', 'number'];

}

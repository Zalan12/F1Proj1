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
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDividerModule} from '@angular/material/divider';
import { DatePipe } from '@angular/common';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        MatCardModule, 
        MatIconModule, 
        MatButtonModule, 
        CommonModule,
        MatTabsModule, 
        MatTableModule,
        MatPaginatorModule,
        MatInputModule,
        MatFormFieldModule, 
        MatDividerModule,
        MatSlideToggleModule
        ],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, AfterViewInit{

    // Paginator ViewChilds
  @ViewChild('driversPaginator') driversPaginator!: MatPaginator;
  @ViewChild('teamsPaginator') teamsPaginator!: MatPaginator;
  @ViewChild('circuitsPaginator') circuitsPaginator!: MatPaginator;
  @ViewChild('racesPaginator') racesPaginator!: MatPaginator;
  @ViewChild('resultsPaginator') resultsPaginator!: MatPaginator;

    constructor(private api: ApiService) { }

    // Data Arrays
    teams: Team[] = [];
    circuits: Circuit[] = [];
    races: Race[] = [];
    drivers: Driver[] = [];
    results: Result[] = [];

    ngOnInit() {

        // Fetch initial data
        this.getTeams();
        this.getCircuits();
        this.getRaces();
        this.getDrivers();
        this.getResults();

    }

    // Data Sources
    driversDataSource = new MatTableDataSource<Driver>([]);
    teamsDataSource = new MatTableDataSource<Team>([]);
    circuitsDataSource = new MatTableDataSource<Circuit>([]);
    racesDataSource = new MatTableDataSource<Race>([]);
    resultsDataSource = new MatTableDataSource<Result>([]);

    ngAfterViewInit(): void {

        // Set up paginators
        this.driversDataSource.paginator = this.driversPaginator;
        this.teamsDataSource.paginator = this.teamsPaginator;
        this.circuitsDataSource.paginator = this.circuitsPaginator;
        this.racesDataSource.paginator = this.racesPaginator;
        this.resultsDataSource.paginator = this.resultsPaginator;
    }
    //Load data into tables
    getTeams() {
        this.api.readAll('teams').subscribe(data => {
        
            this.teams = data as Team[];
            this.teamsDataSource.data = this.teams;
        });
    }
    getCircuits() {
        this.api.readAll('circuits').subscribe(data => {
           
            this.circuits = data as Circuit[];
            this.circuitsDataSource.data = this.circuits;
        });
    }
    getRaces() {
        this.api.readAll('races').subscribe(data => {
            
            this.races = data as Race[];
            this.racesDataSource.data = this.races;
        });
    }
    getDrivers() {
        this.api.readAll('drivers').subscribe(data => {
           
            this.drivers = data as Driver[];
            this.driversDataSource.data = this.drivers;
        });
    }

    getResults() {
        this.api.readAll('race-results').subscribe(data => {
            
            this.results = data as Result[];
            this.resultsDataSource.data = this.results;
        });
    }


    //------------------------DRIVER CRUD------------------------

    newDriver:Driver = {
        id: 0,
        firstName: '' ,
        lastName: '',
        nationality: '',
        number: 0,
        rookie: false,
        teamId: 13
    };
    deleteDriver(driverId: number) {
        console.log('Deleting driver with ID:', driverId);
        this.api.delete('drivers', driverId).subscribe(() => {
            this.getDrivers();
        });
    }

    // Add Driver
    addDriver(driver: Driver) {
        this.api.insert('drivers', driver).subscribe(() => {
            this.getDrivers();
        });
    }

    editDriver(driver: Driver) {
        // Implement edit functionality
    }

    //------------------------TEAM CRUD------------------------

    deleteTeam(teamId: number) {
        console.log('Deleting team with ID:', teamId);
        this.api.delete('teams', teamId).subscribe(() => {
            this.getTeams();
        });
    }

    // Add Team
    addTeam(team: Team) {
        this.api.insert('teams', team).subscribe(() => {
            this.getTeams();
        });
    }

    //------------------------DRIVER------------------------

    driversDisplayedColumns: string[] = ['id', 'firstName', 'lastName', 'nationality', 'number','Actions'];
    teamsDisplayedColumns: string[] = ['id', 'name', 'base', 'principal','powerUnit','Color'];
    circuitsDisplayedColumns: string[] = ['id', 'name', 'country', 'city', 'lengthKm', 'lapRecord'];
    racesDisplayedColumns: string[] = ['id', 'grandPrix', 'date', 'status','circuit'];
    resultsDisplayedColumns: string[] = ['id', 'race', 'driver', 'points', 'position'];
}

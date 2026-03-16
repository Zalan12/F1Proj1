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
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [
        MatCardModule, 
        MatIconModule, 
        MatButtonModule, 
        CommonModule,
    FormsModule,
        MatTabsModule, 
        MatTableModule,
        MatPaginatorModule,
        MatInputModule,
        MatFormFieldModule, 
        MatDividerModule,
        MatSlideToggleModule,
        MatSelectModule,
        MatSortModule
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


  //Sorts

  @ViewChild('driversSort')sort!: MatSort;

    constructor(private api: ApiService) { }

    // Data Arrays
    teams: Team[] = [];
    circuits: Circuit[] = [];
    races: Race[] = [];
    drivers: Driver[] = [];
    results: Result[] = [];


    raceStatuses: string[] = ['Scheduled', 'Ongoing', 'Completed'];

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

        // Set up sorts
        this.driversDataSource.sort = this.sort;
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

    isEditingDriver = false;
    editingDriverId: number | null = null;

    newDriver:Driver = {
        id: 0,
        firstName: '' ,
        lastName: '',
        nationality: '',
        number: 0,
        rookie: false,
        teamId: 0
    };
    deleteDriver(driverId: number) {
        console.log('Deleting driver with ID:', driverId);
        this.api.delete('drivers', driverId).subscribe(() => {
            this.getDrivers();
        });
    }

    // Add Driver
    addDriver(driver: Driver) {
        
        if (!driver.firstName?.trim() || !driver.lastName?.trim()) {
            console.warn('First name and last name are required');
            return;
        }

        
        const payload: Driver = {
            firstName: driver.firstName?.trim(),
            lastName: driver.lastName?.trim(),
            nationality: driver.nationality?.trim(),
            number: Number(driver.number ?? 0),
            rookie: !!driver.rookie,
            teamId: driver.teamId ?? 0
        };

        this.api.insert('drivers', payload).subscribe(() => {
            this.getDrivers();
            this.resetDriverForm();
        });
    }

    editDriver(driver: Driver) {

        // Populate the form with the selected driver
        this.isEditingDriver = true;
        this.editingDriverId = Number(driver.id);
        this.newDriver = {
            id: Number(driver.id ?? 0),
            firstName: driver.firstName ?? '',
            lastName: driver.lastName ?? '',
            nationality: driver.nationality ?? '',
            number: Number(driver.number ?? 0),
            rookie: !!driver.rookie,
            teamId: Number(driver.teamId ?? 0)
        };
    }

    cancelEditDriver() {
        this.resetDriverForm();
    }

    updateDriver(driver: Driver) {
        const id = this.editingDriverId ?? Number(driver.id);
        if (!id) {
            console.warn('Missing driver id for update');
            return;
        }

        if (!driver.firstName?.trim() || !driver.lastName?.trim()) {
            console.warn('First name and last name are required');
            return;
        }

        const payload: Driver = {
            firstName: driver.firstName?.trim(),
            lastName: driver.lastName?.trim(),
            nationality: driver.nationality?.trim(),
            number: Number(driver.number ?? 0),
            rookie: !!driver.rookie,
            teamId: Number(driver.teamId ?? 0)
        };

        this.api.update('drivers', id, payload).subscribe(() => {
            this.getDrivers();
            this.resetDriverForm();
        });
    }

    private resetDriverForm() {
        this.isEditingDriver = false;
        this.editingDriverId = null;
        this.newDriver = {
            id: 0,
            firstName: '',
            lastName: '',
            nationality: '',
            number: 0,
            rookie: false,
            teamId: 0
        };
    }

    //------------------------TEAM CRUD------------------------

    isEditingTeam = false;
    editingTeamId: number | null = null;

    newTeam: Team = {
        id: 0,
        name: '',
        base: '',
        principal: '',
        powerUnit: '',
        color: ''
    };
    
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
            this.resetTeamForm();
        });
    }

    editTeam(team: Team) {
        this.isEditingTeam = true;
        this.editingTeamId = Number(team.id);
        this.newTeam = {
            id: Number(team.id ?? 0),
            name: team.name ?? '',
            base: team.base ?? '',
            principal: team.principal ?? '',
            powerUnit: team.powerUnit ?? '',
            color: team.color ?? ''
        };
    }

    cancelEditTeam() {
        this.resetTeamForm();
    }

    updateTeam(team: Team) {
        const id = this.editingTeamId ?? Number(team.id);
        if (!id) {
            console.warn('Missing team id for update');
            return;
        }

        if (!team.name?.trim() || !team.base?.trim()) {
            console.warn('Team name and base are required');
            return;
        }

        const payload: Team = {
            name: team.name?.trim(),
            base: team.base?.trim(),
            principal: team.principal?.trim(),
            powerUnit: team.powerUnit?.trim(),
            color: team.color?.trim(),
        } as Team;

        this.api.update('teams', id, payload).subscribe(() => {
            this.getTeams();
            this.resetTeamForm();
        });
    }

    private resetTeamForm() {
        this.isEditingTeam = false;
        this.editingTeamId = null;
        this.newTeam = {
            id: 0,
            name: '',
            base: '',
            principal: '',
            powerUnit: '',
            color: ''
        };
    }

    //------------------------RACE CRUD------------------------

    isEditingRace = false;
    editingRaceId: number | null = null;

    newRace: Race = {
        id: 0,
        round: 0,
        grandPrix: '',
        date: '',
        status: '',
        circuitId: 0
    };

    deleteRace(raceId: number) {
        console.log('Deleting race with ID:', raceId);
        this.api.delete('races', raceId).subscribe(() => {
            this.getRaces();
        });
    }

    // Add Race
    addRace(race: Race) {
        this.api.insert('races', race).subscribe(() => {
            this.getRaces();
            this.resetRaceForm();
        });
    }

    editRace(race: Race) {
        this.isEditingRace = true;
        this.editingRaceId = Number(race.id);
        this.newRace = {
            id: Number(race.id ?? 0),
            round: Number(race.round ?? 0),
            grandPrix: race.grandPrix ?? '',
            date: (race.date as any) ?? '',
            status: race.status ?? '',
            // race in table might be enriched with circuit object, but API expects circuitId
            circuitId: Number((race as any).circuitId ?? (race as any).circuit?.id ?? 0)
        };
    }

    cancelEditRace() {
        this.resetRaceForm();
    }

    updateRace(race: Race) {
        const id = this.editingRaceId ?? Number(race.id);
        if (!id) {
            console.warn('Missing race id for update');
            return;
        }

        if (!race.grandPrix?.trim()) {
            console.warn('Grand Prix is required');
            return;
        }

        const payload: Race = {
            round: Number(race.round ?? 0),
            grandPrix: race.grandPrix?.trim(),
            date: (race.date as any) ?? '',
            status: race.status ?? '',
            circuitId: Number(race.circuitId ?? 0)
        } as Race;

        this.api.update('races', id, payload).subscribe(() => {
            this.getRaces();
            this.resetRaceForm();
        });
    }

    private resetRaceForm() {
        this.isEditingRace = false;
        this.editingRaceId = null;
        this.newRace = {
            id: 0,
            round: 0,
            grandPrix: '',
            date: '',
            status: '',
            circuitId: 0
        };
    }

    //----------------------CIRCUIT CRUD------------------------

    isEditingCircuit = false;
    editingCircuitId: number | null = null;

    newCircuit: Circuit = {
        id: 0,
        name: '',
        country: '',
        city: '',
        lengthKm: 0,
        lapRecord: ''
    };

    deleteCircuit(circuitId: number) {
        console.log('Deleting circuit with ID:', circuitId);
        this.api.delete('circuits', circuitId).subscribe(() => {
            this.getCircuits();
        });
    }

    // Add Circuit
    addCircuit(circuit: Circuit) {
        this.api.insert('circuits', circuit).subscribe(() => {
            this.getCircuits();
            this.resetCircuitForm();
        });
    }

    editCircuit(circuit: Circuit) {
        this.isEditingCircuit = true;
        this.editingCircuitId = Number(circuit.id);
        this.newCircuit = {
            id: Number(circuit.id ?? 0),
            name: circuit.name ?? '',
            country: circuit.country ?? '',
            city: circuit.city ?? '',
            lengthKm: Number(circuit.lengthKm ?? 0),
            lapRecord: (circuit.lapRecord as any) ?? ''
        };
    }

    cancelEditCircuit() {
        this.resetCircuitForm();
    }

    updateCircuit(circuit: Circuit) {
        const id = this.editingCircuitId ?? Number(circuit.id);
        if (!id) {
            console.warn('Missing circuit id for update');
            return;
        }

        if (!circuit.name?.trim()) {
            console.warn('Circuit name is required');
            return;
        }

        const payload: Circuit = {
            name: circuit.name?.trim(),
            country: circuit.country?.trim(),
            city: circuit.city?.trim(),
            lengthKm: Number(circuit.lengthKm ?? 0),
            lapRecord: (circuit.lapRecord as any) ?? ''
        } as Circuit;

        this.api.update('circuits', id, payload).subscribe(() => {
            this.getCircuits();
            this.resetCircuitForm();
        });
    }

    private resetCircuitForm() {
        this.isEditingCircuit = false;
        this.editingCircuitId = null;
        this.newCircuit = {
            id: 0,
            name: '',
            country: '',
            city: '',
            lengthKm: 0,
            lapRecord: ''
        };
    }

    //----------------------RESULT CRUD (update example)------------------------

    // Results tab currently has no form, so this is just the code-side pattern.
    isEditingResult = false;
    editingResultId: number | null = null;

    editResult(result: Result) {
        this.isEditingResult = true;
        this.editingResultId = Number(result.id);
        // If you later add a form, bind it to this object.
    }

    updateResult(result: Result) {
        const id = this.editingResultId ?? Number(result.id);
        if (!id) {
            console.warn('Missing result id for update');
            return;
        }

        const payload: Result = {
            position: Number(result.position ?? 0),
            points: Number(result.points ?? 0),
            finishTime: result.finishTime ?? '',
            fastestLap: Number(result.fastestLap ?? 0),
            raceId: Number(result.raceId ?? 0),
            driverId: Number(result.driverId ?? 0),
            teamId: Number(result.teamId ?? 0),
        } as Result;

        this.api.update('race-results', id, payload).subscribe(() => {
            this.getResults();
            this.isEditingResult = false;
            this.editingResultId = null;
        });
    }

    //------------------------DRIVER------------------------

    driversDisplayedColumns: string[] = ['id', 'firstName', 'lastName', 'nationality', 'number','Actions'];
    teamsDisplayedColumns: string[] = ['id', 'name', 'base', 'principal','powerUnit','Color', 'Actions'];
    circuitsDisplayedColumns: string[] = ['id', 'name', 'country', 'city', 'lengthKm', 'lapRecord', 'Actions'];
    racesDisplayedColumns: string[] = ['id', 'grandPrix', 'date', 'status','circuit','Actions'];
    resultsDisplayedColumns: string[] = ['id', 'race', 'driver', 'points', 'position'];
}

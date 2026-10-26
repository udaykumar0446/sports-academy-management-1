import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
export interface Athlete { id: string; name: string; sport: string; email: string; phone: string; status: 'Active'|'On Hold'; joinedAt?: string; }
export interface AthleteInput { name: string; sport: string; email: string; phone: string; status: 'Active'|'On Hold'; }
export interface Stats { totalAthletes: number; activeAthletes: number; sportsCount: number; onHold: number; }
@Injectable({providedIn:'root'}) export class AthleteService {
 private http=inject(HttpClient); private api='http://localhost:3000/api';
 list(q=''):Observable<Athlete[]>{return this.http.get<Athlete[]>(`${this.api}/athletes`,{params:q?{q}:{}})}
 stats():Observable<Stats>{return this.http.get<Stats>(`${this.api}/dashboard`)}
 create(a:AthleteInput):Observable<Athlete>{return this.http.post<Athlete>(`${this.api}/athletes`,a)}
 update(id:string,a:AthleteInput):Observable<Athlete>{return this.http.put<Athlete>(`${this.api}/athletes/${id}`,a)}
 remove(id:string):Observable<void>{return this.http.delete<void>(`${this.api}/athletes/${id}`)}
}

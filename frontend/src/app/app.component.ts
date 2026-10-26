import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Athlete, AthleteInput, AthleteService, Stats } from './services/athlete.service';
@Component({selector:'app-root',standalone:true,imports:[CommonModule,FormsModule],templateUrl:'./app.component.html'})
export class AppComponent implements OnInit {
 private service=inject(AthleteService); athletes:Athlete[]=[]; stats:Stats={totalAthletes:0,activeAthletes:0,sportsCount:0,onHold:0}; query=''; error=''; notice=''; loading=false; showForm=false; editingId:string|null=null;
 form:AthleteInput=this.empty(); empty():AthleteInput{return {name:'',sport:'Football',email:'',phone:'',status:'Active'}};
 ngOnInit(){this.refresh()}
 refresh(){this.loading=true;this.error='';this.service.list(this.query).subscribe({next:a=>{this.athletes=a;this.loading=false;this.service.stats().subscribe({next:s=>this.stats=s,error:()=>{}})},error:()=>{this.loading=false;this.error='Cannot connect to backend. Start the API in the backend folder.'}})}
 openCreate(){this.editingId=null;this.form=this.empty();this.error='';this.showForm=true}
 openEdit(a:Athlete){this.editingId=a.id;this.form={name:a.name,sport:a.sport,email:a.email,phone:a.phone||'',status:a.status};this.error='';this.showForm=true}
 save(){this.error='';const id=this.editingId;const req=id?this.service.update(id,this.form):this.service.create(this.form);req.subscribe({next:()=>{this.showForm=false;this.notice=id?'Athlete updated.':'Athlete registered.';this.refresh()},error:e=>this.error=e?.error?.message||'Unable to save athlete.'})}
 remove(a:Athlete){if(confirm(`Delete ${a.name}?`))this.service.remove(a.id).subscribe({next:()=>{this.notice='Athlete deleted.';this.refresh()},error:()=>this.error='Unable to delete athlete.'})}
}

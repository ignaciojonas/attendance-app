import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'attendance-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  public students: FirebaseListObservable<any[]>;
  public positions = [];
  constructor(private db: AngularFireDatabase) {
    let pos = [];
    let date = new Date().toDateString();
     this.students = db.list('/Students');
     this.students.subscribe(students => {
      students.forEach(student => {
          console.log('Student:', student);
          for(let attend in student.attended){
            if(student.attended[attend].date == date )
              pos.push({
                "position": [student.attended[attend].lat, student.attended[attend].long],
                "student": student.name
                });
          }
      });
    });
    let randomLat: number, randomLng: number;
    this.positions = pos;

  }

  ngOnInit() {
  }
}

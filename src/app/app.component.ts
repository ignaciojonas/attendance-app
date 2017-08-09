import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public students: FirebaseListObservable<any[]>;
  public selectedStudent: string;
  public location: any;
  public date: string;
  public alreadyPresent: boolean = false;
  public saveSuccessful: boolean = false;

  constructor(private db: AngularFireDatabase) {
     this.students = db.list('/Students');
     this.date = new Date().toDateString();
  }

  setPosition(position){
    this.location = position.coords;
    console.log(position.coords);
    console.log(this.guid());
  }

  ngOnInit(){
     if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(this.setPosition.bind(this));
        };
   }

  guid(){
    let nav = window.navigator;
    let screen = window.screen;
    let guid = nav.mimeTypes.length.toString();
    guid += nav.userAgent.replace(/\D+/g, '');
    guid += nav.plugins.length;
    guid += screen.height || '';
    guid += screen.width || '';
    guid += screen.pixelDepth || '';

    return guid;
  }

  isInClass(){
    let attendedClases = this.db.list(`/Students/${this.selectedStudent}/attended`);
    let ret = false;
    attendedClases.forEach(clases => {
      clases.forEach(c => {
        if(c.date == this.date){
          ret = true;
          return true;
        }
      });
    });
    return ret;
  }

  onSubmit(){
    this.saveSuccessful = false;
    this.alreadyPresent = false;
    if(!this.isInClass()){
       let attendedClases = this.db.list(`/Students/${this.selectedStudent}/attended`);
       attendedClases.push({ "date": this.date, "lat": this.location.latitude, "long": this.location.longitude, "guid": this.guid() })
       this.saveSuccessful = true;
    }
    else{
      this.alreadyPresent = true;
    }
  }
}

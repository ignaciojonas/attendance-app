import { Component } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public students: FirebaseListObservable<any[]>;
  public studentsInClass : any[] = [];
  public selectedStudent: string;
  public location: any;
  public date: string;
  public alreadyPresent: boolean = false;
  public saveSuccessful: boolean = false;
  public saveUserSuccessful: boolean = false;
  public name: string = '';
  public lu: string;

  constructor(private db: AngularFireDatabase) {
     this.students = db.list('/Students');
     this.students.subscribe(students=>{
       this.studentsInClass = [];
       students.forEach(student => {
              if(student.attended){
                let klass = this.isInClass(student.attended);
                if(klass){
                 this.studentsInClass.push({
                                            "name": student.name + ' - ' + student.lu,
                                            "position": [klass.lat, klass.long]
                                          });
               }
             }
           }
         )
       });
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

  isInClass(attendedClases){
    let ret : any;
    Object.keys(attendedClases).forEach(function(key) {
      var klass = attendedClases[key];
      if(new Date(klass.date).toDateString() == new Date().toDateString()){
        ret = klass;
        return true;
      }
    });
    return ret;
  }

  onSubmit(){
    this.saveSuccessful = false;
    this.alreadyPresent = false;
    this.db.list(`/Students/${this.selectedStudent}/attended`).subscribe(attended=>{
      if(!this.isInClass(attended)){
         this.db.list(`/Students/${this.selectedStudent}/attended`).push({ "date": Date.now(), "lat": this.location.latitude, "long": this.location.longitude, "guid": this.guid() })
         this.saveSuccessful = true;
      }
      else{
        this.alreadyPresent = true && !this.saveSuccessful;
      }
    });
  }

  addUser(){
    let error = '';
    if(this.name === undefined || this.name === '') error += "El nombre es obligatorio. ";
    if(this.lu === undefined || this.lu === '') error += "La Libreta Universitaria es obligatoria.";
    if(error !== ''){
      alert(error);
    }
    else {
      let students = this.db.list(`/Students`);
      students.push({ "name": this.name, "lu": this.lu})
      this.name = '';
      this.lu = undefined;
      this.saveUserSuccessful = true;
    }
  }


}

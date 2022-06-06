import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { AppService } from '../app.service';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { FIRST_SCREEN_PATH } from '../tabs-configuration/paths';

@Component({
  selector: 'app-start-app',
  templateUrl: './start-app.component.html',
  styleUrls: ['./start-app.component.css']
})
export class StartAppComponent implements OnInit {

  flag: boolean = true;

  constructor(public dialog: MatDialog, private router: Router, private appService: AppService) { }

  ngOnInit(): void {
    this.uploadFile();
  }

  uploadFile(){
    const dialogRef = this.dialog.open(FileUploadComponent, {
      width: '500px',
    });
    dialogRef.afterClosed().pipe(
      tap()
    ).subscribe((res) => {
      if(res === "cancel"){
        this.flag = false;
      }
      else{
        if(res.split('.').pop() !== 'json' ){
          alert("Wczytaj poprawny plik (błędne rozszerzenie)");
          this.flag = false;
        }
        else{
          // this.appService.uploadFile(res).subscribe(() => this.router.navigateByUrl('app/' + FIRST_SCREEN_PATH))
          this.router.navigateByUrl('app/' + FIRST_SCREEN_PATH);
        }        
      }
     })
    
  }

  disabled(){
    return this.flag;
  }
}

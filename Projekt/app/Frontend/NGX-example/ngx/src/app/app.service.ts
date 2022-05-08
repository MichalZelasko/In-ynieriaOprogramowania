import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DATA_API_PATH, GENERAL_INFO_API_PATH, SCREEN_INFO_API_PATH } from './configuration/apiPaths';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  
    constructor(private http: HttpClient) {}

    getGeneralInfo(): Observable<any> {
        return this.http.get<any>(GENERAL_INFO_API_PATH);
    }

    getScreenInfo(screenID: number ): Observable<any> {
        return this.http.get<any>(SCREEN_INFO_API_PATH + screenID);
    }

    getData(chartID: number, dataID: number): Observable<any> {
        return this.http.get<any>(DATA_API_PATH + chartID + '/data/' + dataID);
    }
  
}
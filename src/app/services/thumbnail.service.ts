import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ThumbnailService {

  constructor(private http:HttpClient) {

  }

  url:string = "https://picsum.photos/v2/list";

  getThumbnails():Observable<any>{
    return  this.http.get(this.url);
  }
}

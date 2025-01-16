import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetUserInfoService {

  private apiUrl = 'http://bbpdigital.g2tecnologia.com.br:8021/';
  private httpOptions = { headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'bearer ' + localStorage.getItem('token'), }), };

  constructor(private http: HttpClient) {}

  getUserInfo() {
    
    this.http.get(this.apiUrl, this.httpOptions).subscribe(response => {

    })
  }

}

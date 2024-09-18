import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { infoBasica } from '../../models/infobasica/infobasica.model';

@Injectable({
  providedIn: 'root'
})
export class MetodosHttpService {
  constructor(private http: HttpClient) {
    // Método GET

  }
}
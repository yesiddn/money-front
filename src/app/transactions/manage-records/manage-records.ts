import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { checkToken } from '@app/interceptors/token-interceptor';
import { CreateRecord, Record } from '@app/models/record.intereface';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class ManageRecords {
  http = inject(HttpClient);
  apiURL = environment.API_URL;

  createRecord(recordData: CreateRecord) {
    return this.http.post<Record>(`${this.apiURL}/api/records/`, recordData, { context: checkToken() });
  }
}

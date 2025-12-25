import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { checkToken } from '@app/interceptors/token-interceptor';
import { CreateRecord, Record, UpdateRecord } from '@app/models/record.intereface';
import { environment } from '@env/environment';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ManageRecords {
  http = inject(HttpClient);
  apiURL = environment.API_URL;

  createRecord(recordData: CreateRecord) {
    return this.http
      .post<Record>(`${this.apiURL}/api/records/`, recordData, {
        context: checkToken(),
      })
      .pipe(
        map((newRecord: Record) => {
          return this.manageResponse(newRecord);
        })
      );
  }

  updateRecord(recordId: number, recordData: UpdateRecord) {
    console.log('Updating record with ID:', recordId, 'with data:', recordData);
    return this.http
      .put<Record>(`${this.apiURL}/api/records/${recordId}/`, recordData, { context: checkToken() })
      .pipe(
        map((updatedRecord: Record) => {
          return this.manageResponse(updatedRecord);
        })
      );
  }

  manageResponse(record: Record) {
    return {
      ...record,
      date_time: record.date_time ? new Date(record.date_time) : record.date_time,
    };
  }

  orderRecordsByDate(records: Record[]): Record[] {
    // Ordenar los registros por fecha en orden descendente, si la fecha es nula, poner registro al inicio
    return records.sort((a, b) => {
      if (a.date_time === null && b.date_time === null) return 0;

      if (a.date_time === null) return -1;

      if (b.date_time === null) return 1;
      
      return b.date_time.getTime() - a.date_time.getTime();
    });
  }
}

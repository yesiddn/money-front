import { Component } from '@angular/core';
import { Navbar } from '../../shared/components/navbar/navbar';
import { RecordFilters } from "../../modules/components/record-filters/record-filters";

@Component({
  selector: 'app-records',
  imports: [RecordFilters],
  templateUrl: './records.html',
})
export class Records {

}

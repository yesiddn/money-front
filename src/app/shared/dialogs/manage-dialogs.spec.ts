import { TestBed } from '@angular/core/testing';

import { ManageDialogs } from './manage-dialogs';

describe('ManageDialogs', () => {
  let service: ManageDialogs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageDialogs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

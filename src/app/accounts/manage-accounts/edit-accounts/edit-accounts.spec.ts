import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAccounts } from './edit-accounts';

describe('EditAccounts', () => {
  let component: EditAccounts;
  let fixture: ComponentFixture<EditAccounts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAccounts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAccounts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

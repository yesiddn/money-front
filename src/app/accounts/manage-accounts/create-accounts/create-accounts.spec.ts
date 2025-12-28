import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccounts } from './create-accounts';

describe('CreateAccounts', () => {
  let component: CreateAccounts;
  let fixture: ComponentFixture<CreateAccounts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAccounts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAccounts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

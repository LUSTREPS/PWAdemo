import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflineCacheingComponent } from './offline-cacheing.component';

describe('OfflineCacheingComponent', () => {
  let component: OfflineCacheingComponent;
  let fixture: ComponentFixture<OfflineCacheingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OfflineCacheingComponent]
    });
    fixture = TestBed.createComponent(OfflineCacheingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

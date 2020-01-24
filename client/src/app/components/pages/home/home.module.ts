import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { HomeComponent } from './home/home.component';

@NgModule({
    imports: [SharedModule ],
    declarations: [HomeComponent],
})
export class HomeModule {}

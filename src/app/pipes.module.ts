import { NgModule } from '@angular/core';
import {RelativeTimePipe} from './pipes/relative-time/relative-time.pipe';
@NgModule({
	declarations: [RelativeTimePipe],
	imports: [],
	exports: [RelativeTimePipe]
})
export class PipesModule {}

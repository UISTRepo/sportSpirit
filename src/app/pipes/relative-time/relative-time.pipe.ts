import { Pipe, PipeTransform } from '@angular/core';
import * as distanceInWordsToNow from 'date-fns/distance_in_words_to_now';

@Pipe({
  name: 'relativeTime'
})
export class RelativeTimePipe implements PipeTransform {

    transform(value: any, ...args) {
        return distanceInWordsToNow(value.toDate(), { addSuffix: true });
    }

}

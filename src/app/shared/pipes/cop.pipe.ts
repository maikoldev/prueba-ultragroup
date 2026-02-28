import { Pipe, PipeTransform } from '@angular/core';
import { formatCOP } from '../utils/currency.helper';

@Pipe({
  name: 'cop',
  standalone: true,
})
export class CopPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined) {
      return '$0';
    }
    return formatCOP(value);
  }
}

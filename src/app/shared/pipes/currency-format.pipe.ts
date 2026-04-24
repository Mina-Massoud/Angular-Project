// Owner: Noura — feature: shared/pipes/currency-format
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat',
  standalone: true,
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number | null | undefined, currency = 'EGP'): string {
    // TODO: Noura — replace with localized formatter (Intl.NumberFormat)
    if (value == null) return '';
    return `${value.toFixed(2)} ${currency}`;
  }
}

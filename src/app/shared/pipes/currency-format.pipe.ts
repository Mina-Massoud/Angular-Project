import { Pipe, PipeTransform } from '@angular/core';

type Currency = 'EGP' | 'USD' | 'EUR';

@Pipe({
  name: 'currencyFormat',
  standalone: true,
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number | null | undefined, currency: Currency = 'EGP'): string {
    if (value == null || Number.isNaN(value)) return '—';

    const locale =
      typeof navigator !== 'undefined' && navigator.language ? navigator.language : 'en-EG';

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }
}

import { Pipe, PipeTransform } from '@angular/core';

type Currency = 'EGP' | 'USD' | 'EUR';

@Pipe({
  name: 'currencyFormat',
  standalone: true,
})
export class CurrencyFormatPipe implements PipeTransform {

  transform(
    value: number | null | undefined,
    currency: Currency = 'EGP'
  ): string {

    if (value == null) return '—';

    const locale = navigator.language || 'en-US';

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  }
}
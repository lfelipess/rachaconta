import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the FormatCurrencyPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'formatCurrency',
})
export class FormatCurrencyPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: any, ...args):any {
    return new Intl.NumberFormat("pt-BR",{style:'currency', currency:'BRL'}).format(value);
  }
}

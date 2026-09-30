import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of, map } from 'rxjs';
import { ShippingOption, ShippingResult, ViaCepResult } from '../models/store.models';
export type { ShippingOption, ShippingResult, ViaCepResult };
import { DemoStorageService } from './demo-storage.service';

// Mapeamento das 5 macrorregiões do Brasil
const BRAZIL_REGIONS: Record<string, 'SE' | 'S' | 'CO' | 'NE' | 'N'> = {
  SP: 'SE', RJ: 'SE', MG: 'SE', ES: 'SE',
  PR: 'S', SC: 'S', RS: 'S',
  DF: 'CO', GO: 'CO', MT: 'CO', MS: 'CO',
  BA: 'NE', SE: 'NE', AL: 'NE', PE: 'NE', PB: 'NE', RN: 'NE', CE: 'NE', PI: 'NE', MA: 'NE',
  AM: 'N', PA: 'N', RO: 'N', AC: 'N', RR: 'N', AP: 'N', TO: 'N',
};

// Matriz de distância geográfica entre macrorregiões brasileiras:
// 0: Mesma macrorregião | 1: Regiões vizinhas | 2: Distância média | 3: Longa distância
const REGION_DISTANCE: Record<string, Record<string, number>> = {
  SE: { SE: 0, S: 1, CO: 1, NE: 2, N: 3 },
  S:  { S: 0, SE: 1, CO: 1, NE: 3, N: 3 },
  CO: { CO: 0, SE: 1, S: 1, N: 1, NE: 2 },
  NE: { NE: 0, SE: 2, CO: 2, N: 2, S: 3 },
  N:  { N: 0, CO: 1, NE: 2, SE: 3, S: 3 },
};

@Injectable({
  providedIn: 'root',
})
export class ShippingService {
  private http = inject(HttpClient);
  private demoStorage = inject(DemoStorageService);

  /** CEP informado para cotação */
  readonly currentCep = signal<string>('');

  /** Opção de frete atualmente selecionada pelo usuário */
  readonly selectedOption = signal<ShippingOption | null>(null);

  /** Último resultado de cotação retornado */
  readonly lastResult = signal<ShippingResult | null>(null);

  /** Flag indicando carregamento */
  readonly isCalculating = signal<boolean>(false);

  /** Custo do frete selecionado (0 se nenhum ou se for grátis) */
  readonly shippingCost = computed(() => this.selectedOption()?.price ?? 0);

  /**
   * Resolução inteligente do estado/região pelo prefixo do CEP brasileiro
   */
  private resolveCepRegion(cep: string): { state: string; city: string } {
    const num = parseInt(cep.slice(0, 5), 10);

    if (num >= 1000 && num <= 19999) return { state: 'SP', city: num <= 9999 ? 'São Paulo' : 'Interior/Litoral de SP' };
    if (num >= 20000 && num <= 28999) return { state: 'RJ', city: 'Rio de Janeiro' };
    if (num >= 29000 && num <= 29999) return { state: 'ES', city: 'Vitória' };
    if (num >= 30000 && num <= 39999) return { state: 'MG', city: 'Belo Horizonte' };
    if (num >= 40000 && num <= 48999) return { state: 'BA', city: 'Salvador' };
    if (num >= 49000 && num <= 49999) return { state: 'SE', city: 'Aracaju' };
    if (num >= 50000 && num <= 56999) return { state: 'PE', city: 'Recife' };
    if (num >= 57000 && num <= 57999) return { state: 'AL', city: 'Maceió' };
    if (num >= 58000 && num <= 58999) return { state: 'PB', city: 'João Pessoa' };
    if (num >= 59000 && num <= 59999) return { state: 'RN', city: 'Natal' };
    if (num >= 60000 && num <= 63999) return { state: 'CE', city: 'Fortaleza' };
    if (num >= 64000 && num <= 64999) return { state: 'PI', city: 'Teresina' };
    if (num >= 65000 && num <= 65999) return { state: 'MA', city: 'São Luís' };
    if (num >= 66000 && num <= 68899) return { state: 'PA', city: 'Belém' };
    if (num >= 68900 && num <= 68999) return { state: 'AP', city: 'Macapá' };
    if ((num >= 69000 && num <= 69299) || (num >= 69400 && num <= 69899)) return { state: 'AM', city: 'Manaus' };
    if (num >= 69300 && num <= 69399) return { state: 'RR', city: 'Boa Vista' };
    if (num >= 69900 && num <= 69999) return { state: 'AC', city: 'Rio Branco' };
    if ((num >= 70000 && num <= 72799) || (num >= 73000 && num <= 73699)) return { state: 'DF', city: 'Brasília' };
    if ((num >= 72800 && num <= 72999) || (num >= 73700 && num <= 76799)) return { state: 'GO', city: 'Goiânia' };
    if (num >= 76800 && num <= 76999) return { state: 'RO', city: 'Porto Velho' };
    if (num >= 77000 && num <= 77999) return { state: 'TO', city: 'Palmas' };
    if (num >= 78000 && num <= 78899) return { state: 'MT', city: 'Cuiabá' };
    if (num >= 79000 && num <= 79999) return { state: 'MS', city: 'Campo Grande' };
    if (num >= 80000 && num <= 87999) return { state: 'PR', city: 'Curitiba' };
    if (num >= 88000 && num <= 89999) return { state: 'SC', city: 'Florianópolis' };
    if (num >= 90000 && num <= 99999) return { state: 'RS', city: 'Porto Alegre' };

    return { state: 'SP', city: 'São Paulo' };
  }

  /**
   * Consulta ViaCEP no navegador
   */
  lookupCep(cep: string): Observable<ViaCepResult> {
    const clean = cep.replace(/\D/g, '');
    if (clean.length !== 8) {
      return of({ cep, logradouro: '', complemento: '', bairro: '', localidade: '', uf: '', erro: true });
    }

    return this.http.get<ViaCepResult>(`https://viacep.com.br/ws/${clean}/json/`).pipe(
      catchError(() => {
        const fallback = this.resolveCepRegion(clean);
        return of({
          cep: `${clean.slice(0, 5)}-${clean.slice(5)}`,
          logradouro: '',
          complemento: '',
          bairro: '',
          localidade: fallback.city,
          uf: fallback.state,
          erro: false,
        });
      })
    );
  }

  /**
   * Calcula as opções de frete (PAC e SEDEX) com base no endereço da loja e CEP do cliente.
   * Utiliza a mesma matriz de macrorregiões brasileiras da plataforma Lume.
   */
  calculate(destinationCep: string, subtotal: number): Observable<ShippingResult> {
    const cleanDest = destinationCep.replace(/\D/g, '');
    if (cleanDest.length !== 8) {
      return of(this.emptyResult());
    }

    this.isCalculating.set(true);
    this.currentCep.set(cleanDest);

    return this.lookupCep(cleanDest).pipe(
      map((viaCep) => {
        const destCity = viaCep.localidade || this.resolveCepRegion(cleanDest).city;
        const destState = (viaCep.uf || this.resolveCepRegion(cleanDest).state).toUpperCase();

        const custom = this.demoStorage.customBranding();
        const originCep = (custom.postalCode || '01310100').replace(/\D/g, '');
        const originState = (custom.state || this.resolveCepRegion(originCep).state || 'SP').toUpperCase();
        const originCity = custom.city || 'São Paulo';
        const originStreet = custom.street || 'Origem da Loja';

        const pacBase = Number(custom.pacBaseRate) || 19.90;
        const sedexBase = Number(custom.sedexBaseRate) || 32.90;
        const freeMin = Number(custom.freeShippingMin) || 299.00;
        const isFreeQualified = subtotal >= freeMin;

        const isSameState = destState === originState;
        const isLocalMetro = isSameState && originCep.length >= 2 && cleanDest.slice(0, 2) === originCep.slice(0, 2);

        let pacPrice = pacBase;
        let sedexPrice = sedexBase;
        let pacDeadline = '4 a 6 dias úteis';
        let sedexDeadline = '2 a 3 dias úteis';

        if (isSameState) {
          if (isLocalMetro) {
            // Entrega expressa metropolitana com 15% de desconto
            pacPrice = Math.round(pacBase * 0.85 * 100) / 100;
            sedexPrice = Math.round(sedexBase * 0.85 * 100) / 100;
            pacDeadline = '2 a 3 dias úteis';
            sedexDeadline = '1 a 2 dias úteis';
          } else {
            pacPrice = pacBase;
            sedexPrice = sedexBase;
            pacDeadline = '3 a 5 dias úteis';
            sedexDeadline = '1 a 2 dias úteis';
          }
        } else {
          // Distância entre macrorregiões
          const originRegion = BRAZIL_REGIONS[originState] || 'SE';
          const destRegion = BRAZIL_REGIONS[destState] || 'SE';
          const distanceLevel = REGION_DISTANCE[originRegion]?.[destRegion] ?? 2;

          switch (distanceLevel) {
            case 0: // Mesma Macrorregião (ex: SP <-> RJ)
              pacPrice = Math.round((pacBase + 5.0) * 100) / 100;
              sedexPrice = Math.round((sedexBase + 8.5) * 100) / 100;
              pacDeadline = '4 a 6 dias úteis';
              sedexDeadline = '2 a 3 dias úteis';
              break;
            case 1: // Regiões vizinhas imediatas (ex: Sudeste <-> Sul)
              pacPrice = Math.round((pacBase + 9.5) * 100) / 100;
              sedexPrice = Math.round((sedexBase + 16.0) * 100) / 100;
              pacDeadline = '5 a 8 dias úteis';
              sedexDeadline = '2 a 4 dias úteis';
              break;
            case 2: // Distância intermediária (ex: Sudeste <-> Nordeste)
              pacPrice = Math.round((pacBase + 14.0) * 100) / 100;
              sedexPrice = Math.round((sedexBase + 24.0) * 100) / 100;
              pacDeadline = '7 a 11 dias úteis';
              sedexDeadline = '3 a 5 dias úteis';
              break;
            case 3: // Longa distância (ex: Sul <-> Norte)
            default:
              pacPrice = Math.round((pacBase + 18.0) * 100) / 100;
              sedexPrice = Math.round((sedexBase + 34.0) * 100) / 100;
              pacDeadline = '9 a 14 dias úteis';
              sedexDeadline = '4 a 6 dias úteis';
              break;
          }
        }

        const options: ShippingOption[] = [
          {
            id: 'pac',
            name: 'PAC Correios (Econômico)',
            carrier: 'Correios Brasil',
            service: 'PAC',
            deadline: pacDeadline,
            price: isFreeQualified ? 0 : pacPrice,
            originalPrice: pacPrice,
            isFree: isFreeQualified,
          },
          {
            id: 'sedex',
            name: 'SEDEX Correios (Expresso)',
            carrier: 'Correios Brasil',
            service: 'SEDEX',
            deadline: sedexDeadline,
            price: sedexPrice,
            originalPrice: sedexPrice,
            isFree: false,
          },
        ];

        const result: ShippingResult = {
          origin: {
            postalCode: originCep.length === 8 ? `${originCep.slice(0, 5)}-${originCep.slice(5)}` : originCep,
            street: originStreet,
            city: originCity,
            state: originState,
          },
          destination: {
            postalCode: `${cleanDest.slice(0, 5)}-${cleanDest.slice(5)}`,
            city: destCity,
            state: destState,
          },
          freeShippingQualified: isFreeQualified,
          freeShippingThreshold: freeMin,
          options,
        };

        return result;
      }),
      tap((result) => {
        this.lastResult.set(result);
        this.isCalculating.set(false);

        // Pré-seleciona a opção econômica ou mantém a seleção atual
        const currentSelected = this.selectedOption();
        if (currentSelected) {
          const match = result.options.find((opt) => opt.id === currentSelected.id);
          this.selectedOption.set(match || result.options[0]);
        } else {
          this.selectedOption.set(result.options[0]);
        }
      }),
      catchError(() => {
        this.isCalculating.set(false);
        const empty = this.emptyResult();
        this.lastResult.set(empty);
        return of(empty);
      })
    );
  }

  /**
   * Define manualmente a opção de frete escolhida pelo cliente
   */
  selectOption(option: ShippingOption): void {
    this.selectedOption.set(option);
  }

  /**
   * Reseta as opções calculadas
   */
  clearShipping(): void {
    this.currentCep.set('');
    this.selectedOption.set(null);
    this.lastResult.set(null);
    this.isCalculating.set(false);
  }

  private emptyResult(): ShippingResult {
    return {
      origin: { postalCode: '', street: '', city: '', state: '' },
      destination: { postalCode: '', city: '', state: '' },
      freeShippingQualified: false,
      freeShippingThreshold: 299,
      options: [],
    };
  }
}

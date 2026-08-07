import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumLabel',
  standalone: true
})
export class EnumLabelPipe implements PipeTransform {

  transform(value: string | null | undefined): string {
    if (!value) return '';

    const labels: Record<string, string> = {
      // Statut
      DISPONIBLE: 'Disponible',
      LIMITE: 'Limité',
      INDISPONIBLE: 'Indisponible',

      // Catégories
      FORMULES: 'Formules',
      DECORATION: 'Décoration',
      RESTAURATION: 'Restauration',
      ANIMATION: 'Animation',
      PHOTOGRAPHIE: 'Photographie',
      TECHNIQUE: 'Technique',
      AUTRE: 'Autre'
    };

    return labels[value] ?? value;
  }
}
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartOptions, ChartType } from 'chart.js';

@Component({
  selector: 'app-finance-stats-component',
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './finance-stats-component.html',
  styleUrl: './finance-stats-component.scss',
})


export class FinanceStatsComponent implements OnInit {
  selectedPeriod: string = 'Juin 2024';

  stats = {
    revenus: 48650,
    depenses: 12840,
    beneficeNet: 35810,
    enAttente: 6420
  };

  // --- Graphique Barres ---
  public barChartType = 'bar' as const; // 👈 Fix avec 'as const'
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { border: { dash: [5, 5] }, grid: { color: '#f1f5f9' } }
    }
  };
  public barChartData: ChartData<'bar'> = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      { data: [25000, 28000, 22000, 32000, 28000, 38000], label: 'Revenus', backgroundColor: '#7c3aed', borderRadius: 6 },
      { data: [11000, 13000, 10000, 14000, 11000, 12840], label: 'Dépenses', backgroundColor: '#f97316', borderRadius: 6 }
    ]
  };

  // --- Graphique Doughnut ---
  public doughnutChartType = 'doughnut' as const; // 👈 Fix avec 'as const'
  public doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '75%',
    plugins: { legend: { display: false } }
  };
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: ['Fournisseurs', 'Personnel', 'Maintenance', 'Autres'],
    datasets: [
      {
        data: [40, 25, 18, 17],
        backgroundColor: ['#7c3aed', '#f97316', '#14b8a6', '#ddd6fe'],
        borderWidth: 0
      }
    ]
  };

  ngOnInit(): void {}
}
import { Component, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartOptions } from 'chart.js';
import { TransactionService } from '../../../../core/services/transaction/transaction-service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-finance-stats-component',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './finance-stats-component.html',
  styleUrl: './finance-stats-component.scss',
})
export class FinanceStatsComponent implements OnInit {

  selectedYear = signal<number>(2026);
  selectedMonth = signal<number>(0);

  @ViewChild('barChart') barChart?: BaseChartDirective;
  @ViewChild('doughnutChart') doughnutChart?: BaseChartDirective;


  stats = signal<any>({
    revenus: 0,
    revenusTrend: 0,
    depenses: 0,
    depensesTrend: 0,
    beneficeNet: 0,
    beneficeTrend: 0,
    enAttente: 0
  });


  categoriesList = signal<any[]>([]);
  revenus = signal<any[]>([]);
  depenses = signal<any[]>([]);

  private colorPalette: string[] = [
    '#7c3aed',
    '#f97316',
    '#14b8a6',
    '#f59e0b',
    '#ec4899',
    '#3b82f6',
    '#10b981'
  ];


  constructor(
    private transactionService: TransactionService
  ) {}


  // ================= BAR CHART =================

  public barChartType = 'bar' as const;


  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false
      }
    },

    scales: {
      x: {
        grid: {
          display: false
        }
      },

      y: {
        grid: {
          color: '#f1f5f9',
          tickBorderDash: [5, 5]
        }
      }
    }
  };


  public barChartData: ChartData<'bar'> = {

    labels: [
      'Jan',
      'Fév',
      'Mar',
      'Avr',
      'Mai',
      'Juin',
      'Juil',
      'Août',
      'Sep',
      'Oct',
      'Nov',
      'Déc'
    ],

    datasets: [

      {
        data: Array(12).fill(0),
        label: 'Revenus',
        backgroundColor: '#7c3aed',
        borderRadius: 6
      },

      {
        data: Array(12).fill(0),
        label: 'Dépenses',
        backgroundColor: '#f97316',
        borderRadius: 6
      }

    ]
  };



  // ================= DOUGHNUT =================


  public doughnutChartType = 'doughnut' as const;


  public doughnutChartOptions: ChartOptions<'doughnut'> = {

    responsive: true,

    maintainAspectRatio: false,

    cutout: '75%',

    plugins: {

      legend: {
        display: false
      }

    }

  };


  public doughnutChartData: ChartData<'doughnut'> = {

    labels: [],

    datasets: [
      {
        data: [],
        backgroundColor: [],
        borderWidth: 0
      }
    ]

  };



  ngOnInit(): void {

    this.loadStats();

    this.loadBarChart();

  }




  onFilterChange(): void {

    this.loadStats();

    this.loadBarChart();

  }





  private getPreviousPeriod(
    year: number,
    month: number
  ): {year:number, month:number} {


    if(month === 0){

      return {
        year: year - 1,
        month:0
      };

    }


    if(month === 1){

      return {
        year: year - 1,
        month:12
      };

    }


    return {
      year,
      month: month - 1
    };

  }





  private calculatePercentageChange(
    current:number,
    previous:number
  ):number {


    if(!previous || previous === 0){

      return current > 0 ? 100 : 0;

    }


    return ((current - previous) / previous) * 100;

  }






  // ================= KPIs =================


  loadStats():void {


    const currentYear = this.selectedYear();

    const currentMonth = this.selectedMonth();


    const previousPeriod =
      this.getPreviousPeriod(
        currentYear,
        currentMonth
      );



    forkJoin({

      current:
        this.transactionService
        .getFinanceSummary(
          currentYear,
          currentMonth
        ),


      previous:
        this.transactionService
        .getFinanceSummary(
          previousPeriod.year,
          previousPeriod.month
        )

    })

    .subscribe({

      next:(res:any)=>{


        const current = res.current || {};

        const previous = res.previous || {};



        const curRev =
          current.totalRevenus || 0;


        const prevRev =
          previous.totalRevenus || 0;



        const curDep =
          current.totalDepenses || 0;


        const prevDep =
          previous.totalDepenses || 0;



        const curNet =
          current.beneficeNet || 0;


        const prevNet =
          previous.beneficeNet || 0;



        this.stats.set({

          revenus:curRev,

          revenusTrend:
          this.calculatePercentageChange(
            curRev,
            prevRev
          ),


          depenses:curDep,

          depensesTrend:
          this.calculatePercentageChange(
            curDep,
            prevDep
          ),


          beneficeNet:curNet,


          beneficeTrend:
          this.calculatePercentageChange(
            curNet,
            prevNet
          ),


          enAttente:
          current.totalRevenusEnAttente || 0,


          nombreEnAttente:
          current.totalRevenusEnAttenteCount || 0

        });


      },


      error:(err)=>console.error(err)

    });




    // categories


    this.transactionService
    .getExpensesByCategory(
      currentYear,
      currentMonth
    )

    .subscribe({

      next:(categories:any[])=>{


        const labels =
        categories.map(c=>c.category);



        const data =
        categories.map(c=>c.total);



        const colors =
        categories.map(
          (_,i)=>
          this.colorPalette[
            i % this.colorPalette.length
          ]
        );



        this.categoriesList.set(

          categories.map((c,i)=>({

            ...c,

            color:colors[i]

          }))

        );



        this.doughnutChartData = {

          labels,

          datasets:[
            {

              data,

              backgroundColor:colors,

              borderWidth:0

            }

          ]

        };



        setTimeout(()=>{

          this.doughnutChart?.update();

        });

      }

    });


  }







  // ================= BAR CHART =================


  loadBarChart():void {


    this.transactionService
  .getBarChartData(this.selectedYear())
  .subscribe({
    next: (response: any[]) => {

      this.revenus.set(response.map(item => item.revenus));
      this.depenses.set(response.map(item => item.depenses));

      this.barChartData = {
        labels: [
          'Jan','Fév','Mar','Avr','Mai','Juin',
          'Juil','Août','Sep','Oct','Nov','Déc'
        ],
        datasets: [
          {
            data: this.revenus(),
            label: 'Revenus',
            backgroundColor: '#7c3aed',
            borderRadius: 6
          },
          {
            data: this.depenses(),
            label: 'Dépenses',
            backgroundColor: '#f97316',
            borderRadius: 6
          }
        ]
      };

      setTimeout(() => {
        this.barChart?.update();
      });

    },

    error: (err: any) => {
      console.error('Erreur bar chart:', err);
    }
  });
}


}
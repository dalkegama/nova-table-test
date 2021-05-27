import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from "@angular/core";
import {
  DataSourceService,
  ISortedItem,
  SorterDirection,
  TableComponent,
  VirtualViewportManager
} from "@nova-ui/bits";
import { IFilteringOutputs } from "@nova-ui/bits";
import { Subject } from "rxjs";
import { filter, switchMap, takeUntil, tap } from "rxjs/operators";
import { RESULTS_PER_PAGE } from "./data";
import { IServer } from "./types";
import { TableWithVirtualScrollDataSource } from "./data-source.service";


@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.less"],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [VirtualViewportManager,
    {
      provide: DataSourceService,
      useClass: TableWithVirtualScrollDataSource
    }
  ]
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  public items: IServer[] = [];
  public isBusy: boolean = false;
  // This value is obtained from the server and used to evaluate the total number of pages to display
  public totalItems: number = 0;

  // columns of the table
  public displayedColumns = ["name", "location", "status","position","description"];

  // sorting
  public sortedColumn: ISortedItem = {
    sortBy: "name",
    direction: SorterDirection.ascending
  };

  // search
  public searchTerm: string;
  public columnsToApplySearch = ["name"];
  public pageSize: number = RESULTS_PER_PAGE;

  @ViewChild(TableComponent) table: TableComponent<IServer>;
  @ViewChild(CdkVirtualScrollViewport) viewport: CdkVirtualScrollViewport;

  // the height in px of a single row from the table
  public rowHeight = 40;

  private destroy$ = new Subject();

  constructor(
    @Inject(DataSourceService)
    private dataSource: TableWithVirtualScrollDataSource<IServer>,
    @Inject(VirtualViewportManager) private viewportManager: VirtualViewportManager,
    private changeDetection: ChangeDetectorRef
  ) {}

  public ngOnInit() {
    this.dataSource.busy
      .pipe(
        tap((val) => {
          this.isBusy = val;
          this.changeDetection.detectChanges();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  public async ngAfterViewInit() {
    // register filter to be able to sort
    this.dataSource.registerComponent(this.table.getFilterComponents());
    this.dataSource.registerComponent({
      virtualScroll: { componentInstance: this.viewportManager }
    });
    this.viewportManager
      // Note: Initializing viewportManager with the repeat's CDK Viewport Ref
      .setViewport(this.viewport)
      // Note: Initializing the stream with the desired page size, based on which
      // VirtualViewportManager will perform the observations and will emit
      // distinct ranges with step equal to provided pageSize
      .observeNextPage$({ pageSize: this.pageSize })
      .pipe(
        // Since we know the total number of items we can stop the stream when dataset end is reached
        // Otherwise we can let VirtualViewportManager to stop when last received page range will not match requested range
        filter(() => !this.items.length || this.items.length < this.totalItems),
        tap(() => this.applyFilters(false)),
        // Note: Using the same stream to subscribe to the outputsSubject and update the items list
        switchMap(() =>
          this.dataSource.outputsSubject.pipe(
            tap((data: IFilteringOutputs) => {
              // data.repeat.itemsSource = this.generateUsers(10);
              // update the list of items to be rendered
              const items = data.repeat?.itemsSource || [];

              // after receiving data we need to append it to our previous fetched results
              this.items = this.items.concat(items);
              this.totalItems = data.paginator?.total || 0;
              this.changeDetection.detectChanges();
            })
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  public ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  public async onSearch() {
    await this.applyFilters();
  }

  public async onSearchCancel() {
    await this.applyFilters();
  }

  public async sortData(sortedColumn: ISortedItem) {
    this.sortedColumn = sortedColumn;
    await this.applyFilters();
  }

  public async applyFilters(resetVirtualScroll: boolean = true) {
    if (resetVirtualScroll) {
      // it is important to reset viewportManager to start page
      // so that the datasource performs the search with 1st page
      this.viewportManager.reset({ emitFirstPage: false });
    }

    // Every new search request or filter change should
    // clear the cache in order to correctly display a new set of data
    const filters = this.dataSource.getFilters();
    const reset = this.dataSource.computeFiltersChange(filters);
    if (reset || filters.virtualScroll?.value.start === 0) {
      this.items = [];
    }

    await this.dataSource.applyFilters();
  }
}

import { ScrollingModule } from "@angular/cdk/scrolling";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule, TRANSLATIONS, TRANSLATIONS_FORMAT } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import {
  NuiBusyModule, 
  NuiButtonModule,
  NuiChipsModule, 
  NuiIconModule,
  NuiLayoutModule, 
  NuiPaginatorModule,
  NuiPanelModule,
  NuiPopoverModule,
  NuiProgressModule,
  NuiRepeatModule,
  NuiSearchModule,
  NuiSorterModule,
  NuiSpinnerModule, NuiTableModule
} from "@nova-ui/bits";
import { AppComponent } from './app.component';
import { TableCellComponent } from './table-cell/table-cell.component';


@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    ScrollingModule,
    NuiPaginatorModule,
    NuiPanelModule,
    NuiProgressModule,
    NuiRepeatModule,
    NuiSearchModule,
    NuiSorterModule,
    NuiIconModule,
    NuiSpinnerModule,
    NuiTableModule,
    NuiBusyModule,
    NuiLayoutModule,
    NuiButtonModule,
    NuiChipsModule,
    NuiPopoverModule,
    HttpClientModule
  ],
    declarations: [	
    AppComponent,
      TableCellComponent
   ],
  providers: [
    {provide: TRANSLATIONS_FORMAT, useValue: "xlf"},
  
    {provide: TRANSLATIONS, useValue: ""},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import {
  IDataSource,
  INovaFilteringOutputs,
  LoggerService,
  ServerSideDataSource
} from "@nova-ui/bits";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { RESULTS_PER_PAGE } from "./data";


import {
  IServerFilters,
  IServersApiResponse,
  IServersCollection
} from "./types";

// @TODO customize the backend API URL
export const API_URL = "http://nova-pg.swdev.local/api/v1/servers";

/**
 * Example of a ServerSide DataSourceService which is using the Nova Backend API
 * to fetch data
 */
@Injectable()
export class TableWithVirtualScrollDataSource<T> extends ServerSideDataSource<T>
  implements IDataSource {
  constructor(private logger: LoggerService, private http: HttpClient) {
    super();
  }

  // build query params specific to our backend API
  private static getRequestParams(filters: IServerFilters): HttpParams {
    const paging = filters.virtualScroll?.value || { start: 0, end: 0 };
    let params = new HttpParams()
      // define the start page used by the virtual scroll internal "paginator"
      .set(
        "page",
        Math.ceil(paging.start / (paging.end - paging.start)).toString()
      )

      // specify the maximum number of items we need to fetch for each request
      .set("pageSize", String(RESULTS_PER_PAGE))
      .set("searchField", "name")
      .set("searchContent", filters.search?.value ?? "");

    if (filters.sorter?.value?.sortBy) {
      params = params.set("sortField", filters.sorter.value.sortBy);
      params = params.set(
        "sortOrder",
        filters.sorter.value.direction.toUpperCase()
      );
    }

    return params;
  }

  public async getFilteredData(
    data: IServersCollection
  ): Promise<INovaFilteringOutputs> {
    return of(data)
      .pipe(
        map((response: IServersCollection) => {
          const itemsSource = response.items;

          return {
            repeat: { itemsSource: itemsSource },
            paginator: {
              total: response.count
            }
          };
        })
      )
      .toPromise();
  }

  // This method is expected to return all data needed for repeat/paginator/filterGroups in order to work.
  // In case of custom filtering participants feel free to extend INovaFilteringOutputs.
  protected getBackendData(
    filters: IServerFilters
  ): Observable<IServersCollection> {
   return of(this.generateUsers()).pipe(map((response) => ({
     items: response.items,
     count:2
   })));
  }

  private generateUsers(): IServersApiResponse {
    return {
      count: 50,
      items: [
        {
          position: 1,
          item: "FOCUS-SVR-02258123",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          status: "status_inactive",
          location: "Brno"
        },
        {
          position: 2,
          item: "Man-LT-JYJ4AD5",
          description: "Sed ut perspiciatis unde omnis iste natus error sit.",
          status: "status_up",
          location: "Brno"
        },
        {
          position: 3,
          item: "FOCUS-SVR-02258",
          description:
            "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
          status: "status_up",
          location: "Brno"
        },
        {
          position: 4,
          item: "Man-LT-JYJ4AD5",
          description:
            "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
          status: "status_up",
          location: "Brno"
        },
        {
          position: 5,
          item: "Man-LT-JYJ4AD5",
          description:
            "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          status: "status_up",
          location: "Brno"
        },
        {
          position: 6,
          item: "Man-LT-JYJ4AD5",
          description:
            "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
          status: "status_up",
          location: "Brno"
        },
        {
          position: 7,
          item: "Man-LT-JYJ4AD5",
          description:
            "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur.",
          status: "status_up",
          location: "Brno"
        },
        {
          position: 8,
          item: "Man-LT-JYJ4AD5",
          description:
            "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.",
          status: "status_up",
          location: "Brno"
        },
        {
          position: 9,
          item: "Man-LT-JYJ4AD5",
          description:
            "Quis autem vel eum iure reprehenderit qui in ea voluptate.",
          status: "status_up",
          location: "Brno"
        },
        {
          position: 10,
          item: "Man-LT-JYJ4AD5",
          description:
            "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti.",
          status: "status_up",
          location: "Brno"
        },
        {
          position: 11,
          item: "FOCUS-SVR-111111",
          description:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          status: "status_inactive",
          location: "Brno"
        },
        {
          position: 12,
          item: "Man-LT-2222222",
          description: "Sed ut perspiciatis unde omnis iste natus error sit.",
          status: "status_up",
          location: "Brno"
        },
        {
          position: 13,
          item: "FOCUS-SVR-333333",
          description:
            "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
          status: "status_up",
          location: "Brno"
        },
        {
          position: 14,
          item: "Man-LT-444444",
          description:
            "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
          status: "status_up",
          location: "Brno"
        },
        {
          position: 15,
          item: "Man-LT-555555",
          description:
            "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          status: "status_up",
          location: "Brno"
        },
        {
          position: 16,
          item: "Man-LT-666666",
          description:
            "Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
          status: "status_up",
          location: "Brno"
        },
        {
          position: 17,
          item: "Man-LT-777777",
          description:
            "Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur.",
          status: "status_up",
          location: "Brno"
        },
        {
          position: 18,
          item: "Man-LT-888888",
          description:
            "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.",
          status: "status_up",
          location: "Brno"
        },
        {
          position: 19,
          item: "Man-LT-999999",
          description:
            "Quis autem vel eum iure reprehenderit qui in ea voluptate.",
          status: "status_up",
          location: "Brno"
        },
        {
          position: 20,
          item: "Man-LT-200000",
          description:
            "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti.",
          status: "status_up",
          location: "Brno"
        }
      ]
    };
  }
}

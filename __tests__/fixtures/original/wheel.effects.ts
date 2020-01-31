import { Injectable } from '@angular/core';
import {
  Actions,
  Effect,
  ofType,
} from '@ngrx/effects';
import {
  catchError,
  debounceTime,
  filter,
  map,
  mergeMap,
  startWith,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import {
  from,
  Observable,
  of,
} from 'rxjs';
import {
  Action,
  select,
  Store,
} from '@ngrx/store';
import {
  ROUTER_NAVIGATION,
  RouterNavigationAction,
  SerializedRouterStateSnapshot,
} from '@ngrx/router-store';
import { MatDialog } from '@angular/material/dialog';
import { SearchService } from '../services/search.service';
import {
  APPLY_FILTERS,
  ApplyFiltersAction,
  ChangePageAction,
  GET_RELATED_RESOURCE,
  NAVIGATE_ON_PAGE,
  REQUIRE_APPLY_CONFIRMATION,
  ResetExcludedItemsAction,
  ResetTermsAction,
  WheelLoadComplete,
  WheelLoadErrorAction,
  WHEEL_LOAD,
  WheelLoadAction,
  TermsNotFoundAction,
} from '../actions/search.actions';
import { BoolQueryHelper } from '../utils/bool-query-helper';
import {
  getSearchCard,
  State,
  getSearchObject,
} from '../reducers/root.reducer';
import { Router } from '@angular/router';
import {
  CollapseResourceFacetsAction,
  ExpandResourceFacetsAction,
} from 'search/actions/facet.actions';
import {
  WheelDecoratedObject,
  TabletSizes,
  AnswerTypes,
} from 'search/models/wheel';
import { ConfirmComponent } from 'search/components/confirm/confirm.component';
import { SearchTerm } from 'search/models/search-term';
import { WindowRefService } from '@inspire-design-lib/window-ref';
import {
  MAX_PAGE_NUMBER_WHEEL,
  MAX_TOTAL_PAGES_WHEEL,
} from 'search/models/search-results';

@Injectable()
export class WheelEffects {
  
  public wheelNavigationState$: Observable<SerializedRouterStateSnapshot> = this.actions$.pipe(
    ofType(ROUTER_NAVIGATION),
    map((action: RouterNavigationAction) => action.payload),
    filter((routerState: any) => /^\/search\/wheel(\W|)/.test(routerState.event.url)),
    map((routerPayload) => routerPayload.routerState),
  );

  @Effect()
  public routerNavigationParams$: Observable<any> = this.wheelNavigationState$.pipe(
    startWith({root: {queryParams: {page: 0, query: ''}}}),
    mergeMap((routerState: any) => of(new ChangePageAction(+routerState.root.queryParams.page || 0))),
  );

  @Effect()
  public loadWheel: Observable<any> = this.actions$.pipe(
    ofType(WHEEL_LOAD),
    map((action: any) => action.payload),
    switchMap((payload) => {
      const { router, universalLimiterIds, pageSize, blockStates } = payload;
      return this.searchService.getPOCWheel(
        router.rawQuery,
        ['Instance', 'FormatGroup'].indexOf(router.query[0].entityType) !== -1,
        router.pageNum,
        universalLimiterIds,
        pageSize,
      ).pipe(mergeMap((wheel: WheelDecoratedObject): Observable<Action> => {
        wheel.isACWheel = this.isACWheel(router.rawQuery);
        wheel.key = `${router.rawQuery}${router.pageNum}`;
        const page = Math.min(router.pageNum, MAX_PAGE_NUMBER_WHEEL);
        const totalPages = Math.min(wheel.totalPages, MAX_TOTAL_PAGES_WHEEL);
        const { terms, excludes } = this.boolQueryHelper.extractQuery$({ query: router.rawQuery }, wheel.initialResources);
        if (page < totalPages || totalPages === 0) {
          return of(
              new ResetTermsAction(terms),
              new ResetExcludedItemsAction(excludes),
              new CollapseResourceFacetsAction(),
              new WheelLoadComplete({ ...wheel, page, totalPages, universalLimiterIds }),
            );
          } else {
            return of(
              new ResetTermsAction(terms),
              new ResetExcludedItemsAction(excludes),
              new ExpandResourceFacetsAction(blockStates),
              new ChangePageAction(totalPages - 1),
              new ApplyFiltersAction(),
            );
          }
        }),
        catchError((error) => {
          this.router.navigate(['/404']);
          return of(
            new CollapseResourceFacetsAction(),
            new WheelLoadErrorAction(error),
            new TermsNotFoundAction(error),
          );
        }),
      );
    }),
  );

  @Effect()
  public loadWheelNavigation: Observable<any> = this.wheelNavigationState$.pipe(
    map((routerState) => {
      const {root: {queryParams}} = routerState;
      const query = this.boolQueryHelper.extractQuery(queryParams);
      const pageNum = Math.min(+queryParams.page, MAX_PAGE_NUMBER_WHEEL);
      return {query, rawQuery: queryParams.query, pageNum: pageNum || 0};
    }),
    switchMap((router) => {
      const blockStates: any[] = [];
      let pageSize;
      if (this.windowRef.isTablet()) {
        pageSize = TabletSizes.PAGE_SIZE;
      }
      const universalLimiterIds: string[] = [];
      return of(new WheelLoadAction({
        router,
        universalLimiterIds,
        pageSize,
        blockStates,
      }));
    }),
  );

  @Effect()
  public requireApplyConfirmation = this.actions$.pipe(
    ofType(REQUIRE_APPLY_CONFIRMATION),
    withLatestFrom(this.store.pipe(select(getSearchCard))),
    switchMap(([action, {isTermsChangesApplied}]: any) => {
      const appliedChanges$ = isTermsChangesApplied ? of(AnswerTypes.APPLY) :
        this.matDialog.open(ConfirmComponent, {
          data: {type: action.payload.type},
        }).afterClosed();
      return appliedChanges$.pipe(
        filter((answer) => answer !== AnswerTypes.CLOSE),
        switchMap((answer) =>
          answer === AnswerTypes.APPLY ? from(action.payload.onApply) : from(action.payload.onCancel || [])),
      );
    }),
  );

  @Effect({dispatch: false})
  public applyFilters = this.actions$.pipe(
    ofType(APPLY_FILTERS),
    debounceTime(300),
    withLatestFrom(this.store.pipe(select(getSearchCard))),
    map(([{payload}, {selectedTerms, selectedForExclusion, currentPage}]: any) => {
      const queryString = this.getWheelQueryString(selectedTerms, selectedForExclusion);
      return {queryString, currentPage};
    }),
    withLatestFrom(this.store.pipe(select(getSearchObject))),
    tap(([{queryString, currentPage}]) => {
      const queryParams = {
        query: queryString,
        page: currentPage,
      };
      this.router.navigate(['/search/wheel'], {queryParams});
    }),
  );

  @Effect({dispatch: false})
  public navigateOnPage = this.actions$.pipe(
    ofType(NAVIGATE_ON_PAGE),
    withLatestFrom(this.wheelNavigationState$),
    withLatestFrom(this.store.pipe(select(getSearchCard))),
    tap(([[action, routerState], {currentPage}]) => {
      const {root: {queryParams: prevQueryParams}} = routerState;
      const queryParams = {...prevQueryParams, page: currentPage};
      this.router.navigate(['/search/wheel'], {queryParams});
    }),
  );

  @Effect({dispatch: false})
  public openResourceFullCardFromACWheel = this.actions$.pipe(
    ofType(GET_RELATED_RESOURCE),
    tap((action: any) => {
      if (action.payload.isAC) {
        this.searchService.getSearchResults({
          metadataBoolQuery: action.payload.boolQuery,
        }).pipe(
          map((payload) => payload.data),
          tap((resources: any) => {
            const resource = resources[0];
            this.router.navigate(['/search/card'], {
              queryParams: {
                id: resource.id,
                entityType: resource.entityType,
              },
            });
          }),
        ).subscribe();
      } else {
        const [entityType, id] = action.payload.boolQuery.split(':');
        this.router.navigate(['/search/card'], {
          queryParams: {
            id,
            entityType,
          },
        });
      }
    }),
  );

  constructor(
    private readonly actions$: Actions,
    private readonly searchService: SearchService,
    private readonly boolQueryHelper: BoolQueryHelper,
    private readonly store: Store<State>,
    private readonly router: Router,
    private windowRef: WindowRefService,
    private matDialog: MatDialog,
  ) {}

  private isACWheel(rawQuery: string) {
    return ['Concept', 'Agent'].indexOf(rawQuery.replace(/^(\(|)(\w*?):.*/g, '$2')) >= 0;
  }

  private getWheelQueryString(selectedNodes: SearchTerm[][], excludedNodes: SearchTerm[]): string {
    const filteredSelectedNodes = selectedNodes.every((group) => group.every(
      (term) => ['Instance', 'FormatGroup'].indexOf(term.entityType) !== -1))
      ? selectedNodes
      : selectedNodes.map((group) => {
        return group.filter((term) => ['Instance', 'FormatGroup'].indexOf(term.entityType) === -1);
      });
    const searchTermsString = filteredSelectedNodes.filter((group) => group.length)
      .map((group, groupNum) => {
        return group.reduce((acc, curr, i) => {
          let start = groupNum === 0 && i === 0 ? '' : ` ${curr.operator} `;
          let end = '';
          if (group.length > 1) {
            if (i === 0) {
              start += '(';
            }
            if (i === (group.length - 1)) {
              end += ')';
            }
          }
          return acc + `${start}${curr.entityType}:${curr.id}${end}`;
        }, '').trim();
      }).join(' ');
    const excludedItemsString = excludedNodes
      .map((item) => ` AND NOT(${item.entityType + ':' + item.id})`)
      .join('');
    return (searchTermsString + excludedItemsString)
      .replace(/^\s*(AND|OR)\s*/, '');
  }
}

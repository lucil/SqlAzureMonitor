interface PerformanceDataState {
  queries: PerformanceQuery[];
  numberOfQueries: number;
  orderByField: string;
  orderBySort: string;
  loading: boolean;
}
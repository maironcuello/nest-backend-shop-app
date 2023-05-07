export interface ErrorDbPostgres {
  length: number;
  severity: string;
  code: string;
  detail: string;
  hint: undefined;
  position: undefined;
  internalPosition: undefined;
  internalQuery: undefined;
  where: undefined;
  schema: string;
  table: string;
  column: undefined;
  dataType: undefined;
  constraint: string;
  file: string;
  line: string;
  routine: string;
}

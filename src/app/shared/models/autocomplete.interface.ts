export interface AutocompleteResponse {
  id: number;
  value: string;
  salePrice?: number;
  purchasePrice?: number;
}

export interface AutocompleteSaveResponse {
  message: string;
  item: AutocompleteResponse;
}

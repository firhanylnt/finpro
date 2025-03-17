export interface Stock {
  id: number;
  products: {
    name: string
  };
  qty: number;
}

export interface ReportStock {
  id: number;
  name: string;
  store_name: string;
  total_in: number;
  total_out: number;
  total: number;
}
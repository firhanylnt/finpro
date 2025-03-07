export default interface Discount {
    id: number;
    name: string;
    coupon: string;
    amount: number;
    min_purchase: number;
    max_disxount: number;
    start_date: Date;
    end_date: Date;
    discounttype: {
      name: string;
    },
    productdiscount: [
      {
        products: {
          name: string;
        }
      }
    ],
    stores: {
      name: string;
    }
  }
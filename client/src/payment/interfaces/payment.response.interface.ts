export interface PaymentResponseInterface {
  id: string;
  status: string;
  confirmation: {
    confirmation_url: string;
  };
}

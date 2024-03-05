export interface Client {
  Config_ID: number;
  CompanyName_VC: string;
  UseDomain_VC: string;
  VirtualPath_VC: string;
  MonthlySubscription_INT: number;
  SetUpFee_INT: number;
  IsActive_INT: number;
  IsSuspended_INT: number;
  Product_INT?: number;
  Product?: number;
  ProductNew?: number;
  ProductNewName?: string;
  IsLive_INT: number;
  ClientStatus_INT: number;
  Created_DT: string;
  OrderRecieved_DT: string;
  WentLive_DT: string;
  VAT_Rate_FLT: number;
  Internal_INT: number;
  Marketing_INT: number;
  PaymentMethod_INT: number;
  PaymentPeriod_INT: number;
  RenewalDate_Dt: string;
  MonthlySubscriptionNew: number;
}
export interface Bundle {
  id?: number;
  bundle_id?: number;
  BundleType_INT: number;
  Allowance_INT: number;
  PricePerMonth_INT: number;
  IsApproved: number;
  Name: string;
  BundleTypeName: string;
  Discount_INT: number;
}
export interface Package {
  ID: number;
  PackageName_VC: string;
}

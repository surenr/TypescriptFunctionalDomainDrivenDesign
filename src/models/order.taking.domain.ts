import { ValidateName } from './order.taking.domain';
import { Undefined, Decimal, ValidationResponse, ValidationErrors, Type } from './domain.base';

export class UnvalidatedName {
  public readonly kind = 'UnvalidatedName';
  constructor(public value: string) {}
}

export class ValidatedName {
  public readonly kind = 'ValidatedName';
  constructor(public value: string) {}
}

export class CustomerId {
  public readonly kind = 'CustomerId';
  constructor(public value: number) {}
}
export class OrderId {
  public readonly kind = 'OrderId';
  constructor(public value: number) {}
}

export class WidgetCode extends Type<string> {
  public readonly kind = 'WidgetCode';
}

export class GizmoCode extends Type<string>{
  public readonly kind = 'GizmoCode';
  public equals(other: string): boolean {
    const thisSplit = this.value.split('-')[0];
    const otherSplit = other.split('-')[0];
    return thisSplit === otherSplit
  }
}

export class UnitQuantity { 
  public readonly kind = 'UnitQuantity';
  constructor(public value: number){}
}

export class KilogramQuantity {
  public readonly kind = 'KilogramQuantity';
  constructor(public value: Decimal) {}
}

// Define a type CustomerInfo witch is an Undefined at the moment, Ideally all types that extend Undefined 
// Will be replaced with actual types. This is temp measure to continue model with unknown structures 
export class CustomerInfo extends Undefined { public readonly kind = 'CustomerInfo' }
export class ShippingAddress extends Undefined { public readonly kind = 'ShippingAddress' }
export class BillingAddress extends Undefined { public readonly kind = 'BillingAddress' }
export class OrderLine extends Undefined { public readonly kind = 'OrderLine' }
export class BillingAmount extends Undefined { public readonly kind = 'BillingAmount' }
export class AcknowledgementSent extends Undefined { public readonly kind = 'AcknowledgementSent'}
export class OrderPlaced extends Undefined { public readonly kind = 'OrderPlaced'}
export class BillableOrderPlaced extends Undefined { public readonly kind = 'BillableOrderPlaced'}
export class UnvalidatedOrder extends Undefined { public readonly kind = 'UnvalidatedOrder'}
export class QuoteForm extends Undefined { public readonly kind = 'QuoteForm'}
export class OrderForm extends Undefined { public readonly kind = 'OrderForm'}
export class EnvelopContents extends Undefined { public readonly kind = 'EnvelopContents'}

export class Order {
  public readonly kind = 'Order';
  constructor(
    public customerInfo: CustomerInfo,
    public shippingAddress: ShippingAddress,
    public billingAddress: BillingAddress,
    public orderLines: Array<OrderLine>,
    public AmountToBill: BillingAmount
  ){}
}


// Modeling Choice types
// CHOICE TYPES ARE DIRECTLY DEFINED AS 'TYPE' 
export type ProductCode = WidgetCode | GizmoCode;
export type OrderQuantity = UnitQuantity | KilogramQuantity;
export type CategorizedEmail = QuoteForm | OrderForm;

// MODELING MULTIPLE OUTPUT AS PRODUCT TYPE
export class PlaceOrderEvent {
  constructor(
    public acknowlegementSent: AcknowledgementSent,
    public orderPlaced: OrderPlaced,
    public billableOrderPlaced: BillableOrderPlaced
  ){}
}

// MODELING BEHAVIOUR 
export function validationResponse<T>(result?: T, errors?: Array<Error>): ValidationResponse<T> {
  if (result && !errors) 
    return (new ValidationResponse(result))
  else if (!result && errors && errors.length > 0)
    return new ValidationResponse<T>(new ValidationErrors(errors))
  else {
    const defaultValidationError = new Error('Unexpected Error occured');
    return new ValidationResponse<T>(new ValidationErrors([defaultValidationError]))
  }  
}
export type ValidateName = (name: UnvalidatedName) => ValidationResponse<ValidatedName>;
export type PlaceOrder = (unvalidatedOrder: UnvalidatedOrder) => PlaceOrderEvent;
export type CategorizeInboundEmail = (envelop: EnvelopContents) => CategorizedEmail;


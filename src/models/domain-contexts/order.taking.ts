import { Type, Undefined, List, ValidationErrors, ErrorType, Result, isNumber, NonEmptyList, isEmail, Command } from '../domain.base';

export class kg extends Type<kg> { public readonly kind='kg'; constructor(public value: number) { super() }};
type m = number;
export class WidgetCode extends Type<WidgetCode> { 
  public readonly kind = 'WidgetCode';
  public static Create(value: string): Result<WidgetCode, ErrorType> {
    // Start with a W and 4 digits
    const codeValue = value.toUpperCase();
    const firstLetter = codeValue.substr(0,1);
    const otherNumbers = codeValue.substr(1, codeValue.length);

    if(firstLetter !== 'W') return ErrorType.Create('Widget code has to begin with a letter "W"');
    if (otherNumbers.length > 4) return ErrorType.Create( 'Widget code length invalid.')
    if(!isNumber(otherNumbers)) return ErrorType.Create ('Widget code should contain 4 numbers')
    return new WidgetCode(value)
  }
  private constructor(public value: string) { super()}
}
export class GizmoCode extends Type<GizmoCode> { public readonly kind ='GizmoCode'; constructor(public value: string) { super()} }
export class UnvalidatedWidgetCode extends Type<UnvalidatedWidgetCode> { public readonly kind = 'UnvalidatedWidgetCode'; constructor( public value: string) { super() } }
export class UnvalidatedGizmoCode extends Type<UnvalidatedGizmoCode> { public readonly kind = 'UnvalidatedGizmoCode'; constructor( public value: string) { super() } }

type ProductCode = WidgetCode | GizmoCode;
type UnvalidatedProductCode = UnvalidatedWidgetCode | UnvalidatedGizmoCode;

export class UnitQuantity extends Type<UnitQuantity> { public readonly kind = 'UnitQuantity'; constructor(public value: number) { super()} }
export class UnvalidatedUnitQuantity extends Type<UnvalidatedUnitQuantity> { public readonly kind = 'UnvalidatedUnitQuantity'; constructor(public value: number) { super()} }

export class KilogramQuantity extends Type<KilogramQuantity> {
  public readonly kind = 'KilogramQuantity';
  public static Create(amount: kg): Result<KilogramQuantity, ErrorType> {
    if (amount.value < 0.05 || amount.value > 100) return ErrorType.Create('Kilograms should be between 0.05 and 100')
    return new KilogramQuantity(amount.value)
  }
  private constructor(public value: number) { super()}
}
export class UnvalidatedKilogramQuantity extends Type<UnvalidatedKilogramQuantity> { public readonly kind = 'UnvalidatedKilogramQuantity'; constructor(public value: number) { super()} }

type OrderQuantity = UnitQuantity | KilogramQuantity;
type UnvalidatedOrderQuantity = UnvalidatedUnitQuantity | UnvalidatedKilogramQuantity;

export class OrderId extends Undefined { public readonly kind = 'OrderId'; }
export class OrderLineId extends Undefined { public readonly kind = 'OrderLineId'; }
export class CustomerId extends Undefined { public readonly kind = 'CustomerId'; }
export class CustomerInfo extends Undefined { public readonly kind = 'CustomerInfo'; }

export class UnvalidatedBillingAmount extends Undefined { public readonly kind = 'UnvalidatedBillingAmount'; }

export class AcknowlegementSent extends Undefined { public readonly kind = 'AcknowlegementSent'; }
export class OrderPlaced extends Undefined { public readonly kind = 'OrderPlaced'; }
export class BillableOrderPlaced extends Undefined { public readonly kind = 'BillableOrderPlaced'; }

export class Price extends Type<Price> {
  public readonly kind = 'Price';
  public static Create(price: number): Result<Price, ErrorType> {
    if (price < 0) return ErrorType.Create('Invalid price');
    return new Price(price)
  }
  private constructor(public value: number) { super() }
}

export class BillingAmount extends Type<BillingAmount> {
  public readonly kind = 'BillingAmount';
  public static Create(amount: Price): BillingAmount {
    return new BillingAmount(amount.value)
  }
  private constructor(public value: number) { super () }
}

export class OrderLine extends Type<OrderLine> {
  public readonly kind = 'OrderLine';
  constructor (
    public id: OrderLineId,
    public orderId: OrderId,
    public productCode: ProductCode,
    public orderQuantity: OrderQuantity,
    public price: Price,

  ) { super() }
}

export class UnvalidatedOrderLine extends Type<UnvalidatedOrderLine> {
  public readonly kind = 'OrderLine';
  constructor (
    public id: OrderLineId,
    public orderId: OrderId,
    public productCode: UnvalidatedProductCode,
    public orderQuantity: UnvalidatedOrderQuantity,
  ) { super() }
}

export class ValidatedOrderLine extends Type<ValidatedOrderLine> {
  public readonly kind = 'OrderLine';
  constructor (
    public id: OrderLineId,
    public orderId: OrderId,
    public productCode: ProductCode,
    public orderQuantity: OrderQuantity,
  ) { super() }
}

export class PricedOrder extends Type<PricedOrder> {
  public readonly kind = 'PricedOrder';
  constructor(
    public id: OrderId,
    public customerId: CustomerId,
    public shippingAddress: ValidatedAddress,
    public billingAddress: ValidatedAddress,
    public orderLines: NonEmptyList<OrderLine>,
    public amountToBill: BillingAmount
  ){ super() }
}

export class UnvalidatedOrder extends Type<UnvalidatedOrder> {
  public readonly kind = 'UnvalidatedOrder';
  constructor(
    public id: OrderId,
    public customerId: CustomerId,
    public shippingAddress: UnvalidatedAddress,
    public billingAddress: UnvalidatedAddress,
    public orderLines: List<UnvalidatedOrderLine>
  ){ super() }
}

export class ValidatedOrder extends Type<ValidatedOrder> {
  public readonly kind = 'ValidatedOrder';
  constructor(
    public id: OrderId,
    public customerId: CustomerId,
    public shippingAddress: ValidatedAddress,
    public billingAddress: ValidatedAddress,
    public orderLines: List<ValidatedOrderLine>
  ){ super() }
}

export type Order = UnvalidatedOrder | ValidatedOrder | PricedOrder;

export class PlaceOrderEvents extends Type<PlaceOrderEvents> {
  public readonly kind = 'PlaceOrderEvents';
  constructor(
    public acknowledgementSent: AcknowlegementSent,
    public orderPlaced: OrderPlaced,
    public billableOrderPlaced: BillableOrderPlaced,
  ) { super () }
}

type PlaceOrderError = ValidationErrors | ErrorType;

export class EmailAddress extends Type<EmailAddress> {
  public readonly kind = 'EmailAddress';
  public static Create(email: string): Result<EmailAddress, ErrorType> {
    if(!isEmail(email)) return ErrorType.Create('Invalid email address');
    return new EmailAddress(email);
  }
  private constructor(public value: string) {
    super()
  }
}

export class VerifiedEmailAddress extends Type<VerifiedEmailAddress> {
  public readonly kind = 'VerifiedEmailAddress';
  public static Create(email: EmailAddress): VerifiedEmailAddress {
    return new VerifiedEmailAddress(email.value)
  }
  private constructor(public value: string) {
    super()
  }
}
export class UnvalidatedAddress extends Type<UnvalidatedAddress> {
  public readonly kind = 'PostalContractInfo';
  public static Create(
    houseNumber: number,
    streedAddress: string,
    postalCode: string,
    country: string
  ): UnvalidatedAddress {
    return new UnvalidatedAddress(houseNumber, streedAddress, postalCode, country)
  }
  private constructor(
    public houseNumber: number,
    public streedAddress: string,
    public postalCode: string,
    public country: string
  ) { super() }
}

export class ValidatedAddress extends Type<ValidatedAddress> {
  public readonly kind = 'ValidatedAddress';

  public Create(address: UnvalidatedAddress): ValidatedAddress {
    return new ValidatedAddress(address.houseNumber, address.streedAddress, address.postalCode, address.country);
  }
  private constructor(
    public houseNumber: number,
    public streedAddress: string,
    public postalCode: string,
    public country: string
  ) { super() }
}


type EmailContactInfo = EmailAddress | VerifiedEmailAddress;
type PostalContactInfo = UnvalidatedAddress | ValidatedAddress;
type SendPasswordResetEmail = (email: VerifiedEmailAddress) => void;
type VerifyEmailAddress = (email: EmailAddress) => VerifiedEmailAddress;
type AddressValidationService = (address: UnvalidatedAddress) => ValidatedAddress;
export type ChangeOrderLinePrice = (order: PricedOrder, orderLineId: OrderLineId, newPrice: Price) => Result<Order, ErrorType>;

export class PostalAndEmailContact extends Type<PostalAndEmailContact> {
  public readonly kind = 'PostalAndEmailContact';
  public static Create(emailContact: EmailContactInfo, postalContact: PostalContactInfo): PostalAndEmailContact {
    return new PostalAndEmailContact(emailContact, postalContact)
  }
  private constructor(public emailContactInfo: EmailContactInfo, public postalContactInfo: PostalContactInfo) { super() }
}

type ContactInfo = EmailContactInfo | PostalContactInfo | PostalAndEmailContact
type PlaceOrder = Command<UnvalidatedOrder>;
type GetProductPrice = (productCode: ProductCode) => Price;
type PriceOrder = (getProductPrice: GetProductPrice) => (validatedOrder: ValidatedOrder) => PricedOrder;
export type Greet = (greeting: string) => (name: string) => string;






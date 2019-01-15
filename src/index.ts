
import { WidgetCode, kg, KilogramQuantity, Order, OrderLineId, Price, BillingAmount, UnvalidatedOrder,
  PricedOrder, ChangeOrderLinePrice, Greet } from './models/domain-contexts/order.taking';
import { ErrorType, NonEmptyList, Result, pipe, Command } from './models/domain.base';


console.log('Basic Model Results');
const widgetCode1 = WidgetCode.Create('W1223');
const weight: kg = new kg(5);
const kilogramUnit = KilogramQuantity.Create(new kg(10)) // Ensures the kilogram quantity can only be created using Kgs Very expressive 
if (widgetCode1 instanceof ErrorType) throw widgetCode1.value;
if (kilogramUnit instanceof ErrorType) throw kilogramUnit.value;
const test = NonEmptyList.Create<any>(['abc','def']);
console.log(test)
console.log('Widget Code 1 created!! ', widgetCode1)
console.log('Kilogram unit created: ',  kilogramUnit.value)

const changeOrderLinePrice: ChangeOrderLinePrice = (order: PricedOrder, orderLineId: OrderLineId, newPrice: Price): Result<Order, ErrorType> => {
  const orderLine = order.orderLines.find((orderLine) => orderLine.id === orderLineId);
  if(!orderLine) return ErrorType.Create('OrderLine not found')
  const newOrderLine = orderLine.with({price: newPrice});
  const newOrderLines = [...order.orderLines.filter((orderLine) => orderLine.id !== orderLineId), newOrderLine];
  const newOrderLinesTotal = Price.Create(newOrderLines.reduce((sum: number, orderLine) => sum += orderLine.price.value, 0))
  if (newOrderLinesTotal instanceof ErrorType) return newOrderLinesTotal
  return order.with({
    orderLines: NonEmptyList.Create(newOrderLines),
    amountToBill: BillingAmount.Create(newOrderLinesTotal)
  })
}

const greetMethod: Greet =  (greet: string) => (name: string) => `${greet} ${name}!!`;
const helloGreet = greetMethod('Hello');
const goodEveningGreet = greetMethod('Good Evening');
console.log(helloGreet('Suren'));
console.log(goodEveningGreet('Kamal'))
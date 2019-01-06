
import { CustomerId, OrderId, ProductCode, WidgetCode,
  GizmoCode, UnvalidatedName, ValidateName, ValidatedName, validationResponse } from './models/order.taking.domain';
import { equals,  pipe, AsyncFunc, asyncCall, Number, ValidationResponse, ErrorType } from './models/domain.base';



const customerId: CustomerId = new CustomerId(42);
const newCustomer: CustomerId = new CustomerId(42);
const orderId: OrderId = new OrderId(42);
const processCustomerId = (customerId: CustomerId) => console.log(customerId);
processCustomerId(customerId)
console.log(equals(customerId, newCustomer))
const {value} = customerId; // WE LOOSE TYPE SAFTY, VALUE IS NOW A NORMAL NUMBER
// NEVER USE PARAMETER LEVEL DESTRUCTION, DESTRUCT THE TYPE WITHIN THE METHOD WHICH IS ALWAYS TYPE SAFE
console.log(newCustomer)

const processCode = (code: ProductCode) => {
  switch(code.kind) {
    case "GizmoCode": return `Your Product Gizmo Code: ${code.value}`
    case 'WidgetCode': return `Your Product Widget Code: ${code.value}`
    default: const exh: never = code
  }
}
const widgetCode: WidgetCode = new WidgetCode('AB384839');
const gizmoCode: GizmoCode = new GizmoCode('DE858384');

console.log(processCode(widgetCode));
console.log(processCode(gizmoCode));

const unvalidatedName: UnvalidatedName = new UnvalidatedName('Suren Rodrigo Dinesh');

const nameValidator = (name: UnvalidatedName): ValidationResponse<ValidatedName> => {
  const  {
    value = ''
  } = name;
  return (value.length !== 0 && value.length <= 20)
    ? validationResponse<ValidatedName>(new ValidatedName(value))
    : validationResponse<ValidatedName>(undefined, [new Error('name Invalid length')])
}

// Methods with type safetly, make sure we can't process Names without the proper validator methods
const processNames = (name: UnvalidatedName, nameValidator: ValidateName): ValidationResponse<ValidatedName> => {
  return nameValidator(name)
}

// Example of destructing the results from response
const {value: nameProcessResult} = processNames(unvalidatedName, nameValidator);
switch(nameProcessResult.kind) {
  case 'ValidatedName': 
    console.log('Validated Name: ', nameProcessResult.value)
  break;
  case 'ValidationErrors':
    console.log('Validatin Errors', nameProcessResult.value)
    break;
  default:  const exh: never = nameProcessResult
  


}


const double = (x: number) => x * 2;
const squre = (x: number) => x * x;
const doubleSqure = pipe(double, squre);
const squreDouble = pipe(squre, double);
console.log(doubleSqure(5), squreDouble(5))

const asyncFunc: AsyncFunc<Number, Number> = (asyncParam: Number) => new Promise<Number>((resolve, reject) => {
  setTimeout(() => {
    if(asyncParam.value === 5) return resolve(new Number(10))
    else 
      reject(new ErrorType(new Error('Invalid Number'))) // TODO: Create a wrapper function to generate Errors
  }, 1000);
});

const widgetCode1 = new WidgetCode('33843');
const widgetCode2 = new WidgetCode('33843');
console.log('EQUALITY CHECK: ', widgetCode1.equals(widgetCode2.value))
const gizmoCode1 = new GizmoCode('111-237248-2939');
const gizmoCode2 = new GizmoCode('11w1-384838-2882');
console.log('GIZMO CODE EQUALITY CHECK: ', gizmoCode1.equals(gizmoCode2.value))
console.log(gizmoCode1 instanceof GizmoCode)

async function main() {
  console.log('Main Method simulation');
  const {value: result} = await asyncCall<Number, Number>(asyncFunc, new Number(10))
  console.log(result.kind)
  switch(result.kind) {
    case "Number":
      return console.log('Number Is: ', result.value)
    case "Error":
      return console.log('Error Message: ', result.message);
    default: const exh: never = result
  }
}
main()
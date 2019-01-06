
export abstract class Type<T> {
  constructor(public value: T) {}
  public equals(other: T): boolean {
    if (typeof this.value === 'object') {
       if(this.value instanceof Type) {
         return this.value.equals(other)
       }
    }
    return this.value === other;
  }
}

export class List<T> extends Array<T> {}
export const pipe = (...fns: any) => (x: any) => fns.reduce((v: any, f: (arg0: any) => void) => f(v), x)

export function equals<T>(first: T, second: T): boolean {
  for (const prop in first) {
    if (first[prop] !== second[prop]) return false
  }
  return true;
}


// MODELING ASYNC BEHAVIOUR
export type AsyncFunc<T, P> = (params: P) => Promise<T>
export async function asyncCall<T, P> (asyncFunc: AsyncFunc<T,P>, params: P): Promise<AsyncResponse<T>> {
  try {
    const result = await asyncFunc(params);
    return new AsyncResponse<T>(result)
  }catch (error) {
      return new AsyncResponse<T>(error)
  }
}

export function safePromise (promise: any) {
  return promise
    .then((result: any) => [undefined, invalidToUndefined(result)])
    .catch((error: any) => [error, undefined])
}


export function invalidToUndefined (object: any) {
  if(!object) return undefined;
  for (const prop in object) {
    object[prop] = object[prop] ? object[prop] : undefined
  }
  return object
}

export class Decimal  extends Type<number> {public readonly kind = 'Decimal'}
export class Number  extends Type<number>{public readonly kind = 'Number'}

export class String extends Type<string> {public readonly kind = 'String'}

export class ErrorType extends Type<Error>{
  public readonly kind = 'Error';
  public readonly message: string = '';
  constructor(value: Error){
    super(value)
    this.message = value.message
  }
  public equals(other: Error): boolean {
    return this.value.message === other.message
  }
}
export class Undefined extends Type<undefined>{}

export type Result<T, U> = T | U;

export class ValidationErrors extends Type<Error[]> {
  public readonly kind = 'ValidationErrors';
  public equals(other: Error[]): boolean {
    if (this.value.length !== other.length) return false;
    for(let i = 0; i<this.value.length; i++) {
      if (this.value[i].message !== other[i].message) return false;
    }
    return true;
  }
}

export class ValidationResponse<T> extends Type<Result<T, ValidationErrors>> {public readonly kind = 'ValidationResponse'}
export class AsyncResponse<T> extends Type<Result<T, ErrorType>> {public readonly kind = 'AsyncResponse'}


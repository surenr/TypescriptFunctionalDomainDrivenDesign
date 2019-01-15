import uuid from 'uuid/v4';
import { UnvalidatedOrder } from './domain-contexts/order.taking';
export abstract class Type<T> {
  
  public equals(other: T): boolean {
    const current = <any>this;
    const second = <any>other;
    if (typeof other === 'object') {
       for(const key of Object.keys(this)) {
         if((current[key] !== second[key])) return false;
       }  
    } else {
      throw new Error('Can not equal non object types')
    }
    return true;
  }
  public with(updates: any): T {
    const current: any = this;
    if (typeof updates === 'object') {
      for(const key of Object.keys(updates)){
        if(!current[key]) throw new Error('One or more missmatched keys')
      }
      return <T>({
        ...this,
        ...updates,
      });
    } else {
      throw new Error('Invalid object compatibility.')
    }
  }
}

// export class Decimal  extends Type<number> {public readonly kind = 'Decimal'}
// export class Number  extends Type<number>{public readonly kind = 'Number'}

// export class String extends Type<string> {public readonly kind = 'String'}

export class List<T> extends Array<T> {}
export class NonEmptyList<T> extends List<T> {
  public first: T;
  public rest: T[];
  public static Create<T>(list: T[]): Result<NonEmptyList<T>, ErrorType> {
    if (!list || list.length === 0) return ErrorType.Create('List can not be empty')
    return new NonEmptyList<T>(list);
  }
  private constructor(list: T[]) {
    super()
    const [firstElm, ...restElm] = list;
    this.first = firstElm;
    this.rest = restElm;
  }
}
const pipeLocal = (...fns: any) => (x: any) => fns.reduce((v: any, f: (arg0: any) => void) => f(v), x)

export function pipe<T>(...fns: any): T {
  return <T>(<any>(pipeLocal(fns)));
}

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



export class ErrorType extends Type<Error>{
  public readonly kind = 'Error';
  public readonly message: string = '';
  public static Create(message: string) {
    return new ErrorType(new Error(message))
  }
  private constructor(public value: Error){
    super()
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
  constructor(public value: Error[]) { super () }
  public equals(other: Error[]): boolean {
    if (this.value.length !== other.length) return false;
    for(let i = 0; i<this.value.length; i++) {
      if (this.value[i].message !== other[i].message) return false;
    }
    return true;
  }
}

export class ValidationResponse<T> extends Type<Result<T, ValidationErrors>> {
  public readonly kind = 'ValidationResponse'
  constructor(public value: Result<T, ValidationErrors>) { super() }
}
export class AsyncResponse<T> extends Type<Result<T, ErrorType>> {
  public readonly kind = 'AsyncResponse';
  constructor(public value: Result<T, ErrorType>) { super() }
}

// Common Util Functions
export function isNumber(value: string | number): boolean {
    return !isNaN(Number(value.toString()));
}

export function isEmail(value: string): boolean {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(value).toLowerCase());
}

export class Command<T> {
  public id: string;
  public timeStamp: Date;
  constructor(public data: T, public userId: string) {
    this.id = uuid();
    this.timeStamp = new Date();
  }
}



// type Type <T> = {
//   name: string,
//   value: T,
//   equals(other: T): boolean,
// }

// function Type<T>(type: T) : Type<T>{
//   const equals = (first: any, second: any) => first.equals ? first.equals(second) : first === second;
//   const deepEqual = (first: any, second: any) => {

//     const keysArray = Object.keys(first);
//     if (keysArray.length === 0) return equals(first, second);
//     for(const key of keysArray) {
//       if (first[key] !== second[key]) return false
//     }
//     return true;
//   }
//   return {
//     name: (<any>type).name,
//     value: type,
//     equals: (other: T) => {
      
//       return deepEqual(type, other)
//     }
//   }
// }
// type Name = string;
// type NameConvertor =(name: Name) => string;

// interface AppError {
//   error: Error
// }
// type Person ={
//   firstName: Name,
//   middleName?: Name,
//   lastName: Name
// };

// type Result <T, R> = Type<T | R>;
// type Alpha = number;
// type Beta = number;

// const myName: Type<Name> = Type<Name>('Suren');
// const herName: Type<Name> = Type<Name>('Suren');

// console.log(myName.value, herName.value, myName.name)
// console.log(myName.equals(herName.value))

// function nameTest(person: Type<Person>, convertor: Type<NameConvertor>): any {
//  const {firstName, middleName, lastName} = person.value;
//  console.log('converted firstName: ', convertor.value(firstName));
//  console.log('converted middleName: ', convertor.value(middleName || ''));
//  console.log('converted lastName: ', convertor.value(lastName));
// }

// function numberAdd(alpha: Type<Alpha>, beta: Type<Beta>): number {
//   return alpha.value + beta.value;
// }

// const person1: Type<Person> = Type<Person>({
//   firstName: 'Suren',
//   lastName: 'Rodrigo'
// });
// const nameConvertor: Type<NameConvertor> = Type<NameConvertor>((name: string) => name ? `Converted: ${name}` : '')
// const numberOne = Type<Alpha>(5);
// const numberTwo = Type<Beta>(5);
// const numberThree = Type<Alpha>(5);

// nameTest(person1, nameConvertor)
// console.log(numberAdd(numberOne, numberTwo))
// console.log(numberOne.equals(numberTwo.value))
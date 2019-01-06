
// type Name = string;
// type NameConvertor = (name:Name) => string;
// type Person = {
//   firstName: Name,
//   middleName?: Name,
//   lastName: Name
// }
// type Result <T, R> = T | R;
// interface AppError {
//   error: Error
// }

// type Alpha = number;
// type Beta = number;



// function nameTest(person: Person, convertor: NameConvertor): Result<string, AppError> {
//   const {firstName, middleName, lastName} = person;
//   if (firstName !== 'Suren') return { error: new Error('Name has to be Suren') };

//   console.log('converted firstName: ', convertor(firstName))
//   console.log('converted middleName: ', convertor(middleName || ''))
//   console.log('converted lastName: ', convertor(lastName))
//   const first: Alpha = 5;
//   const second: Beta = 5;
//   console.log(typeof first)
//   if (first === second) 
//     console.log('WRONG!! WORONG!! WRONG!!')
//   else 
//     console.log(first === second, first == second)
//   return 'All Done'
// }

// function numberAdd(alpha: Alpha, beta: Beta): number {
//   return alpha + beta;
// }
// const nameConvertor = (name: string) => name ? `Converted: ${name}` : '';
// const person1: Person = {
//   firstName: 'Suren',
//   middleName: 'Dinesh',
//   lastName: 'Rodrigo'
// };

// const person2: Person = {
//   firstName: 'Dinuka',
//   lastName: 'Illangasekara'
// }

// const first: Alpha = 6;
// const second: Beta = 5;

// console.log(numberAdd(first, first));

// const result:  Result<string, AppError> = nameTest(person1, nameConvertor);
// if ((<AppError>result).error) console.log('This is an error')
// const result1: Result<string, AppError> = nameTest(person2, nameConvertor);
// console.log(result);
// console.log((<AppError>result1).error);
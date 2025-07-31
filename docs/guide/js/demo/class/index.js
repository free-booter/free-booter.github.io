class Person {
  constructor(name,age) {
    this.name = name;
    this.age = age
  }
  static name = 'classPerson'
  static sayHello(){
    console.log('hello', this.name,this.age);
  }
  getName() {
    console.log(`my name is： ${this.name}`);
  }
}

const p1 = new Person("Tom",18);
Person.sayHello() // hello classPerson

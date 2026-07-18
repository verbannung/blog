---
title: js原型链
publish: "true"
tags:
---
javascript是一种动态类型，其使用原型链的方式实现继承关系。

## 对象`[[Prototype]]`(`__proto__`) 属性
`[[Prototype]]` 属性在很多Js之中实现为`__proto__` 属性 ，这个属性的作用是:**构成一个链条，查找值时，沿着链条向上找，找到了则返回对应的值，如果找到`[[Prototype]]`值为None，则返回undifined**


我们看下面的一个例子
``` ts
const demo1 = {
    a:1,
    b:2,
    __proto__:{
        c:3,
        __proto__:{
            d:4
        }
    }
}
```
运行结果是
![[Pasted image 20260718115727.png]]
这里查找demo某一个属性的链条是`demo1->demo1.[[Prototype]]->demo1.[[Prototype]].[[Prototype]]->Object.[[Prototype]]->None` ，找到即停，这就是属性遮蔽的原因。

# 函数 `Prototype`属性

js之中函数是一等公民,当函数作为构造函数时，构造的对象会继承该函数的`Prototype`内的属性和方法
下面是一个例子 
``` ts
const demo1 = {
    a:1,
    b:2,
    __proto__:{
        c:3,
        __proto__:{
            d:4
        }
    }
}

function demo2(value:number): void {
    this.value = value;
}
demo2.prototype = demo1;

let Demo2 = new demo2(100);
console.log(Demo2.value);
console.log(Demo2.c);
```
debug的结果是Demo2通过`demo2.prototype = demo1;`这个方式继承了demo1的属性

![[Pasted image 20260718134232.png]]

# 类的实质

既然我们每一次都写`函数.prototype=...`形成继承关系，太麻烦了，这个时候类这个语法糖就出现了 

```ts 
class LayerD {
    d: number = 4;
}

class LayerC extends LayerD {
    c: number = 3;
}

class Demo1Like extends LayerC {
    a: number = 1;
    b: number = 2;
}

class demo3 extends Demo1Like {
    value: number;
    constructor(value: number) {
        super();
        this.value = value;
    }
}

let Demo3 = new demo3(100);
console.log(Demo3.value); // 100（自身）
console.log(Demo3.a);     // 1
console.log(Demo3.c);     // 3
console.log(Demo3.d);     // 4
```

注意，这里仍然实现了原型链
`demo3.prototype → Demo1Like.prototype → LayerC.prototype → LayerD.prototype → Object.prototype`
实现效果和我们的第二节的例子代码一样，但是需要额外注意的是，内存结构中存在一些不同
![[Pasted image 20260718140011.png]]

注意看 此处Demo3之中的a,b,c,d属性都是在Demo3实例对象上，**如果说存在很多个实例化对象，那么内存压力会有一些大**，而采用第二节的对象`[[Prototype]]`(`__proto__`) 写法，则会内存压力小很多。


当然，你也可以使用另一种更符合第二节的代码的原型继承方式即 
``` ts
class demo3 {
    value: number;
    constructor(value: number) {
        this.value = value;
    }
}

demo3.prototype = {
    a: 1,
    b: 2,
    __proto__: {
        c: 3,
        __proto__: {
            d: 4,
        },
    },
};
```

## 总结

其实区分对象的`[[Prototype]]`(`__proto__`) 属性以及函数的`prototype`属性，就能理解这个是两套平行的班子。
对象的`[[Prototype]]`(`__proto__`) 属性目的是为了**自身提供继承值**
而函数的`prototype`属性则是为了**产生实例对象提供继承值**
类则是简化了这种继承关系的表达。
# 参考
https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain
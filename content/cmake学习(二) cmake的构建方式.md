---
title: cmake学习(二) cmake的构建方式
tags:
  - tools
  - cmake
publish: "true"
---
`STATIC`
A [Static Library](https://cmake.org/cmake/help/latest/manual/cmake-buildsystem.7.html#static-libraries): an archive of object files for use when linking other targets.
构建这个target的时候，会把所有依赖的（包括传递依赖的包)全部构建，并链接 缺点是内存占用比较大

`SHARED`

A [Shared Library](https://cmake.org/cmake/help/latest/manual/cmake-buildsystem.7.html#shared-libraries): a dynamic library that may be linked by other targets and loaded at runtime.

动态链接库，ddl，构建target时，只构建自身，内部如果引用了其余依赖，会形成偏移量占位，运行的时候动态查找，如果查找不到，会报错
优点:包体积小
缺点: 严重依赖运行时环境，如果接口参数出错一些，直接进行报错

`MODULE`

A [Module Library](https://cmake.org/cmake/help/latest/manual/cmake-buildsystem.7.html#module-libraries): a plugin that may not be linked by other targets, but may be dynamically loaded at runtime using dlopen-like functionality.

`OBJECT`

An [Object Library](https://cmake.org/cmake/help/latest/manual/cmake-buildsystem.7.html#object-libraries): a collection of object files which have not been archived or linked into a library.

`INTERFACE`

An [Interface Library](https://cmake.org/cmake/help/latest/manual/cmake-buildsystem.7.html#interface-libraries): a library target which specifies usage requirements for dependents but does not compile sources and does not produce a library artifact on disk.

不编译，为接口层，自身不会编译，一般作为比如常量，宏定义等，外部使用的时候会编译展开




## 参考

https://cmake.org/cmake/help/latest/manual/cmake-buildsystem.7.html#static-libraries
---
title: cmake学习(二) cmake的构建方式
tags:
  - tools
  - cmake
publish: "true"
---
`STATIC`
A [Static Library](https://cmake.org/cmake/help/latest/manual/cmake-buildsystem.7.html#static-libraries): an archive of object files for use when linking other targets.

`SHARED`

A [Shared Library](https://cmake.org/cmake/help/latest/manual/cmake-buildsystem.7.html#shared-libraries): a dynamic library that may be linked by other targets and loaded at runtime.

`MODULE`

A [Module Library](https://cmake.org/cmake/help/latest/manual/cmake-buildsystem.7.html#module-libraries): a plugin that may not be linked by other targets, but may be dynamically loaded at runtime using dlopen-like functionality.

`OBJECT`

An [Object Library](https://cmake.org/cmake/help/latest/manual/cmake-buildsystem.7.html#object-libraries): a collection of object files which have not been archived or linked into a library.

`INTERFACE`

An [Interface Library](https://cmake.org/cmake/help/latest/manual/cmake-buildsystem.7.html#interface-libraries): a library target which specifies usage requirements for dependents but does not compile sources and does not produce a library artifact on disk.

#todo 待完成

## 参考

https://cmake.org/cmake/help/latest/manual/cmake-buildsystem.7.html#static-libraries
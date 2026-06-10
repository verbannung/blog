---
title: cmake学习(一) 核心概念和理解
tags:
  - tools
  - cmake
publish: "true"
---

## cmake用处
cmake是一个跨平台构建工具，用于生成makefile等，供执行cpp项目构建。
那么我们为什么需要使用cmake呢？原先不使用cmake的时候，我们每一次构建cpp文件都需要经历预编译->编译->汇编->链接的过程，生成可执行文件。

``` bash
g++ -E main.cpp -o main.i //预编译 宏展开

g++ -S main.i -o main.s //编译 生成汇编

g++ -c main.s -o main.o //汇编 生成二进制文件

g++ main.o -o my_program  //链接并最终生成可执行文件
```
每一次都要执行这么多命令，况且gcc/clang等等构建环境还不统一，那么自然需要一个跨平台的工具，一次性打包生成所有的构建命令，在统一执行构建，是不是就会轻松很多呢？这个就是cmake的作用。

## cmake的核心概念 
### Targets
>Probably the most important item is targets. Targets represent executables, libraries, and utilities built by CMake. Every [`add_library`](https://cmake.org/cmake/help/latest/command/add_library.html#command:add_library "(in CMake v3.30.3)"), [`add_executable`](https://cmake.org/cmake/help/latest/command/add_executable.html#command:add_executable "(in CMake v3.30.3)"), and [`add_custom_target`](https://cmake.org/cmake/help/latest/command/add_custom_target.html#command:add_custom_target "(in CMake v3.30.3)") command creates a target. For example, the following command will create a target named “foo” that is a static library, with `foo1.c` and `foo2.c` as source files.

这里说明了target其实是一个生成的最终结果，比如一个可执行文件，一个库等等。相当于我们刚刚把main.o变成一个my_program可执行文件，那么my_program就是一个target 
其对应cmake的文件就是
```  cmake
add_library(foo STATIC foo1.c foo2.c)
```
这里的static我们后面会说明，其实是一个静态库还是一个动态库的区别(STATIC或者SHARED)[[cmake学习(二) 动态库和静态库]]

## 参考
[cmake官网-核心概念](https://cmake.org/cmake/help/book/mastering-cmake/chapter/Key%20Concepts.html#targets)

#todo 待完成
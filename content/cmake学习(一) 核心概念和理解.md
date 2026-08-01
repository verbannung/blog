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

## cmake的核心概念 - Target 
## target 的理解
对于target 官方文档是这么描述的
>Probably the most important item is targets. Targets represent executables, libraries, and utilities built by CMake. Every [`add_library`](https://cmake.org/cmake/help/latest/command/add_library.html#command:add_library "(in CMake v3.30.3)"), [`add_executable`](https://cmake.org/cmake/help/latest/command/add_executable.html#command:add_executable "(in CMake v3.30.3)"), and [`add_custom_target`](https://cmake.org/cmake/help/latest/command/add_custom_target.html#command:add_custom_target "(in CMake v3.30.3)") command creates a target. For example, the following command will create a target named “foo” that is a static library, with `foo1.c` and `foo2.c` as source files.

其实可以target可以理解为一个构建容器，即我们需要构建一个二进制文件，那么这个二进制文件的相关配置，需要一个target进行承载。构建target有add_library，add_executable,add_custom_target等方法

>The term "target" comes from `make` command. `make` takes targets names as arguments and builds them using rules that specify what to do to create a specific target/file. In `make` a "target" is just a path to a file to produce, for example an actual executable name.


[stackoverflow](https://stackoverflow.com/questions/74974399/what-is-a-target-in-cmake)


## target 容器包含的内容

>CMake will also propagate “usage requirements” from linked library targets. Usage requirements affect compilation of sources in the target. They are specified by properties defined on linked targets.

我们可以对于这个target容器，添加其包含的内容。我们通过

``` cmake
add_library(foo foo.cxx)
target_include_directories(foo PUBLIC
                           "${CMAKE_CURRENT_BINARY_DIR}"
                           "${CMAKE_CURRENT_SOURCE_DIR}"
                           )
```

告诉我们编译对应的cpp文件，并告诉hpp文件在哪里，这里需要知道hpp文件的原因是因为需要一个占位符知道这个函数签名以及所需要的空间等

## target容器对外暴露的接口

分为三种 分别是 
1. INTERFACE 内部不依赖，外部使用者传递依赖
2. PRIVATE 内部使用依赖，不传递依赖，使用第三方接口时推荐使用此方式
3. PUBLIC 外部使用依赖，传递依赖
   
举个例子，考虑这样一个场景 
有三个target，分别是demo1,demo2和main，其中demo1依赖demo2,main依赖demo1
组合一:
target_link_libraries(DEMO1 PUBLIC DEMO2) 
target_link_libraries(MAIN PUBLIC DEMO1) 
这种组合肯定是没有问题
组合二:
target_link_libraries(DEMO1 PRIVATE DEMO2) 
target_link_libraries(MAIN PUBLIC DEMO1) 
这样如果main中直接使用demo1的方法 出现错误，因为PRIVATE导致MAIN引入demo1的时候，不会出现DEMO2之中的方法函数
>ld: symbol(s) not found for


组合三:
target_link_libraries(DEMO1 INTERFACE DEMO2)
target_link_libraries(MAIN PUBLIC DEMO1)
这个之中demo2会被传递出去，但是demo1不会依赖demo2之中的方法，否则会报错


## target容器的构建方式
参考我的另一个博客
[[cmake学习(二) cmake的构建方式]]






## 参考
[cmake官网-核心概念](https://cmake.org/cmake/help/book/mastering-cmake/chapter/Key%20Concepts.html#targets)

#todo 待完成
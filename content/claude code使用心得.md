---
title: claude code使用指南
publish: "true"
tags:
  - tools
  - claude-code
---

claude code 确实是一个非常好用的ai辅助工具，用于大型项目的重构和生成，然而在使用ai的使用有几个严重的痛点，以下是我的使用心得。
## 问题1.代码生成缺乏约束
举个例子，大型项目一般有对应的架构约束，以python后端为例，我们一般会约定以领域划分包结构，并且区分api层，service层，mapper层 ,repository层，schema层，types类型文件约束。然而在ai编写的过程中，很容易造成其编排错误的情况,这个时候我们就需要 CLAUDE.md文件配合rules.md文件结合使用，定义代码和文件规范。
![[Pasted-image-20260607221843.png]]
这个是claudecode的参考目录结构[菜鸟教程](https://www.runoob.com/claude-code/claude-code-project.html),我们在项目根目录创建CLAUDE.md文件，并且编写如
``` md
##项目纵览
这是一个xxx项目，用于解决xxx问题。文件模块结构如下
...
##全局规范
...
```
这样子的规范文件，由于大型项目存在庞杂的约束，而claude.md文件在每一次会话启动的上下文都会加载，所以可以新增对应的规则文件，在rules文件夹下面，如
``` md
---
paths:"src/app/service/*.py"
---
编写service层规范 ... 
```
这样，claudecode就可以在符合paths路径规则的时候，按需加载对应的规则。

## 问题2. claude code配置复杂，缺少开箱即用的工具减轻心智负担 
[oh-my-claude-code](https://github.com/Yeachan-Heo/oh-my-claudecode)这个开源项目是我非常推荐使用的，他解决的是提供了一套开箱即用的agent编排,skills以及commands,其中包括构建计划，测试驱动，自动编排任务修复bug等，配合刚刚的项目约束，开发如虎添翼。

## 问题3 缺少类似于cursor的代码更改diff可视化方法
cursor的使用大家都很清楚，特别是在agent编排的时候，ai改动了哪一些文件，我一般使用的是通过git版本比对的方式，一般IDEA或者vscode都有很好的代码版本管理，通过git diff 查看哪一些代码被更改了，开发完成后使用sqush命令，统一提交到主分支。
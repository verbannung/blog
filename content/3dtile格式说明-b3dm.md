---
title:
publish: "true"
tags:
  - 3dtile
---
# b3DM是什么
b3dm属于1.0的老版本格式，在1.1版本之中标记为不推荐直接使用，但是目前还是得到cesium的广泛支持，文档中说明b3dm属于Heterogeneous 3D models，即互相异构的model构成。类似于不同的建筑，管道。使用它的意义在于说可以提交给cesium 给webgl统一绘制。
>_Batched 3D Model_ allows offline batching of heterogeneous 3D models, such as different buildings in a city, for efficient streaming to a web client for rendering and interaction. Efficiency comes from transferring multiple models in a single request and rendering them in the least number of WebGL draw calls necessary. Using the core 3D Tiles spec language, each model is a _feature_.


属性的存储需要额外注意，他是绑定的gltf的batch_id属性，而batch_id是属于顶点的，用户在页面点击的时候，由于渲染的过程中对于顶点会进行插值处理，所以cesium内部会根据交点的batch_id查询batchtable，获得其属性值,换句话说 cesium并不知道这个模型属于什么属性，他并不关心，而是某一个顶点属于什么属性，而顶点属于primitive,这样我们可以说明存储业务数据的最小单元是primitive而不是scene或者model
>Per-model properties, such as IDs, enable individual models to be identified and updated at runtime, e.g., show/hide, highlight color, etc. Properties may be used, for example, to query a web service to access metadata, such as passing a building’s ID to get its address. Or a property might be referenced on the fly for changing a model’s appearance, e.g., changing highlight color based on a property value.

``` md
node
  └── mesh
        └── primitives[]
              ├── attributes
              │     ├── POSITION
              │     ├── NORMAL
              │     ├── TEXCOORD_0
              │     └── _BATCHID   ← 在这里
              └── indices
```

# 数据格式
![[Pasted image 20260713123155.png]]

# 参考
官方1.1文档地址: https://docs.ogc.org/cs/22-025r4/22-025r4.html
gltf transform 文档地址: https://gltf-transform.dev/modules/core/classes/Primitive
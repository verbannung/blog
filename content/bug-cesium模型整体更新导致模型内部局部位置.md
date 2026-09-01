---
title: bug-cesium模型整体更新导致模型内部局部位置
publish: "true"
tags:
  - "#cesium"
  - "#bug"
  - "#旋转控制器"
---
旋转控制器开发之中存在一个问题，平移和缩放的箭头，其锥体在下一帧矩阵更新的时候，锥体返回原点，其原因是在cesium之中存在不把顶点预烘焙进primitive之中，导致后续变化时，局部旋转被重置。![[Pasted image 20260902002413.png]]


``` ts
const box = new Primitive({
      geometryInstances: new GeometryInstance({
        geometry: bakeTransform(
          BoxGeometry.createGeometry(
            BoxGeometry.fromDimensions({
              dimensions: new Cartesian3(BOX_HALF * 2, BOX_HALF * 2, BOX_HALF * 2),
              vertexFormat: PerInstanceColorAppearance.FLAT_VERTEX_FORMAT,
            }),
          )!,
          Matrix4.fromTranslation(pointAlong(direction, AXIS_LENGTH + BOX_HALF)),
        ),
        attributes,
        id,
      }),
      appearance: new PerInstanceColorAppearance({
        flat: true,
        translucent: true,
        renderState: OVERLAY,
      }),
      asynchronous: false,
      modelMatrix: new Matrix4(),
    })
```
``` ts
/**
 * 把局部偏移烘进顶点，而不是交给 GeometryInstance.modelMatrix。
 *
 * scene3DOnly + 单实例时 Cesium 不会烘顶点，而是把 instance 矩阵乘进
 * Primitive.modelMatrix 再回写。呈现域每帧覆写 Primitive.modelMatrix 为 gizmo 帧，
 * 那个乘积下一帧就没了，几何会塌回 gizmo 原点。
 */
export function bakeTransform(geometry: Geometry, modelMatrix: Matrix4): Geometry {
  const instance = new GeometryInstance({ geometry, modelMatrix })
  GeometryPipeline.transformToWorldCoordinates(instance)
  return instance.geometry
}```

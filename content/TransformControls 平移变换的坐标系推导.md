---
title: TransformControls 平移变换的坐标系推导
publish: "true"
tags:
  - 旋转控制器
  - threejs
---
# TransformControls 平移变换的坐标系推导

> 代码参考自 three.js 源码 `examples/jsm/controls/TransformControls.js`。

## 前提与约定

- 一个 glb 可由多个 node 构成,node 之间通过引用形成场景树(scene graph)。
- three.js 中对象的 `position` 为**父坐标系**下的表达。

为了方便，下面阐述三个坐标系:

|记号|含义|
|---|---|
|$W$|世界坐标系(world)|
|$P$|父坐标系(parent)|
|$L$|对象自身的局部坐标系(local)|

设各系之间的旋转由单位四元数描述:

- $q_{L \to W}$:局部系到世界系的旋转;
- $q_{L \to P}$:局部系到父系的旋转,即代码中的 `_quaternionStart`(鼠标按下时对象相对父级的旋转);
- $q_{L \to W}^{*}$:$q_{L \to W}$ 的共轭,即 `_worldQuaternionInv`,实现世界系到局部系的旋转。

> **注意:** 在多级坐标系下,$q_{L \to W}$ 与 $q_{L \to P}$ **不相等**。二者相等当且仅当 $P = W$(父级即世界)。这是下面推导必须区分"进入局部系用哪个四元数、返回父系用哪个四元数"的根本原因。

## 一、四元数旋转向量

单位四元数只旋转向量,不改变其长度(刚体变换,保长)。对任意向量 $v$:

- 从**局部系旋转到世界系**:

$$ v_{W} = q_{L \to W}, v_{L}, q_{L \to W}^{*} $$

- 从**世界系旋转到局部系**:

$$ v_{L} = q_{L \to W}^{*}, v_{W}, q_{L \to W} $$

(此处 $v$ 以纯四元数 $(0,\ \mathbf{v})$ 参与运算;代码中对应 `Vector3.applyQuaternion`。)

## 二、平移增量的坐标系变换链

平移是在**世界坐标系**中由射线与辅助平面的交点差得到的。设鼠标拖动产生的世界系位移增量为:

$$ \Delta_{W} = p_{\text{end}} - p_{\text{start}} $$

而 gizmo 的轴约束(只允许沿某些轴移动)必须在**局部系**中施加。因此需要把 $\Delta_W$ 依次经过下列变换:

**1. 进入局部系** —— 用 $q_{L \to W}^{*}$ 将增量旋入 $L$:

$$ \Delta_{L} = q_{L \to W}^{*}, \Delta_{W}, q_{L \to W} $$

**2. 轴向过滤** —— 在 $L$ 系中把非激活轴分量置零。设激活轴集合为 $A \subseteq {x, y, z}$:

$$ \Delta_{L}'^{(i)} = \begin{cases} \Delta_{L}^{(i)}, & i \in A \\ 0, & i \notin A \end{cases} \qquad i \in {x, y, z} $$

**3. 返回父系** —— 用 $q_{L \to P}$ 将过滤后的增量旋到 $P$:

$$ \Delta_{P} = q_{L \to P}, \Delta_{L}', q_{L \to P}^{*} $$

**4. 抵消父级缩放** —— 见下节。

## 三、抵消父级缩放的推导

父系 $P$ 是世界系 $W$ 经旋转、平移、缩放得到的。设 $P$ 相对 $W$ 的缩放为 $\mathbf{s} = (s_x, s_y, s_z)$。

由于旋转与平移是刚体变换、不改变尺度,$P$ 系中的 $1$ 个单位长度沿各轴相当于 $W$ 系中的 $s_x,\ s_y,\ s_z$ 个单位。$\Delta_P$ 此时携带的仍是**世界尺度**的长度,而 `object.position` 表达在 $P$ 系,故需逐分量除以父级缩放:

$$ \Delta_{P}'^{(i)} = \frac{\Delta_{P}^{(i)}}{s_i}, \qquad i \in {x, y, z} $$

对应代码中的 `.divide(_parentScale)`(逐分量除,`_parentScale` 为 `Vector3`)。

> **均匀缩放的退化情形:** 若 $s_x = s_y = s_z = s$,上式退化为标量除法 $\Delta_P' = \Delta_P / s$。非均匀缩放时**必须逐轴除**,标量除法掩盖各轴缩放不同的事实

>L坐标系的尺度和P坐标系相同，但均与W坐标系不同
## 四、组装最终位置

上述 $\Delta_P'$ 是 $P$ 系下的**位移增量**,须叠加到鼠标按下时记录的起始位置 $p^{P}_{\text{start}}$(`_positionStart`)才是最终位置:

$$ \text{position}_{P} = p^{P}_{\text{start}} + \Delta_{P}' $$

对应代码:

```js
object.position.copy( this._offset ).add( this._positionStart );
```

## 五、local 与 world 两条路径的差异

three.js 按 `space` 分支,两条路径**过滤所在的系**与**返回 $P$ 所用的四元数**均不同:

| 步骤     | local 路径(且 `axis !== 'XYZ'`)        | world 路径(或 `axis === 'XYZ'`)                |
| ------ | ----------------------------------- | ------------------------------------------- |
| 进入过滤系  | 用 $q_{L\to W}^{*}$ 旋入 $L$           | **不转基**,直接在 $W$ 系过滤                         |
| 轴向过滤   | 在 $L$ 系                             | 在 $W$ 系                                     |
| 返回 $P$ | 用 $q_{L\to P}$ (`_quaternionStart`) | 用 $q_{P\to W}^{*}$ (`_parentQuaternionInv`) |
| 抵消缩放   | `.divide(_parentScale)`             | `.divide(_parentScale)`                     |

可以理解为local路径形成了节点层次坐标系变化结构，而world路径是一个简化。

## 六、代码处理流程

### 1. `pointerDown`

构造辅助平面,记录射线与平面的交点作为平移基准;记录局部→父四元数(`_quaternionStart`)、局部↔世界四元数,以及起始 position / scale。

```js
if ( pointer !== null ) _raycaster.setFromCamera( pointer, this.camera );

const planeIntersect = intersectObjectWithRay( this._plane, _raycaster, true );

if ( planeIntersect ) {

    this.object.updateMatrixWorld();
    this.object.parent.updateMatrixWorld();

    this._positionStart.copy( this.object.position );
    // 相对父级的局部旋转,拖动全程作为基准
    this._quaternionStart.copy( this.object.quaternion );
    this._scaleStart.copy( this.object.scale );

    // 世界系下的 位置 / 旋转 / 缩放
    this.object.matrixWorld.decompose(
        this.worldPositionStart,
        this.worldQuaternionStart,
        this._worldScaleStart
    );

    this.pointStart.copy( planeIntersect.point ).sub( this.worldPositionStart );

}
```

### 2. `pointerMove`

1. 求新交点,构造世界系增量 `_offset`:
    
    ```js
    this.pointEnd.copy( planeIntersect.point ).sub( this.worldPositionStart );this._offset.copy( this.pointEnd ).sub( this.pointStart );
    ```
    
2. (local 路径)旋入局部系:`this._offset.applyQuaternion( this._worldQuaternionInv );`
3. 轴向过滤:
    
    ```js
    if ( axis.indexOf( 'X' ) === - 1 ) this._offset.x = 0;
			if ( axis.indexOf( 'Y' ) === - 1 ) this._offset.y = 0;
			if ( axis.indexOf( 'Z' ) === - 1 ) this._offset.z = 0;
	```
    
4. 旋回父系并抵消缩放:`this._offset.applyQuaternion( this._quaternionStart ).divide( this._parentScale );`
5. 叠加起始位置:`object.position.copy( this._offset ).add( this._positionStart );`
6. 距离吸附(在 $L$ 系逐轴 `round` 后再旋回 $P$):
    
    ```js
    //转回L系 并进行吸附
    object.position.applyQuaternion( _tempQuaternion.copy( this._quaternionStart ).invert() );

					if ( axis.search( 'X' ) !== - 1 ) {

						object.position.x = Math.round( object.position.x / this.translationSnap ) * this.translationSnap;

					}

					if ( axis.search( 'Y' ) !== - 1 ) {

						object.position.y = Math.round( object.position.y / this.translationSnap ) * this.translationSnap;

					}

					if ( axis.search( 'Z' ) !== - 1 ) {

						object.position.z = Math.round( object.position.z / this.translationSnap ) * this.translationSnap;

					}
					//转回P坐标系的对象表达
					object.position.applyQuaternion( this._quaternionStart );    
	```

### 3. `pointerUp`

结束拖动,释放辅助平面等资源。


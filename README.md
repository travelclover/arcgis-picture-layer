# arcgis-picture-layer
基于arcgis js api中BaseLayerView2D和GraphicsLayer扩展的图层，用于在二维地图MapView场景中显示图片。  
![arcgis-picture-layer.gif](https://github.com/travelclover/img/blob/master/2024/06/arcgis-picture-layer.gif?raw=true)

## 安装
使用以下命令从npm仓库安装：
```bash
npm install arcgis-picture-layer --save
```

## 使用
1. 第一步引用并设置依赖。因为需要用到 arcgis js api 中的 [`BaseLayerView2D`](https://developers.arcgis.com/javascript/latest/api-reference/esri-views-2d-layers-BaseLayerView2D.html) 和 [`GraphicsLayer`](https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-GraphicsLayer.html) 类，分别用来创建自定义 LayerView 和自定义图层。
```javascript
import ArcgisPictureLayer from 'arcgis-picture-layer';
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer.js";
import BaseLayerView2D from "@arcgis/core/views/2d/layers/BaseLayerView2D";

// 设置依赖
ArcgisPictureLayer.setDependencies({
  BaseLayerView2D,
  GraphicsLayer,
});
```

2. 实例化图层并添加图层到地图中。
```javascript
const layer = new ArcgisPictureLayer.Layer({
  id: 'arcgisPictureLayer', // 图层id
  title: '图片图层', // 图片名称
  imgUrlField: 'imgUrl', // 定义图片地址字段，默认为url
  graphics: [{
    geometry: {
      rings: [
        [
          [114.40732521820085, 38.203899040222545], // 多边形点坐标
          [117.71309418487478, 40.087196006774775],
          [119.22671837615856, 36.51423610687338],
          [115.4877190093993, 35.4760710144054],
        ]
      ],
      type: 'polygon',
      spatialReference: {
        wkid: 4326,
      },
    },
    attributes: {
      imgUrl: './1.png', // 图片地址
    }
  }, {
    geometry: {
      rings: [
        [
          [115.75133724021993, 40.164824500083554],
          [116.1555461387637, 40.19650138854939],
          [116.40816463041298, 39.96928609848012],
          [116.0986001591686, 39.69439454317119],
          [115.77516866731722, 39.87099386692049],
        ]
      ],
      type: 'polygon',
      spatialReference: {
        wkid: 4326,
      },
    },
    attributes: {
      imgUrl: './2.png', // 图片地址
    }
  }],
});

map.add(layer); // 添加进地图中
```

## 实例化图层的参数
```javascript
new ArcgisPictureLayer.Layer(properties);
```
| 字段名称   | 字段类型   | 是否必填   | 描述   | 
| :---- | :---- | :---- | :---- |   
| id | string | 否 | 分配给图层的唯一 ID。 |
| title | string | 否 | 分配给图层的名称。 |
| imgUrlField | string | 否 | 用来设置表示图片url地址的字段。默认值为"url"。 |
| graphics | array | 是 | graphic列表，每个graphic应当包含 geometry对象和attributes对象。geometry类型必须为Polygon，点击查看[arcgis api文档](https://developers.arcgis.com/javascript/latest/api-reference/esri-geometry-Polygon.html#properties-summary)。attributes对象中必须包含`imgUrlField`设置的字段，默认为`"url"`。 |
  
properties 同 ArcGIS JS API 中 [GraphicsLayer类的properties](https://developers.arcgis.com/javascript/latest/api-reference/esri-layers-GraphicsLayer.html#properties-summary) 基本相同，只是多了 `imgUrlField` 可选字段，用来定义每个 graphic 中渲染图片的地址。如果设置了该字段，同时 graphics 数组中的每个 `graphic.attributes` 对象中都要包含 `imgUrlField` 定义的字段，否则渲染不出图片。 

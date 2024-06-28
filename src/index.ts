/*
 * @Description: 自定义扩展图层，用于在二维MapView场景中显示图片
 * @Author: travelclover(travelclover@163.com)
 * @Date: 2024-06-28 18:02:45
 */
import type ArcgisPictureLayer from '../index';
import type { DependenciesProps } from '../index';

interface Vertex {
  x: number;
  y: number;
}

const Dependencies: DependenciesProps | Record<string, null> = {
  BaseLayerView2D: null,
  GraphicsLayer: null,
};

function setDependencies(dependencies: DependenciesProps) {
  Dependencies.BaseLayerView2D = dependencies.BaseLayerView2D;
  Dependencies.GraphicsLayer = dependencies.GraphicsLayer;

  const PictureLayerView2D = (
    Dependencies.BaseLayerView2D as any
  ).createSubclass({
    attach() {
      const graphics = this.layer.graphics.items;
      graphics.forEach((item: __esri.Graphic, index: number) => {
        if (item.attributes?.url) {
          // 创建图片对象
          const img = new Image();
          img.src = item.attributes?.url; // 图片的路径

          // 等待图片加载完成后再绘制
          img.onload = () => {
            // 在剪切区域内绘制图片，确保完全覆盖多边形的区域
            this.layer.graphics.items[index].attributes._$_img_ = img;
          };
        }
      });
    },

    // 求包围框
    getBoundingBox(vertices: Vertex[]) {
      if (vertices.length === 0) {
        return null; // 多边形没有顶点，返回空
      }
      // 初始化最小和最大值
      let minX = Infinity;
      let maxX = -Infinity;
      let minY = Infinity;
      let maxY = -Infinity;

      // 遍历多边形的顶点，更新最小和最大值
      vertices.forEach((vertex) => {
        if (vertex.x < minX) minX = vertex.x;
        if (vertex.x > maxX) maxX = vertex.x;
        if (vertex.y < minY) minY = vertex.y;
        if (vertex.y > maxY) maxY = vertex.y;
      });

      // 返回包围框的左上角和右下角坐标
      return {
        minX: minX,
        minY: minY,
        maxX: maxX,
        maxY: maxY,
        width: maxX - minX,
        height: maxY - minY,
      };
    },

    // 求指定旋转中心旋转前坐标
    inverseRotateAround(
      rotatedX: number,
      rotatedY: number,
      rotationAngle: number,
      centerX: number,
      centerY: number
    ) {
      // 逆向平移
      const x1 = rotatedX - centerX;
      const y1 = rotatedY - centerY;

      // 逆向旋转
      const cosAngle = Math.cos(-rotationAngle);
      const sinAngle = Math.sin(-rotationAngle);
      const x2 = x1 * cosAngle + y1 * sinAngle;
      const y2 = -x1 * sinAngle + y1 * cosAngle;

      // 逆向平移回去
      const originalX = x2 + centerX;
      const originalY = y2 + centerY;

      return { x: originalX, y: originalY };
    },

    render(renderParameters: any) {
      const state = renderParameters.state;
      const rotation = state.rotation;
      let pixelRatio = state.pixelRatio;
      let width = state.size[0];
      let height = state.size[1];
      let context = renderParameters.context;
      const view = this.view;
      const extent = view.extent.expand(2); // 范围
      const graphics = this.layer.graphics.toArray();

      graphics.forEach((graphic: __esri.Graphic, index: number) => {
        const geometry = graphic.geometry as __esri.Polygon;
        const img = graphic.attributes._$_img_;
        // 判断geometry是否在范围内
        if (extent.intersects(geometry) && img) {
          // 将geometry坐标转换为屏幕坐标
          const vertices = geometry.rings[0].map((item) => {
            const p = {
              x: item[0],
              y: item[1],
              spatialReference: geometry.spatialReference,
            };
            return view.toScreen(p);
          });

          // 求旋转前坐标
          const inverseVertices = vertices.map((item) => {
            return this.inverseRotateAround(
              item.x,
              item.y,
              -(rotation / 360) * 2 * Math.PI,
              width / 2,
              height / 2
            );
          });
          // 旋转前包围盒坐标
          const inverseboundingBox = this.getBoundingBox(inverseVertices);

          context.save();

          // 画布旋转对应的角度，绕中心旋转，所以需要先平移，旋转后再平移回来
          context.translate(
            width * pixelRatio * 0.5,
            height * pixelRatio * 0.5
          );
          context.rotate((state.rotation * Math.PI) / 180);
          context.translate(
            -width * pixelRatio * 0.5,
            -height * pixelRatio * 0.5
          );

          context.beginPath();
          context.moveTo(
            inverseVertices[0].x * pixelRatio,
            inverseVertices[0].y * pixelRatio
          ); // 将起始点移动到 (50, 50)
          inverseVertices.forEach((item) => {
            context.lineTo(item.x * pixelRatio, item.y * pixelRatio);
          });
          context.closePath();
          context.clip();

          context.drawImage(
            img,
            inverseboundingBox.minX * pixelRatio,
            inverseboundingBox.minY * pixelRatio,
            inverseboundingBox.width * pixelRatio,
            inverseboundingBox.height * pixelRatio
          );
          context.restore();
        }
      });
    },
  });

  defaultExport.Layer = (Dependencies.GraphicsLayer as any).createSubclass({
    createLayerView(view: __esri.MapView) {
      if (view.type === '2d') {
        return new PictureLayerView2D({
          view: view,
          layer: this,
        });
      }
    },
  });
}

const defaultExport: ArcgisPictureLayer = {
  Layer: null,
  setDependencies,
};

export default defaultExport;

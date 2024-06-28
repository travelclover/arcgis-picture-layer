/*
 * @Description: 类型描述文件
 * @Author: travelclover(travelclover@163.com)
 * @Date: 2024-06-28 19:01:07
 */
export interface DependenciesProps {
  BaseLayerView2D: __esri.BaseLayerView2D;
  GraphicsLayer: __esri.GraphicsLayer;
}

export default interface ArcgisPictureLayer {
  /** 设置依赖 */
  setDependencies: (dependencies: DependenciesProps) => void;
  /** 图层类 */
  Layer: __esri.GraphicsLayer | null;
}

declare module "react-grid-layout" {
  import { Component } from "react";

  export interface Layout {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    minH?: number;
    maxW?: number;
    maxH?: number;
    static?: boolean;
  }

  export interface GridProps {
    layout: Layout[];
    cols: number;
    rowHeight: number;
    width: number;
    isDraggable?: boolean;
    isResizable?: boolean;
    onLayoutChange?: (layout: Layout[]) => void;
  }

  export class ResponsiveGridLayout extends Component<GridProps> {}

  // Add WidthProvider here
  export function WidthProvider(WrappedComponent: any): any;
  export default ResponsiveGridLayout;
}

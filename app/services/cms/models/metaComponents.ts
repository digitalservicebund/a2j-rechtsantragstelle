export type Background = {
  id: number;
  __component: "meta.background";
  paddingTop:
    | "default"
    | "px0"
    | "px8"
    | "px16"
    | "px24"
    | "px32"
    | "px40"
    | "px48"
    | "px56"
    | "px64";
  paddingBottom:
    | "default"
    | "px0"
    | "px8"
    | "px16"
    | "px24"
    | "px32"
    | "px40"
    | "px48"
    | "px56"
    | "px64";
  color: "default" | "white" | "blue" | "yellow";
};

export type Container = {
  id: number;
  __component: "meta.container";
  paddingTop:
    | "default"
    | "px0"
    | "px8"
    | "px16"
    | "px24"
    | "px32"
    | "px40"
    | "px48"
    | "px56"
    | "px64";
  paddingBottom:
    | "default"
    | "px0"
    | "px8"
    | "px16"
    | "px24"
    | "px32"
    | "px40"
    | "px48"
    | "px56"
    | "px64";
  backgroundColor: "default" | "white" | "blue" | "yellow";
};

export type MetaComponentCMS = Background | Container;

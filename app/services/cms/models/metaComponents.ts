import type { ContainerProps } from "~/components/Container";
import type { BackgroundProps } from "~/components/Background";

export type Background = {
  id: number;
  __component: "meta.background";
} & Omit<BackgroundProps, "children">;

export type Container = {
  id: number;
  __component: "meta.container";
} & Omit<ContainerProps, "children">;

export type MetaComponentCMS = Background | Container;

import { Rect, Svg, Text, View } from "@react-pdf/renderer";

const rectSize = 8;

export function HandoutRow({ text }: { readonly text: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        gap: "8px",
      }}
    >
      <Svg width={rectSize} height={rectSize}>
        <Rect width={rectSize} height={rectSize} stroke="black" />
      </Svg>
      <Text>{text}</Text>
    </View>
  );
}

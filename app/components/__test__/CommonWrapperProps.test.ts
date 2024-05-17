import { wrapperPropsFromCms } from "~/components/CommonWrapperProps";

describe("wrapperPropsFromCms", () => {
  it("strips px prefix", () => {
    expect(
      wrapperPropsFromCms({
        backgroundColor: "blue",
        paddingBottom: "px0",
        paddingTop: "px0",
      }),
    ).toEqual({
      backgroundColor: "blue",
      paddingBottom: "0",
      paddingTop: "0",
    });
  });

  it("handles null", () => {
    expect(
      wrapperPropsFromCms({
        backgroundColor: null,
        paddingBottom: null,
        paddingTop: null,
      }),
    ).toEqual({
      backgroundColor: "default",
      paddingBottom: "default",
      paddingTop: "default",
    });
  });
});

import { act, renderHook } from "@testing-library/react";
import useLiveMessage, {
  DEFAULT_ANNOUNCE_DELAY_MS,
} from "~/components/formElements/autoSuggestInput/useLiveMessage";

describe("useLiveMessage", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("initializes with empty message and a numeric key", () => {
    const { result } = renderHook(() => useLiveMessage());
    expect(result.current.liveMessage).toBe("");
    expect(typeof result.current.liveMessageKey).toBe("number");
  });

  it("announceLiveMessage schedules a message after the default delay", () => {
    const { result } = renderHook(() => useLiveMessage());

    const beforeKey = result.current.liveMessageKey;
    act(() => {
      result.current.announceLiveMessage("hello world");
    });

    expect(result.current.liveMessage).toBe("");
    expect(result.current.liveMessageKey).toBeGreaterThan(beforeKey);

    act(() => {
      vi.advanceTimersByTime(DEFAULT_ANNOUNCE_DELAY_MS);
    });
    expect(result.current.liveMessage).toBe("hello world");
  });

  it("announceLiveMessage cancels any pending announce and schedules the last one", () => {
    const { result } = renderHook(() => useLiveMessage());

    act(() => {
      result.current.announceLiveMessage("first", 500);
    });

    act(() => {
      result.current.announceLiveMessage("second", 200);
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current.liveMessage).toBe("second");
  });
});

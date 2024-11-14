import { quitRedis } from "../redisClient";

describe("quitRedis", () => {
  it("should call .quit() and resolve", async () => {
    const redisMock = {
      quit: vi.fn(() => Promise.resolve("OK" as const)),
      disconnect: vi.fn(),
    };
    expect(await quitRedis(redisMock, 1000)).toBe("quit");
    expect(redisMock.quit).toHaveBeenCalledTimes(1);
    expect(redisMock.disconnect).not.toHaveBeenCalled();
  });

  it("to call .disconnect() and resolve if quit() takes longer than timeout", async () => {
    const redisMock = {
      quit: vi.fn(
        () =>
          new Promise<"OK">((resolve) => {
            setTimeout(() => resolve("OK"), 10);
          }),
      ),
      disconnect: vi.fn(),
    };

    expect(await quitRedis(redisMock, 5)).toBe("disconnect");
    expect(redisMock.quit).toHaveBeenCalledTimes(1);
    expect(redisMock.disconnect).toHaveBeenCalledTimes(1);
  });
});

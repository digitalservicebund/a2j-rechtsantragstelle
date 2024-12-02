import { createRedisClient, quitRedis } from "../redisClient";

describe("createRedisClient", () => {
  it("should create a redis client", () => {
    const redisClient = createRedisClient({
      url: "redis://localhost:6379",
      lazyConnect: true, // don't auto-connect
    });
    expect(redisClient).toBeDefined();
    expect(redisClient.options.host).toBe("localhost");
    expect(redisClient.options.port).toBe(6379);
    expect(redisClient.status).toBe("wait");
  });
});

describe("quitRedis", () => {
  it("should call .quit() and resolve", async () => {
    const redisMock = {
      quit: vi.fn().mockResolvedValue("OK"),
      disconnect: vi.fn(),
    };
    expect(await quitRedis(redisMock, 1000)).toBe("quit");
    expect(redisMock.quit).toHaveBeenCalledTimes(1);
    expect(redisMock.disconnect).not.toHaveBeenCalled();
  });

  it("to call .disconnect() and resolve if quit() takes longer than timeout", async () => {
    const delayedResponse = new Promise((resolve) => {
      setTimeout(() => resolve("OK"), 10);
    });
    const redisMock = {
      quit: vi.fn().mockReturnValue(delayedResponse),
      disconnect: vi.fn(),
    };

    expect(await quitRedis(redisMock, 5)).toBe("disconnect");
    expect(redisMock.quit).toHaveBeenCalledTimes(1);
    expect(redisMock.disconnect).toHaveBeenCalledTimes(1);
  });
});

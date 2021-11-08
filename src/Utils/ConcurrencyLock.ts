interface ConcurrencyLockArgs {
  concurrency: number;
  interval?: number;
}

export class ConcurrencyLock {
  readonly #concurrency: number;
  readonly #interval: number;

  #running = 0;
  #waitingResolves: Array<() => void> = [];
  #lastRunAt: Date | null = null;

  constructor({ concurrency, interval }: ConcurrencyLockArgs) {
    this.#concurrency = concurrency;
    this.#interval = interval ?? 0;
  }

  async run<T>(func: () => PromiseLike<T> | T): Promise<T> {
    await this.#get(new Date());
    const result = await func();
    await this.#release(new Date());

    return result;
  }

  async #get(calledAt: Date) {
    await new Promise<void>(resolve => {
      console.dir(
        {
          running: this.#running,
          concurrency: this.#concurrency,
          waitingResolves: this.#waitingResolves,
        },
        { depth: null }
      );
      if (this.#running >= this.#concurrency) {
        this.#waitingResolves.push(resolve);
        return;
      }

      this.#running += 1;
      this.#schedule(resolve, calledAt);
    });
  }

  async #release(calledAt: Date) {
    if (this.#running === 0) {
      console.warn("ConcurrencyLock#release was called but has no runnings");
      return;
    }

    if (this.#waitingResolves.length === 0) {
      this.#running -= 1;
      return;
    }

    const popped = this.#waitingResolves.shift();
    if (popped) this.#schedule(popped, calledAt);
  }

  #schedule(func: () => void, calledAt: Date) {
    const willRunAt = !this.#lastRunAt
      ? calledAt
      : new Date(
          Math.max(
            calledAt.getTime(),
            this.#lastRunAt.getTime() + this.#interval
          )
        );

    this.#lastRunAt = willRunAt;

    setTimeout(func, willRunAt.getTime() - calledAt.getTime());
  }
}

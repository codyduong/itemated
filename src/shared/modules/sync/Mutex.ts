/**
 * @author Cody Duong <cody.qd@gmail.com>
 * @file Mutex inspired by rust
 *
 * TODO: this currently isn't used by anything
 */

import Result from "shared/modules/Result";

class MutexGuard<T> {
  private mutex: Mutex<T>;
  private released: boolean;
  constructor(value: Mutex<T>) {
    this.mutex = value;
    this.released = false;
  }
  read(): T {
    assert(this.released !== true);
    return (this.mutex as unknown as { value: unknown }).value as unknown as T;
  }
  write(value: T) {
    assert(this.released !== true);
    (this.mutex as unknown as { value: unknown }).value = value;
  }
  release() {
    this.released = true;
    (this.mutex as unknown as { lockTable: SharedTable }).lockTable.lock = false;
  }
}

class Poison {}

class LockResult<T> extends Result<MutexGuard<T>, Poison> {
  public unwrap(): MutexGuard<T> {
    assert(this.value instanceof MutexGuard, "Failed to unwrap MutexResult");
    return this.value;
  }
}

export default class Mutex<T> {
  private value: T;
  private lockTable: {
    lock: SharedTableValue;
    poisoned: SharedTableValue;
  };

  constructor(value: T) {
    this.value = value;
    this.lockTable = new SharedTable({ lock: false, poisoned: false }) as unknown as any;
  }

  private wait() {
    while (this.lockTable.lock === true) {
      // print("waiting for my turn!");
      task.wait();
    }
    this.lockTable.lock = true;
  }

  public lock(): LockResult<T> {
    this.wait();
    return new LockResult(this.lockTable.poisoned === true ? new Poison() : new MutexGuard(this));
  }

  public release(): void {
    // print("freedom!");
    this.lockTable.lock = false;
  }

  public lockAndRun(callback: (value: LockResult<T>) => void): void {
    this.wait();

    try {
      callback(new LockResult(this.lockTable.poisoned === true ? new Poison() : new MutexGuard(this)));
      this.lockTable.lock = false;
    } catch (_e) {
      this.lockTable.poisoned = true;
    }
    task.desynchronize();
  }

  /**
   * Determines whether the mutex is poisioned
   *
   * If another thread is active, the mutex can still become poisoned at any time. You should not rust a `false` value
   * for program correctness without additional synchronization.
   */
  public isPoisoned(): boolean {
    return this.lockTable.poisoned as unknown as boolean;
  }

  public clearPoison(): void {
    this.lockTable.poisoned = false;
  }
}

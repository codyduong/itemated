/**
 * @author Cody Duong <cody.qd@gmail.com>
 * @file Result abstract class inspired by Rust
 */

export default abstract class Result<T, E> {
  protected value: T | E;
  public constructor(value: T | E) {
    this.value = value;
  }
  public abstract unwrap(): T;
}

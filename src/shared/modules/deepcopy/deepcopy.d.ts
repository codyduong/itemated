/**
 * @author Cody Duong <cody.qd@gmail.com>
 * @file A type definition for a luau deepcopy that is better served being written in luau first
 */

export declare const deepCopy: <T extends {}>(o: T) => T;
export default deepCopy;

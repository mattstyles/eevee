export var str = "hello world";
export function say(pre) {
    console.log("".concat(pre).concat(pre != null ? " " : "").concat(str));
}
export function exclaim() {
    console.log("".concat(str, "!!!"));
}
export var obj = {
    foo: str,
    bar: 23
};

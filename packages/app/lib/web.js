var str = "hello world";
function say(pre) {
    console.log("".concat(pre).concat(pre != null ? " " : "").concat(str));
}
var id = "[@eevee/app]";
say(id);

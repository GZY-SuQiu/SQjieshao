/* 在样式应用前确定主题，避免首屏闪烁；无脚本时回退浅色。 */
(function () {
  try {
    var saved = window.localStorage.getItem("sq-theme");
    var theme =
      saved === "dark" || saved === "light"
        ? saved
        : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    document.documentElement.setAttribute("data-theme", theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", theme === "dark" ? "#0b0e14" : "#f4f6fa");
    }
  } catch (error) {
    document.documentElement.setAttribute("data-theme", "light");
  }
})();

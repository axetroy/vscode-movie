Vue.use(VLazyImage.VLazyImagePlugin);

const app = new Vue({
  el: "#app",
  data: {
    movie: GLOBAL_DATA.movie
  },
  filters: {
    scope: function(scope) {
      scope = scope + "";
      if (parseFloat(scope) === 0) return "暂无评分";
      if (scope.length === 1) {
        return (+scope).toFixed(1);
      }
      return scope;
    }
  }
});

(function(){
  window.SpaRouter = {
    routes: {},
    notFound: function(){
      return '<div class="empty-state"><i class="bi bi-exclamation-triangle"></i> ไม่พบหน้านี้</div>';
    },
    register: function(path, renderFn){
      this.routes[path] = renderFn;
    },
    mount: function(containerId){
      this.containerId = containerId;
      window.addEventListener('hashchange', this._render.bind(this));
      this._render();
    },
    navigate: function(path){
      location.hash = path;
    },
    _render: function(){
      var path = location.hash || '#/dashboard';
      var renderer = this.routes[path] || this.notFound;
      var el = document.getElementById(this.containerId);
      if(!el) return;
      el.innerHTML = typeof renderer === 'function' ? renderer() : renderer;
      if(window.postRender && typeof window.postRender[path] === 'function'){
        window.postRender[path]();
      }
      // set active nav
      document.querySelectorAll('a[data-link]').forEach(function(a){
        if(a.getAttribute('href') === path){ a.classList.add('active'); } else { a.classList.remove('active'); }
      });
    }
  };
})();


(function(){
  document.addEventListener('DOMContentLoaded', function(){
    document.getElementById('year').textContent = new Date().getFullYear();
    SpaRouter.mount('app');
  });
})();


(function(){
  function renderCards(){
    var s = DB.get();
    var current = s.periods[s.periods.length-1].id;
    var html = '<div class="row g-3">';
    s.kpis.forEach(function(k){
      var target = (s.targets.find(function(t){ return t.kpiId===k.id && t.periodId===current; })||{}).target;
      var actual = (s.actuals.find(function(a){ return a.kpiId===k.id && a.periodId===current; })||{}).value;
      var ach = U.calcAchievement(actual, target, k.direction);
      var badge = U.trendColor(ach);
      html += '\
      <div class="col-12 col-md-6 col-lg-4">\
        <div class="card card-kpi h-100">\
          <div class="card-body">\
            <div class="d-flex justify-content-between align-items-start mb-2">\
              <div>\
                <div class="small text-muted">'+k.code+'</div>\
                <h6 class="mb-0">'+k.name+' <span class="badge bg-'+badge+' ms-1">'+(ach?U.fmtPct(ach):'-')+'</span></h6>\
              </div>\
              <div class="text-end small text-muted">'+k.category+'</div>\
            </div>\
            <div class="d-flex justify-content-between">\
              <div>\
                <div class="text-muted small">Target</div>\
                <div class="fw-semibold">'+U.fmtNum(target)+' '+k.unit+'</div>\
              </div>\
              <div class="text-end">\
                <div class="text-muted small">Actual</div>\
                <div class="fw-semibold">'+U.fmtNum(actual)+' '+k.unit+'</div>\
              </div>\
            </div>\
            <canvas class="mt-3" id="chart-'+k.id+'" height="80"></canvas>\
          </div>\
        </div>\
      </div>';
    });
    html += '</div>';
    return html;
  }

  function render(){
    var s = DB.get();
    var current = s.periods[s.periods.length-1].id;
    return '\
    <div class="d-flex align-items-center justify-content-between mb-3">\
      <h5 class="mb-0"><i class="bi bi-speedometer2 me-2"></i>Dashboard</h5>\
      <div class="text-muted small">Period: '+current+'</div>\
    </div>\
    '+renderCards();
  }

  function afterRender(){
    var s = DB.get();
    var labels = s.periods.map(function(p){ return p.id; });
    s.kpis.forEach(function(k){
      var ctx = document.getElementById('chart-'+k.id);
      if(!ctx) return;
      var data = labels.map(function(pid){
        var a = s.actuals.find(function(x){ return x.kpiId===k.id && x.periodId===pid; });
        return a ? a.value : null;
      });
      new Chart(ctx, {
        type: 'line',
        data: { labels: labels, datasets: [{ label: k.name, data: data, borderColor: '#0d6efd', backgroundColor: 'rgba(13,110,253,.2)', tension: .3, fill: true, pointRadius: 2 }] },
        options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: false } } }
      });
    });
  }

  SpaRouter.register('#/dashboard', render);
  window.postRender = window.postRender || {}; window.postRender['#/dashboard'] = afterRender;
})();


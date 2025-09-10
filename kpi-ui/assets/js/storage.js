(function(){
  var KEY = 'kpi_ui_proto_v1';
  function load(){
    try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch(e){ return {}; }
  }
  function save(state){
    localStorage.setItem(KEY, JSON.stringify(state));
  }
  function ensure(){
    var s = load();
    if(!s.periods){
      var periods = [];
      var now = new Date();
      for(var i=5;i>=0;i--){
        var d = new Date(now.getFullYear(), now.getMonth()-i, 1);
        var name = d.toISOString().slice(0,7);
        periods.push({ id: name, name: name });
      }
      s.periods = periods;
    }
    if(!s.kpis){
      s.kpis = [
        { id: 'KPI-001', code: 'KPI-001', name: 'OEE', category: 'Production', unit: '%', direction: 'Up', method: 'Linear' },
        { id: 'KPI-002', code: 'KPI-002', name: 'Scrap Rate', category: 'Production', unit: '%', direction: 'Down', method: 'Linear' },
        { id: 'KPI-003', code: 'KPI-003', name: 'On-time Delivery', category: 'Office', unit: '%', direction: 'Up', method: 'Linear' }
      ];
    }
    if(!s.targets){
      s.targets = [];
      var currentPeriod = s.periods[s.periods.length-1].id;
      s.kpis.forEach(function(k, idx){
        s.targets.push({ id: 'T-'+k.id+'-'+currentPeriod, kpiId: k.id, periodId: currentPeriod, target: idx === 1 ? 3 : 90, weight: 30 + (idx*10) });
      });
    }
    if(!s.actuals){
      s.actuals = [];
      // seed some actuals for chart
      s.periods.forEach(function(p){
        s.kpis.forEach(function(k){
          var base = k.direction === 'Up' ? 85 : 4.5;
          var jitter = (Math.random()*10) - 5;
          var val = Math.max(0, +(base + jitter).toFixed(2));
          s.actuals.push({ id: 'A-'+k.id+'-'+p.id, kpiId: k.id, periodId: p.id, value: val, note: '' });
        });
      });
    }
    save(s);
    return s;
  }
  function get(){ return ensure(); }
  function set(fn){ var s = ensure(); fn(s); save(s); }

  window.DB = { get: get, set: set };
})();


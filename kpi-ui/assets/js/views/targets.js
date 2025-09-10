(function(){
  function render(){
    var s = DB.get();
    var current = s.periods[s.periods.length-1].id;
    var rows = s.kpis.map(function(k){
      var t = s.targets.find(function(x){ return x.kpiId===k.id && x.periodId===current; }) || { target: '', weight: 0 };
      return '\
        <tr data-id="'+k.id+'">\
          <td>'+k.code+'</td>\
          <td>'+k.name+'</td>\
          <td style="width:160px;"><input type="number" step="0.01" class="form-control form-control-sm" name="target" value="'+t.target+'"></td>\
          <td style="width:120px;"><input type="number" step="1" class="form-control form-control-sm" name="weight" value="'+t.weight+'"></td>\
          <td>'+k.unit+'</td>\
        </tr>';
    }).join('');
    return '\
      <div class="d-flex align-items-center justify-content-between mb-3">\
        <h5 class="mb-0"><i class="bi bi-bullseye me-2"></i>Targets</h5>\
        <div class="d-flex align-items-center">\
          <select id="periodSelect" class="form-select form-select-sm me-2">'+s.periods.map(function(p){ return '<option '+(p.id===current?'selected':'')+' value="'+p.id+'">'+p.id+'</option>'; }).join('')+'</select>\
          <button id="btnSaveTargets" class="btn btn-sm btn-primary"><i class="bi bi-save me-1"></i>Save</button>\
        </div>\
      </div>\
      <div class="table-responsive">\
        <table class="table table-sm align-middle">\
          <thead><tr><th>Code</th><th>Name</th><th>Target</th><th>Weight</th><th>Unit</th></tr></thead>\
          <tbody>'+rows+'</tbody>\
        </table>\
      </div>\
      <div class="text-muted small">Tip: ปรับค่าแล้วกด Save เพื่อบันทึก</div>';
  }

  function afterRender(){
    var s = DB.get();
    var current = s.periods[s.periods.length-1].id;
    var periodSelect = document.getElementById('periodSelect');
    periodSelect.addEventListener('change', function(){ SpaRouter._render(); });
    document.getElementById('btnSaveTargets').addEventListener('click', function(){
      var periodId = periodSelect.value;
      var rows = document.querySelectorAll('tbody tr[data-id]');
      DB.set(function(state){
        rows.forEach(function(tr){
          var kpiId = tr.getAttribute('data-id');
          var target = parseFloat(tr.querySelector('input[name="target"]').value || '0');
          var weight = parseFloat(tr.querySelector('input[name="weight"]').value || '0');
          var idx = state.targets.findIndex(function(x){ return x.kpiId===kpiId && x.periodId===periodId; });
          var record = { id: 'T-'+kpiId+'-'+periodId, kpiId: kpiId, periodId: periodId, target: target, weight: weight };
          if(idx>=0) state.targets[idx] = record; else state.targets.push(record);
        });
      });
      var btn = document.getElementById('btnSaveTargets');
      btn.disabled = true; btn.innerHTML = '<i class="bi bi-check2"></i> Saved';
      setTimeout(function(){ btn.disabled = false; btn.innerHTML = '<i class="bi bi-save me-1"></i>Save'; }, 1200);
    });
  }

  SpaRouter.register('#/targets', render);
  window.postRender = window.postRender || {}; window.postRender['#/targets'] = afterRender;
})();


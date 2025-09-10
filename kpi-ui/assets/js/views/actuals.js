(function(){
  function renderTable(){
    var s = DB.get();
    var current = s.periods[s.periods.length-1].id;
    var rows = s.kpis.map(function(k){
      var t = s.targets.find(function(x){ return x.kpiId===k.id && x.periodId===current; });
      var a = s.actuals.find(function(x){ return x.kpiId===k.id && x.periodId===current; });
      var ach = a && t ? U.calcAchievement(a.value, t.target, k.direction) : null;
      return '\
        <tr>\
          <td>'+k.code+'</td>\
          <td>'+k.name+'</td>\
          <td>'+ (t? U.fmtNum(t.target)+' '+k.unit : '-') +'</td>\
          <td>'+ (a? U.fmtNum(a.value)+' '+k.unit : '-') +'</td>\
          <td>\
            <span class="traffic-dot '+U.trafficDot(ach)+'"></span>\
            <span class="ms-1">'+(ach?U.fmtPct(ach):'-')+'</span>\
          </td>\
          <td class="text-end" style="width:120px;">\
            <button class="btn btn-sm btn-outline-primary" data-action="add" data-id="'+k.id+'"><i class="bi bi-plus-lg"></i></button>\
          </td>\
        </tr>';
    }).join('');
    return '\
      <div class="table-responsive">\
        <table class="table table-sm align-middle">\
          <thead><tr><th>Code</th><th>Name</th><th>Target</th><th>Actual</th><th>Achv</th><th class="text-end">Actions</th></tr></thead>\
          <tbody>'+rows+'</tbody>\
        </table>\
      </div>';
  }

  function render(){
    var s = DB.get();
    var current = s.periods[s.periods.length-1].id;
    return '\
      <div class="d-flex align-items-center justify-content-between mb-3">\
        <h5 class="mb-0"><i class="bi bi-clipboard2-data me-2"></i>Actuals</h5>\
        <div class="d-flex align-items-center">\
          <select id="periodSelect" class="form-select form-select-sm">'+s.periods.map(function(p){ return '<option '+(p.id===current?'selected':'')+' value="'+p.id+'">'+p.id+'</option>'; }).join('')+'</select>\
        </div>\
      </div>\
      '+renderTable()+\
      '<div class="modal fade" id="actualModal" tabindex="-1" aria-hidden="true">\
        <div class="modal-dialog">\
          <form class="modal-content" id="actualForm">\
            <div class="modal-header"><h5 class="modal-title">Add Actual</h5><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>\
            <div class="modal-body">\
              <input type="hidden" name="kpiId">\
              <div class="mb-2"><label class="form-label small">Period</label><select name="periodId" class="form-select form-select-sm">'+s.periods.map(function(p){ return '<option '+(p.id===current?'selected':'')+' value="'+p.id+'">'+p.id+'</option>'; }).join('')+'</select></div>\
              <div class="mb-2"><label class="form-label small">Value</label><input name="value" type="number" step="0.01" required class="form-control form-control-sm"></div>\
              <div class="mb-2"><label class="form-label small">Note</label><input name="note" class="form-control form-control-sm"></div>\
            </div>\
            <div class="modal-footer"><button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button><button class="btn btn-primary" type="submit">Save</button></div>\
          </form>\
        </div>\
      </div>';
  }

  function afterRender(){
    var container = document.getElementById('app');
    container.addEventListener('click', function(e){
      var btn = e.target.closest('button[data-action="add"]');
      if(!btn) return;
      openModal(btn.getAttribute('data-id'));
    });
    document.getElementById('periodSelect').addEventListener('change', function(){ SpaRouter._render(); });

    function openModal(kpiId){
      var modalEl = document.getElementById('actualModal');
      var modal = new bootstrap.Modal(modalEl);
      var form = document.getElementById('actualForm');
      form.reset();
      form.kpiId.value = kpiId;
      form.onsubmit = function(ev){
        ev.preventDefault();
        var data = U.serializeForm(form);
        data.value = parseFloat(data.value);
        DB.set(function(s){
          var idx = s.actuals.findIndex(function(x){ return x.kpiId===data.kpiId && x.periodId===data.periodId; });
          var record = { id: 'A-'+data.kpiId+'-'+data.periodId, kpiId: data.kpiId, periodId: data.periodId, value: data.value, note: data.note||'' };
          if(idx>=0) s.actuals[idx] = record; else s.actuals.push(record);
        });
        modal.hide();
        SpaRouter._render();
      };
      modal.show();
    }
  }

  SpaRouter.register('#/actuals', render);
  window.postRender = window.postRender || {}; window.postRender['#/actuals'] = afterRender;
})();


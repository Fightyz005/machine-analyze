(function(){
  function renderTable(){
    var s = DB.get();
    if(!s.kpis.length){
      return '<div class="empty-state">ยังไม่มี KPI</div>';
    }
    var rows = s.kpis.map(function(k){
      return '\
        <tr>\
          <td>'+k.code+'</td>\
          <td>'+k.name+'</td>\
          <td>'+k.category+'</td>\
          <td>'+k.unit+'</td>\
          <td>'+k.direction+'</td>\
          <td>'+k.method+'</td>\
          <td class="text-end">\
            <button class="btn btn-sm btn-outline-primary" data-action="edit" data-id="'+k.id+'"><i class="bi bi-pencil-square"></i></button>\
            <button class="btn btn-sm btn-outline-danger ms-1" data-action="delete" data-id="'+k.id+'"><i class="bi bi-trash"></i></button>\
          </td>\
        </tr>';
    }).join('');
    return '\
      <div class="table-responsive">\
        <table class="table table-sm align-middle">\
          <thead>\
            <tr>\
              <th>Code</th><th>Name</th><th>Category</th><th>Unit</th><th>Direction</th><th>Method</th>\
              <th class="text-end" style="width:120px;">Actions</th>\
            </tr>\
          </thead>\
          <tbody>'+rows+'</tbody>\
        </table>\
      </div>';
  }

  function render(){
    return '\
      <div class="d-flex align-items-center justify-content-between mb-3">\
        <h5 class="mb-0"><i class="bi bi-list-check me-2"></i>KPI Library</h5>\
        <div>\
          <button id="btnAddKpi" class="btn btn-primary"><i class="bi bi-plus-lg me-1"></i>Add KPI</button>\
        </div>\
      </div>\
      '+renderTable()+\
      '<div class="modal fade" id="kpiModal" tabindex="-1" aria-hidden="true">\
        <div class="modal-dialog">\
          <form class="modal-content" id="kpiForm">\
            <div class="modal-header"><h5 class="modal-title">KPI</h5><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div>\
            <div class="modal-body">\
              <input type="hidden" name="id">\
              <div class="row g-2">\
                <div class="col-6"><label class="form-label small">Code</label><input name="code" required class="form-control form-control-sm"></div>\
                <div class="col-6"><label class="form-label small">Name</label><input name="name" required class="form-control form-control-sm"></div>\
                <div class="col-6"><label class="form-label small">Category</label><select name="category" class="form-select form-select-sm"><option>Production</option><option>Office</option><option>Quality</option><option>Cost</option></select></div>\
                <div class="col-6"><label class="form-label small">Unit</label><input name="unit" value="%" class="form-control form-control-sm"></div>\
                <div class="col-6"><label class="form-label small">Direction</label><select name="direction" class="form-select form-select-sm"><option>Up</option><option>Down</option></select></div>\
                <div class="col-6"><label class="form-label small">Method</label><select name="method" class="form-select form-select-sm"><option>Linear</option><option>Band</option><option>Threshold</option></select></div>\
              </div>\
            </div>\
            <div class="modal-footer"><button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancel</button><button class="btn btn-primary" type="submit">Save</button></div>\
          </form>\
        </div>\
      </div>';
  }

  function afterRender(){
    var container = document.getElementById('app');
    container.addEventListener('click', function(e){
      var btn = e.target.closest('button[data-action]');
      if(!btn) return;
      var id = btn.getAttribute('data-id');
      var action = btn.getAttribute('data-action');
      if(action === 'delete'){
        var s = DB.get();
        s.kpis = s.kpis.filter(function(x){ return x.id !== id; });
        DB.set(function(state){ state.kpis = s.kpis; });
        SpaRouter._render();
      }
      if(action === 'edit'){
        openModal(DB.get().kpis.find(function(x){ return x.id===id; }));
      }
    });
    document.getElementById('btnAddKpi').addEventListener('click', function(){ openModal(); });

    function openModal(item){
      var modalEl = document.getElementById('kpiModal');
      var modal = new bootstrap.Modal(modalEl);
      var form = document.getElementById('kpiForm');
      form.reset();
      if(item){ Object.keys(item).forEach(function(k){ if(form[k]) form[k].value = item[k]; }); }
      form.onsubmit = function(ev){
        ev.preventDefault();
        var data = U.serializeForm(form);
        if(!data.id){ data.id = data.code || U.uid('KPI'); }
        DB.set(function(s){
          var existing = s.kpis.findIndex(function(x){ return x.id===data.id; });
          var normalized = { id: data.id, code: data.code, name: data.name, category: data.category, unit: data.unit, direction: data.direction, method: data.method };
          if(existing >= 0){ s.kpis[existing] = normalized; }
          else { s.kpis.push(normalized); }
        });
        modal.hide();
        SpaRouter._render();
      };
      modal.show();
    }
  }

  SpaRouter.register('#/kpis', render);
  window.postRender = window.postRender || {}; window.postRender['#/kpis'] = afterRender;
})();


(function(){
  function uid(prefix){ return (prefix||'id')+'_'+Math.random().toString(36).slice(2,9); }
  function fmtPct(n){ if(n === null || n === undefined || isNaN(n)) return '-'; return (Math.round(n*10)/10).toFixed(1)+'%'; }
  function fmtNum(n){ if(n === null || n === undefined || isNaN(n)) return '-'; return (+n).toLocaleString(undefined, { maximumFractionDigits: 2 }); }
  function calcAchievement(actual, target, direction){
    if(target === 0 || target === null || target === undefined) return null;
    if(direction === 'Down'){
      if(actual === 0) return 150;
      return Math.min(150, (target/actual)*100);
    }
    return Math.min(150, (actual/target)*100);
  }
  function trendColor(pct){ if(pct === null) return 'secondary'; if(pct >= 100) return 'success'; if(pct >= 90) return 'warning'; return 'danger'; }
  function trafficDot(pct){ if(pct === null) return 'traffic-warn'; if(pct >= 100) return 'traffic-ok'; if(pct >= 90) return 'traffic-warn'; return 'traffic-bad'; }
  function byId(id){ return document.getElementById(id); }
  function serializeForm(form){
    var o = {}; new FormData(form).forEach(function(v,k){ o[k]=v; }); return o;
  }

  window.U = { uid: uid, fmtPct: fmtPct, fmtNum: fmtNum, calcAchievement: calcAchievement, trendColor: trendColor, trafficDot: trafficDot, byId: byId, serializeForm: serializeForm };
})();


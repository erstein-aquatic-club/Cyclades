(function(){
"use strict";
var h=React.createElement,useEffect=React.useEffect,useMemo=React.useMemo,useState=React.useState;
function todayIso(){var d=new Date(),m=String(d.getMonth()+1).padStart(2,"0"),day=String(d.getDate()).padStart(2,"0");return d.getFullYear()+"-"+m+"-"+day;}
function money(v,c){return new Intl.NumberFormat("fr-FR",{style:"currency",currency:c||"EUR"}).format(Number(v||0));}
function peopleText(arr){arr=arr||[];return arr.length===2?"François + Onja":(arr[0]==="Francois"?"François":(arr[0]||"Non affecté"));}

function AuthGate(props){
  var b=window.CycladesBackend;
  var ss=useState(null),session=ss[0],setSession=ss[1];
  var ls=useState(true),loading=ls[0],setLoading=ls[1];
  var fs=useState({username:"",password:""}),form=fs[0],setForm=fs[1];
  var es=useState(""),error=es[0],setError=es[1];
  var bs=useState(false),busy=bs[0],setBusy=bs[1];
  function refresh(){if(!b||!b.configured()){setSession(null);setLoading(false);return;}b.getSession().then(function(r){setSession(r.session||null);}).catch(function(){setSession(null);}).finally(function(){setLoading(false);});}
  useEffect(function(){refresh();window.addEventListener("cyclades-auth-changed",refresh);return function(){window.removeEventListener("cyclades-auth-changed",refresh);};},[]);
  function submit(ev){ev.preventDefault();setBusy(true);setError("");b.signIn(form.username.trim(),form.password).then(function(r){setSession(r.session||null);}).catch(function(){setError("Identifiant ou mot de passe incorrect.");}).finally(function(){setBusy(false);});}
  if(!b||!b.configured())return props.children(null);
  if(loading)return h("div",{className:"backend-overlay backend-notice"},"Vérification de la session…");
  if(!session)return h("div",{className:"backend-overlay"},h("main",{className:"page auth-page"},h("section",{className:"auth-card"},h("span",{className:"eyebrow"},"Accès privé"),h("h1",null,"Cyclades"),h("p",null,"Connecte-toi pour accéder au voyage."),h("form",{onSubmit:submit,className:"auth-form"},h("label",null,"Identifiant",h("input",{type:"text",required:true,autoComplete:"username",autoCapitalize:"none",value:form.username,onInput:function(x){setForm({username:x.target.value,password:form.password});}})),h("label",null,"Mot de passe",h("input",{type:"password",required:true,autoComplete:"current-password",value:form.password,onInput:function(x){setForm({username:form.username,password:x.target.value});}})),error?h("div",{className:"form-error"},error):null,h("button",{type:"submit",disabled:busy},busy?"Connexion…":"Se connecter")))));
  return props.children(session);
}

function ExpensesView(){
  var b=window.CycladesBackend;
  var es=useState([]),expenses=es[0],setExpenses=es[1];
  var fs=useState({amount:"",category:"Repas",description:"",expense_date:todayIso(),island:"",payment_method:"Carte",currency:"EUR",people:["Francois","Onja"]}),form=fs[0],setForm=fs[1];
  var ss=useState(""),status=ss[0],setStatus=ss[1];
  var ls=useState(true),loading=ls[0],setLoading=ls[1];
  var ps=useState(""),password=ps[0],setPassword=ps[1];
  function load(){setLoading(true);b.listExpenses().then(setExpenses).catch(function(err){setStatus(err.message||"Impossible de charger les dépenses.");}).finally(function(){setLoading(false);});}
  useEffect(load,[]);
  var recap=useMemo(function(){var r={global:0,Francois:0,Onja:0};expenses.forEach(function(item){var a=Number(item.amount||0),p=item.people||[];r.global+=a;if(p.length){var share=a/p.length;p.forEach(function(name){if(r[name]!==undefined)r[name]+=share;});}});return r;},[expenses]);
  function setFormPerson(name,checked){var next=form.people.slice();if(checked&&next.indexOf(name)<0)next.push(name);if(!checked)next=next.filter(function(x){return x!==name;});if(!next.length)return;setForm(Object.assign({},form,{people:next}));}
  function submit(ev){ev.preventDefault();setStatus("");b.addExpense(form).then(function(){setForm({amount:"",category:form.category,description:"",expense_date:form.expense_date,island:form.island,payment_method:form.payment_method,currency:"EUR",people:form.people});setStatus("Dépense enregistrée.");load();}).catch(function(err){setStatus(err.message||"Enregistrement impossible.");});}
  function remove(id){b.deleteExpense(id).then(load).catch(function(err){setStatus(err.message||"Suppression impossible.");});}
  function togglePerson(item,name){var next=(item.people||[]).slice(),i=next.indexOf(name);if(i>=0){if(next.length===1)return;next.splice(i,1);}else next.push(name);b.setExpensePeople(item.id,next).then(load).catch(function(err){setStatus(err.message||"Réaffectation impossible.");});}
  function changePassword(ev){ev.preventDefault();setStatus("");b.updatePassword(password).then(function(){setPassword("");setStatus("Mot de passe modifié.");}).catch(function(err){setStatus(err.message||"Modification impossible.");});}
  return h("main",{className:"page expenses-page"},
    h("section",{className:"expenses-hero"},h("div",null,h("span",{className:"eyebrow"},"Dépenses Grèce 2026"),h("h1",null,"Dépenses"),h("p",null,"Pot commun avec répartition François / Onja."))),
    h("section",{className:"recap-grid"},
      h("div",{className:"recap-card"},h("span",null,"Global"),h("strong",null,money(recap.global,"EUR"))),
      h("div",{className:"recap-card"},h("span",null,"François"),h("strong",null,money(recap.Francois,"EUR"))),
      h("div",{className:"recap-card"},h("span",null,"Onja"),h("strong",null,money(recap.Onja,"EUR")))
    ),
    h("p",{className:"allocation-note"},"Une dépense affectée aux deux est partagée à 50/50 dans le récap individuel."),
    h("section",{className:"expense-grid"},
      h("form",{className:"expense-form",onSubmit:submit},h("h2",null,"Ajouter une dépense"),h("div",{className:"field-grid"},
        h("label",null,"Montant",h("input",{type:"number",min:"0.01",step:"0.01",required:true,inputMode:"decimal",value:form.amount,onInput:function(x){setForm(Object.assign({},form,{amount:x.target.value}));}})),
        h("label",null,"Date",h("input",{type:"date",required:true,value:form.expense_date,onInput:function(x){setForm(Object.assign({},form,{expense_date:x.target.value}));}})),
        h("label",null,"Catégorie",h("select",{value:form.category,onChange:function(x){setForm(Object.assign({},form,{category:x.target.value}));}},["Repas","Transport","Hôtel","Visite","Shopping","Courses","Autre"].map(function(i){return h("option",{key:i,value:i},i);}))),
        h("label",null,"Île / lieu",h("input",{type:"text",value:form.island,placeholder:"Santorin, Naxos…",onInput:function(x){setForm(Object.assign({},form,{island:x.target.value}));}})),
        h("label",null,"Paiement",h("select",{value:form.payment_method,onChange:function(x){setForm(Object.assign({},form,{payment_method:x.target.value}));}},["Carte","Espèces","Apple Pay","Autre"].map(function(i){return h("option",{key:i,value:i},i);})))
      ),
      h("label",null,"Description",h("input",{type:"text",value:form.description,placeholder:"Ex. dîner Oia",onInput:function(x){setForm(Object.assign({},form,{description:x.target.value}));}})),
      h("div",{className:"people-field"},h("span",null,"Affecter à"),h("label",null,h("input",{type:"checkbox",checked:form.people.indexOf("Francois")>=0,onChange:function(x){setFormPerson("Francois",x.target.checked);}})," François"),h("label",null,h("input",{type:"checkbox",checked:form.people.indexOf("Onja")>=0,onChange:function(x){setFormPerson("Onja",x.target.checked);}})," Onja")),
      status?h("div",{className:"form-status"},status):null,h("button",{type:"submit"},"Enregistrer")),
      h("section",{className:"expense-list-card"},h("div",{className:"expense-list-head"},h("h2",null,"Historique"),h("button",{type:"button",onClick:load},"Actualiser")),loading?h("p",{className:"muted"},"Chargement…"):null,!loading&&!expenses.length?h("p",{className:"muted"},"Aucune dépense enregistrée."):null,
        h("div",{className:"expense-list"},expenses.map(function(item){return h("article",{className:"expense-row",key:item.id},
          h("div",{className:"expense-main"},h("strong",null,item.description||item.category),h("span",null,[item.expense_date,item.island,item.payment_method].filter(Boolean).join(" · ")),h("div",{className:"allocation-buttons"},["Francois","Onja"].map(function(name){var active=(item.people||[]).indexOf(name)>=0;return h("button",{key:name,type:"button",className:active?"active":"",onClick:function(){togglePerson(item,name);}},name==="Francois"?"François":name);})),h("small",null,peopleText(item.people))),
          h("div",{className:"expense-row-side"},h("strong",null,money(item.amount,item.currency)),h("button",{type:"button",onClick:function(){remove(item.id);},"aria-label":"Supprimer"},"×"))
        );}))
      )
    ),
    h("section",{className:"password-card"},h("h2",null,"Changer le mot de passe"),h("form",{className:"password-form",onSubmit:changePassword},h("input",{type:"password",minLength:4,required:true,value:password,placeholder:"Nouveau mot de passe",onInput:function(x){setPassword(x.target.value);}}),h("button",{type:"submit"},"Modifier"))),
    h("button",{className:"logout-btn",type:"button",onClick:function(){b.signOut();}},"Se déconnecter")
  );
}

function installExpenseTab(){var nav=document.querySelector(".primary-tabs");if(!nav||nav.querySelector(".backend-expense-tab"))return;nav.classList.add("backend-four-tabs");var btn=document.createElement("button");btn.type="button";btn.className="backend-expense-tab";btn.textContent="Dépenses";btn.addEventListener("click",function(){window.dispatchEvent(new Event("cyclades:expenses-open"));});nav.appendChild(btn);}
function BackendShell(){var os=useState(false),open=os[0],setOpen=os[1],ss=useState(null),session=ss[0],setSession=ss[1];useEffect(function(){function show(){setOpen(true);}window.addEventListener("cyclades:expenses-open",show);return function(){window.removeEventListener("cyclades:expenses-open",show);};},[]);return h(AuthGate,null,function(nextSession){if(nextSession!==session)setTimeout(function(){setSession(nextSession);},0);if(nextSession){var root=document.getElementById("root");if(root)root.classList.remove("backend-hidden");setTimeout(installExpenseTab,0);}return nextSession&&open?h("div",{className:"backend-overlay expenses-overlay"},h("button",{className:"backend-overlay-close",type:"button",onClick:function(){setOpen(false);},"aria-label":"Fermer"},"×"),h(ExpensesView)):null;});}
function boot(){var mount=document.getElementById("backend-root");if(!mount)return;ReactDOM.createRoot(mount).render(h(BackendShell));var observer=new MutationObserver(installExpenseTab);observer.observe(document.body,{childList:true,subtree:true});setTimeout(installExpenseTab,200);}
window.CycladesBackendUI={AuthGate:AuthGate,ExpensesView:ExpensesView};
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
})();

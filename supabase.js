(function () {
  "use strict";
  var config = window.CYCLADES_SUPABASE || {};
  var client = null;
  function configured(){return !!(config.url&&config.publishableKey&&window.supabase&&window.supabase.createClient);}
  function getClient(){if(!configured())return null;if(!client){client=window.supabase.createClient(config.url,config.publishableKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});}return client;}
  async function getSession(){var sb=getClient();if(!sb)return {session:null,error:null};var r=await sb.auth.getSession();return {session:r.data.session,error:r.error||null};}
  async function signIn(email,password){var sb=getClient();if(!sb)throw new Error("Supabase n’est pas encore configuré.");var r=await sb.auth.signInWithPassword({email:email,password:password});if(r.error)throw r.error;return r.data;}
  async function signOut(){var sb=getClient();if(!sb)return;var r=await sb.auth.signOut();if(r.error)throw r.error;}
  async function listExpenses(){var sb=getClient();if(!sb)throw new Error("Supabase n’est pas encore configuré.");var r=await sb.from("expenses").select("id,user_id,amount,currency,category,description,expense_date,island,payment_method,created_at").order("expense_date",{ascending:false}).order("created_at",{ascending:false});if(r.error)throw r.error;return r.data||[];}
  async function addExpense(expense){var sb=getClient();if(!sb)throw new Error("Supabase n’est pas encore configuré.");var sr=await sb.auth.getSession();var user=sr.data.session&&sr.data.session.user;if(!user)throw new Error("Connexion requise.");var payload={user_id:user.id,amount:Number(expense.amount),currency:expense.currency||"EUR",category:expense.category||"Autre",description:expense.description||null,expense_date:expense.expense_date,island:expense.island||null,payment_method:expense.payment_method||null};var r=await sb.from("expenses").insert(payload).select().single();if(r.error)throw r.error;return r.data;}
  async function deleteExpense(id){var sb=getClient();if(!sb)throw new Error("Supabase n’est pas encore configuré.");var r=await sb.from("expenses").delete().eq("id",id);if(r.error)throw r.error;}
  window.CycladesBackend={configured:configured,getClient:getClient,getSession:getSession,signIn:signIn,signOut:signOut,listExpenses:listExpenses,addExpense:addExpense,deleteExpense:deleteExpense};
})();

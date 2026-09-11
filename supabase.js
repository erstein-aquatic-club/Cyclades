(function () {
  "use strict";
  var config = window.CYCLADES_SUPABASE || {};
  var client = null;
  var TOKEN_KEY = "cyclades_session_token";
  function configured(){return !!(config.url&&config.publishableKey&&window.supabase&&window.supabase.createClient);}
  function getClient(){if(!configured())return null;if(!client){client=window.supabase.createClient(config.url,config.publishableKey,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});}return client;}
  function token(){try{return localStorage.getItem(TOKEN_KEY)||"";}catch(_e){return "";}}
  function saveToken(value){try{if(value)localStorage.setItem(TOKEN_KEY,value);else localStorage.removeItem(TOKEN_KEY);}catch(_e){}window.dispatchEvent(new Event("cyclades-auth-changed"));}
  async function getSession(){var sb=getClient(),t=token();if(!sb||!t)return {session:null,error:null};var r=await sb.rpc("app_session",{p_token:t});if(r.error){saveToken("");return {session:null,error:r.error};}var row=r.data&&r.data[0];if(!row){saveToken("");return {session:null,error:null};}return {session:{user:{id:row.user_id,username:row.username,display_name:row.display_name},expires_at:row.expires_at},error:null};}
  async function signIn(username,password){var sb=getClient();if(!sb)throw new Error("Supabase n’est pas encore configuré.");var r=await sb.rpc("app_login",{p_username:String(username||"").trim(),p_password:String(password||"")});if(r.error)throw r.error;var row=r.data&&r.data[0];if(!row||!row.session_token)throw new Error("Connexion impossible.");saveToken(row.session_token);return {session:{user:{id:row.user_id,username:row.username,display_name:row.display_name},expires_at:row.expires_at}};}
  async function signOut(){var sb=getClient(),t=token();if(sb&&t){var r=await sb.rpc("app_logout",{p_token:t});if(r.error)console.warn(r.error);}saveToken("");}
  async function updatePassword(password){var sb=getClient(),t=token();if(!sb||!t)throw new Error("Connexion requise.");var r=await sb.rpc("app_change_password",{p_token:t,p_new_password:String(password||"")});if(r.error)throw r.error;return true;}
  async function listExpenses(){var sb=getClient(),t=token();if(!sb||!t)throw new Error("Connexion requise.");var r=await sb.rpc("app_list_expenses",{p_token:t});if(r.error)throw r.error;return r.data||[];}
  async function addExpense(expense){var sb=getClient(),t=token();if(!sb||!t)throw new Error("Connexion requise.");var r=await sb.rpc("app_add_expense",{p_token:t,p_amount:Number(expense.amount),p_currency:expense.currency||"EUR",p_category:expense.category||"Autre",p_description:expense.description||"",p_expense_date:expense.expense_date,p_island:expense.island||"",p_payment_method:expense.payment_method||""});if(r.error)throw r.error;return r.data;}
  async function deleteExpense(id){var sb=getClient(),t=token();if(!sb||!t)throw new Error("Connexion requise.");var r=await sb.rpc("app_delete_expense",{p_token:t,p_expense_id:id});if(r.error)throw r.error;return r.data;}
  window.CycladesBackend={configured:configured,getClient:getClient,getSession:getSession,signIn:signIn,signOut:signOut,updatePassword:updatePassword,listExpenses:listExpenses,addExpense:addExpense,deleteExpense:deleteExpense};
})();

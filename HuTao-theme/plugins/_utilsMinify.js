let riotclient_auth,riotclient_port,phase,pvp_net_id,summoner_id,regex_rc_auth=/^--riotclient-auth-token=(.+)$/,regex_rc_port=/^--riotclient-app-port=([0-9]+)$/,debug_sub=!1,routines=[],mutationCallbacks=[];function addCss(a){const b=document.createElement("link");b.href=a,b.type="text/css",b.rel="stylesheet",document.body.append(b)}async function subscribe_endpoint(a,b){const c=document.querySelector("link[rel=\"riot:plugins:websocket\"]").href,d=new WebSocket(c,"wamp");d.onopen=()=>d.send(JSON.stringify([5,"OnJsonApiEvent"+a.replace(/\//g,"_")])),d.onmessage=b}async function fetch_riotclient_credentials(){await fetch("/riotclient/command-line-args",{method:"GET"}).then(a=>a.json()).then(a=>{a.forEach(a=>{regex_rc_auth.exec(a)?to_export.riotclient_auth=regex_rc_auth.exec(a)[1]:regex_rc_port.exec(a)&&(to_export.riotclient_port=regex_rc_port.exec(a)[1])})}),debug_sub&&console.log(to_export.riotclient_auth,to_export.riotclient_port)}let updateUserPvpNetInfos=async a=>{let b=JSON.parse(a.data)[2].data;b!=null&&(to_export.pvp_net_id=b.id,to_export.summoner_id=b.summonerId)},updatePhaseCallback=async a=>{phase=JSON.parse(a.data)[2].data},debugLogEndpoints=async a=>{debug_sub&&console.log(JSON.parse(a.data)[2].uri,JSON.parse(a.data)[2].data)};function routineAddCallback(a,b){routines.push({callback:a,targets:b})}function mutationObserverAddCallback(a,b){mutationCallbacks.push({callback:a,targets:b})}let to_export={riotclient_auth:riotclient_auth,riotclient_port:riotclient_port,phase:phase,summoner_id:summoner_id,pvp_net_id:pvp_net_id,subscribe_endpoint:subscribe_endpoint,routineAddCallback:routineAddCallback,mutationObserverAddCallback:mutationObserverAddCallback,addCss:addCss};module.exports=to_export,window.addEventListener("DOMContentLoaded",()=>{fetch_riotclient_credentials(),subscribe_endpoint("/lol-gameflow/v1/gameflow-phase",updatePhaseCallback),subscribe_endpoint("/lol-chat/v1/me",updateUserPvpNetInfos),subscribe_endpoint("",debugLogEndpoints),window.setInterval(()=>{routines.forEach(a=>{a.callback()})},1300);const a=new MutationObserver(a=>{for(let b of a)for(let a of b.addedNodes)if(a.nodeType===Node.ELEMENT_NODE&&a.classList)for(let b of a.classList)for(let c of mutationCallbacks)(-1!=c.targets.indexOf(b)||"*"in c.targets)&&c.callback(a)});a.observe(document,{attributes:!1,childList:!0,subtree:!0})});
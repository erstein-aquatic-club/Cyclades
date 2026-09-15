(function(){
  var d=window.CYCLADES_ENRICHMENT;
  if(!d||!d.operational||!d.operational.days)return;

  /* Replace the legacy J8 source before app.js parses trip-data.html. */
  var nativeFetch=window.fetch.bind(window);
  window.fetch=function(input,init){
    var url=typeof input==='string'?input:(input&&input.url)||'';
    return nativeFetch(input,init).then(function(response){
      if(!/trip-data\.html(?:\?|$)/.test(url))return response;
      return response.text().then(function(source){
        var j8='<details id="j8"><summary><div class="bdg e">J8</div><div><div class="sm-t">Grand tour de Paros en ATV 450L</div><div class="sm-d">mer. 16 sept · PAROS · ATV</div></div></summary><div class="body">'+
          '<div class="box bx-r"><b>À anticiper — ce soir</b>Préparer les bagages : jeudi, check-out à 08h00 et ferry Paros → Mykonos à 09h40.</div>'+
          '<div class="tl R"><div class="h">09h00</div><div><b>Prise du 450L chez Loukis Rentals</b><br>Location confirmée jusqu’à 20h00. Vérifier les 2 casques, photographier le véhicule et la jauge, confirmer le niveau de carburant attendu au retour.</div></div>'+
          '<div class="tl"><div class="h">09h25</div><div><b>Carrières antiques de Marathi</b><br>Premier arrêt court sur la route de Lefkes : anciennes carrières du célèbre marbre de Paros. Environ 20–25 min sur place.</div></div>'+
          '<div class="tl D"><div class="h">10h05</div><div><b>Lefkes</b><br>Balade à pied dans l’ancienne capitale : ruelles, maisons cycladiques, Agia Triada et panoramas. Environ 50 min.</div></div>'+
          '<div class="tl D"><div class="h">11h05</div><div><b>Prodromos</b><br>Garer le quad à l’entrée et traverser le petit village à pied. Environ 30 min.</div></div>'+
          '<div class="tl"><div class="h">11h50</div><div><b>Marpissa</b><br>Passage court dans le village puis descente vers la côte est.</div></div>'+
          '<div class="tl D"><div class="h">12h20</div><div><b>Piso Livadi · déjeuner</b><br>Pause au petit port. Premier choix : Markakis Restaurant pour poisson, fruits de mer et cuisine grecque au bord de l’eau. Alternative : Gialos.</div></div>'+
          '<div class="tl D"><div class="h">13h50</div><div><b>Kalogeros ou Golden Beach</b><br>Kalogeros pour un arrêt plus sauvage ; Golden Beach pour une grande plage facile et davantage de services. Départ vers 14h40.</div></div>'+
          '<div class="tl D"><div class="h">15h45</div><div><b>Kolymbithres Beach</b><br>Rejoindre directement les criques en ATV. Baignade entre les blocs de granite ; aucun bateau-taxi nécessaire.</div></div>'+
          '<div class="tl D"><div class="h">16h40</div><div><b>Monastiri Beach + Paros Park</b><br>Dernier grand arrêt. Baignade à Monastiri puis, si vous avez encore envie de marcher, balade dans Paros Park vers le phare et les points de vue de la côte nord.</div></div>'+
          '<div class="tl"><div class="h">18h40</div><div><b>Départ de Monastiri vers Parikia</b><br>Retour direct. Faire le complément de carburant si nécessaire et garder une marge confortable.</div></div>'+
          '<div class="tl R"><div class="h">avant 20h</div><div><b>Restitution chez Loukis</b><br>Rendre le 450L selon le niveau de carburant convenu.</div></div>'+
          '<div class="box bx-b"><b>Boucle optimisée</b>Parikia → Marathi → Lefkes → Prodromos → Marpissa → Piso Livadi → Kalogeros / Golden Beach → Kolymbithres → Monastiri / Paros Park → Parikia. Environ 70–80 km selon les détours.</div>'+
          '<div class="box bx-g"><b>Déjeuner conseillé</b><b style="display:inline">Markakis Restaurant, Piso Livadi</b> : premier choix pour cette boucle, avec poisson, fruits de mer et cuisine grecque au bord du petit port. Alternative : Gialos, également à Piso Livadi.</div>'+
          '<div class="box bx-a"><b>Conduite</b>Casques conducteur et passager. Rester sur les routes autorisées par Loukis. Eau, lunettes, crème solaire et coupe-vent léger. Le Blue Lagoon est volontairement exclu du parcours.</div>'+
          '<div class="trip"><div class="n">ATV · Loukis Rentals · 450L</div><div class="r"><div class="k">Horaire</div><div class="v">09h00 → 20h00</div></div><div class="r"><div class="k">Boucle</div><div class="v">Marathi · Lefkes · villages · côte est · Kolymbithres · Monastiri</div></div><div class="r"><div class="k">Retour</div><div class="v">Chez Loukis avant 20h00</div></div></div>'+
          '<div class="cash"><div><div class="l">Espèces conseillées J8</div></div><div class="v">20–40 €</div></div>'+
          '<div style="font-size:.82rem;color:var(--mut);margin-top:10px">Nuit 8 – Casa Di Roma, Parikia</div></div></details>';
        source=source.replace(/<details id="j8">[\s\S]*?<\/details>/,j8);
        return new Response(source,{status:response.status,statusText:response.statusText,headers:response.headers});
      });
    });
  };

  d.operational.days.j7=[
    {id:"j7-now",level:"ok",title:"Parikia à pied aujourd’hui · sans bus",text:"Panagia Ekatontapyliani est déjà visitée. Reste dans Parikia : vieille ville, Kastro / Frangokastello, ruelles autour d’Agios Konstantinos, front de mer puis ancien cimetière si tu veux prolonger la marche.",action:"Boucle simple : Manto Mavrogenous Square → Main Street → Kastro → Agios Konstantinos → front de mer → ancien cimetière → Livadia. Compter environ 2–3 h en flânant."},
    {id:"j7-museum",level:"attention",title:"Musée archéologique fermé aujourd’hui",text:"Le Musée archéologique de Paros est fermé le mardi. Le musée byzantin/ecclésiastique dans le complexe d’Ekatontapyliani est une alternative si tu ne l’as pas déjà fait.",action:"Aujourd’hui, privilégier les sites extérieurs, le Kastro et la vieille ville."},
    {id:"j7-lunch-mana",level:"ok",title:"Déjeuner maintenant · Mana Mana",text:"Option simple à pied : cour ombragée, cuisine méditerranéenne/grecque, salades et plats légers.",action:"Bon choix avant de repartir marcher dans la vieille ville."},
    {id:"j7-lunch-hellas",level:"info",title:"Alternative rapide · Hellas au port",text:"Pour quelque chose de simple et économique : gyros / grill grec au port.",action:"À choisir surtout si tu veux manger vite et garder l’après-midi pour Parikia."},
    {id:"j7-evening",level:"info",title:"Fin d’après-midi / soirée",text:"Après la marche, Livadia est accessible à pied pour une pause baignade. Pour le coucher du soleil, remonter vers Agios Konstantinos / Kastro donne une belle vue sur la baie avant le dîner.",action:"Pas besoin de bus pour remplir l’après-midi."}
  ];

  d.operational.days.j8=[
    {id:"j8-atv-booked",level:"ok",title:"ATV Loukis 450L réservé · 09h00 → 20h00",text:"Mercredi 16 septembre : ATV 450L réservé chez Loukis Rentals à Parikia pour toute la journée.",action:"Petit-déjeuner avant 08h30 puis prise en charge à 09h00."},
    {id:"j8-atv-route",level:"info",title:"Grand tour ATV optimisé",text:"Parikia → Marathi → Lefkes → Prodromos → Marpissa → Piso Livadi → Kalogeros / Golden Beach → Kolymbithres → Monastiri / Paros Park → Parikia.",action:"Blue Lagoon supprimé. Aucun bus ni bateau-taxi. Retour direct de Monastiri vers Parikia à partir de 18h40."},
    {id:"j8-lunch",level:"ok",title:"Déjeuner à Piso Livadi",text:"Premier choix : Markakis Restaurant, bien placé au milieu de la boucle pour poisson, fruits de mer et cuisine grecque au bord de l’eau. Alternative : Gialos.",action:"Viser environ 12h20–13h40 pour garder du temps pour les plages et Monastiri."},
    {id:"j8-ferry-next-day",level:"critical",title:"Restitution avant 20h00 · ferry jeudi matin",text:"Rendre le quad chez Loukis mercredi avant 20h00. Le ferry Paros → Mykonos part jeudi 17 à 09h40.",action:"Après restitution et dîner, préparer les bagages. Check-out Casa Di Roma à 08h00 jeudi."}
  ];

  d.operational.days.j9=[
    {id:"j9-transfer-confirmed",level:"ok",title:"Arrivée Mykonos : transfert confirmé",text:"Jeudi 17 septembre : SeaJets SUPERRUNNER JET, Paros 09h40 → Mykonos New Port (Tourlos) 10h25. Alkistis Beach Hotel a confirmé le transfert depuis le port.",action:"Tourlos → Alkistis Beach Hotel : 20 € pour deux."}
  ];
  d.operational.days.j10=[
    {id:"j10-airport-transfer-confirmed",level:"ok",title:"Transfert Alkistis → aéroport confirmé",text:"Vendredi 18 septembre : départ de l’Alkistis Beach Hotel à 10h00 pour Mykonos Airport. Prix confirmé : 40 € pour deux.",action:"Vol Transavia à 12h45 : marge confortable."}
  ];
})();

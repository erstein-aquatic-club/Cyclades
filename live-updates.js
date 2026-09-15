(function(){
  var d=window.CYCLADES_ENRICHMENT;
  if(!d||!d.operational||!d.operational.days)return;

  /* Replace the legacy J8 source before app.js parses trip-data.html. This removes
     the obsolete bus / boat-taxi itinerary from the actual day timeline. */
  var nativeFetch=window.fetch.bind(window);
  window.fetch=function(input,init){
    var url=typeof input==='string'?input:(input&&input.url)||'';
    return nativeFetch(input,init).then(function(response){
      if(!/trip-data\.html(?:\?|$)/.test(url))return response;
      return response.text().then(function(source){
        var j8='<details id="j8"><summary><div class="bdg e">J8</div><div><div class="sm-t">Tour de Paros en ATV 450L</div><div class="sm-d">mer. 16 sept · PAROS · ATV</div></div></summary><div class="body">'+
          '<div class="box bx-r"><b>À anticiper — ce soir</b>Préparer les bagages : jeudi, check-out à 08h00 et ferry Paros → Mykonos à 09h40.</div>'+
          '<div class="tl R"><div class="h">09h00</div><div><b>Prise du ATV 450L chez Loukis Rentals</b><br>Location confirmée jusqu’à 20h00. Vérifier les 2 casques, photographier le véhicule et la jauge, confirmer carburant et assistance.</div></div>'+
          '<div class="tl"><div class="h">~09h30</div><div><b>Départ de Parikia vers Lefkes</b><br>Traversée vers l’intérieur de l’île.</div></div>'+
          '<div class="tl D"><div class="h">~10h00</div><div><b>Lefkes</b><br>Balade dans le village, ruelles et église Agia Triada.</div></div>'+
          '<div class="tl"><div class="h">~11h15</div><div><b>Prodromos / Marpissa</b><br>Courte étape dans les villages avant de rejoindre la côte est.</div></div>'+
          '<div class="tl D"><div class="h">~12h15</div><div><b>Piso Livadi</b><br>Port et déjeuner tranquille en bord de mer.</div></div>'+
          '<div class="tl D"><div class="h">~14h15</div><div><b>Golden Beach ou Kalogeros</b><br>Choisir selon le vent et l’envie de baignade.</div></div>'+
          '<div class="tl D"><div class="h">~16h15</div><div><b>Kolymbithres</b><br>Rejoindre directement la plage en ATV : aucun bateau-taxi nécessaire.</div></div>'+
          '<div class="tl"><div class="h">~18h30</div><div><b>Retour progressif vers Parikia</b><br>Garder de la marge pour la restitution et le coucher de soleil.</div></div>'+
          '<div class="tl R"><div class="h">avant 20h</div><div><b>Restitution chez Loukis</b><br>Rendre le 450L selon le niveau de carburant convenu.</div></div>'+
          '<div class="box bx-b"><b>Boucle conseillée</b>Parikia → Lefkes → Prodromos / Marpissa → Piso Livadi → Golden Beach ou Kalogeros → Kolymbithres → Parikia. Naoussa n’est pas prioritaire : vous l’avez déjà au programme du J7.</div>'+
          '<div class="box bx-a"><b>Conduite</b>Casques conducteur et passager. Rester sur les routes autorisées par Loukis et éviter plages, pistes et hors-piste si le contrat les exclut. Eau, lunettes, crème solaire et coupe-vent léger.</div>'+
          '<div class="trip"><div class="n">ATV · Loukis Rentals · 450L</div><div class="r"><div class="k">Horaire</div><div class="v">09h00 → 20h00</div></div><div class="r"><div class="k">Boucle</div><div class="v">Intérieur de Paros + côte est + Kolymbithres</div></div><div class="r"><div class="k">Retour</div><div class="v">Chez Loukis avant 20h00</div></div></div>'+
          '<div class="cash"><div><div class="l">Espèces conseillées J8</div></div><div class="v">20–40 €</div></div>'+
          '<div style="font-size:.82rem;color:var(--mut);margin-top:10px">Nuit 8 – Casa Di Roma, Parikia</div></div></details>';
        source=source.replace(/<details id="j8">[\s\S]*?<\/details>/,j8);
        return new Response(source,{status:response.status,statusText:response.statusText,headers:response.headers});
      });
    });
  };

  d.operational.days.j3=[
    {id:"j3-walk-old-port",level:"ok",title:"Vieux-Port : descente à pied faisable",text:"Caldera's Boats annonce environ 30 min à pied depuis Fira jusqu’au Vieux-Port. Pour être au bureau Santo Star avant 13h45, pars vers 12h55–13h00 et vise une arrivée vers 13h30.",action:"Le départ des marches se trouve dans le secteur du téléphérique de Fira. Ouvre ce point dans Google Maps puis suis les marches vers le Old Port.",actionLabel:"Google Maps · départ descente",actionUrl:"https://goo.gl/maps/XABQTg3W1A7iHj4dA"},
    {id:"j3-santo-star",level:"ok",title:"Rendez-vous Santo Star · Old Port",text:"Excursion à 14h30. Le prestataire demande d’être au Santo Star office au moins 45 min avant, donc au plus tard à 13h45.",action:"Une fois en bas, rejoins directement le bureau Santo Star au Vieux-Port.",actionLabel:"Google Maps · Santo Star",actionUrl:"https://goo.gl/maps/xTEogneGuvTH38776"},
    {id:"j3-cable-car",level:"info",title:"Téléphérique = plan B confortable",text:"Le téléphérique coûte 10 € par personne et par trajet et part environ toutes les 15 minutes.",action:"Bon compromis : descendre à pied à l’aller, puis remonter en téléphérique après l’excursion si vous êtes fatigués.",actionLabel:"Google Maps · téléphérique",actionUrl:"https://goo.gl/maps/XABQTg3W1A7iHj4dA"},
    {id:"j3-volcano-kit",level:"attention",title:"À prendre sur le bateau",text:"Chaussures confortables pour le volcan, chapeau, eau et maillot foncé pour les sources chaudes sulfureuses.",action:"De l’eau peut aussi être achetée à la cantine du bateau."}
  ];

  d.operational.days.j7=[
    {id:"j7-now",level:"ok",title:"Parikia à pied aujourd’hui · sans bus",text:"Panagia Ekatontapyliani est déjà visitée. Reste dans Parikia : vieille ville, Kastro / Frangokastello, ruelles autour d’Agios Konstantinos, front de mer puis ancien cimetière si tu veux prolonger la marche.",action:"Boucle simple : Manto Mavrogenous Square → Main Street → Kastro → Agios Konstantinos → front de mer → ancien cimetière → Livadia. Compter environ 2–3 h en flânant."},
    {id:"j7-museum",level:"attention",title:"Musée archéologique fermé aujourd’hui",text:"Le Musée archéologique de Paros est fermé le mardi. Il ouvre normalement mercredi de 08h30 à 15h30 ; avec le quad à 09h00 demain, ce n’est pas pratique sauf changement de programme.",action:"Aujourd’hui, privilégier les sites extérieurs et les ruelles du Kastro. Le musée byzantin/ecclésiastique dans le complexe d’Ekatontapyliani peut être une alternative si tu ne l’as pas déjà fait."},
    {id:"j7-lunch-mana",level:"ok",title:"Déjeuner maintenant · Mana Mana",text:"Option la plus simple et agréable à quelques minutes à pied : cour ombragée, cuisine méditerranéenne/grecque, salades et plats légers. Ouvert aujourd’hui dès le matin et toute la journée.",action:"Bon choix si tu veux déjeuner sans transformer le repas en grosse étape, puis repartir marcher dans la vieille ville."},
    {id:"j7-lunch-hellas",level:"info",title:"Alternative rapide · Hellas au port",text:"Pour quelque chose de plus simple et économique : gyros / grill grec au port, ouvert aujourd’hui. Très pratique avant de commencer la boucle à pied.",action:"À choisir surtout si tu veux manger vite et garder l’après-midi pour Parikia."},
    {id:"j7-lunch-late",level:"info",title:"Très bonne taverne, mais seulement à partir de 15h · To Bountaraki",text:"Taverne grecque en bord de mer, très bien évaluée, mais elle ouvre à 15h le mardi et ne prend pas les réservations.",action:"À garder pour un déjeuner très tardif / goûter salé si tu préfères attendre plutôt que manger maintenant."},
    {id:"j7-evening",level:"info",title:"Fin d’après-midi / soirée",text:"Après la marche, Livadia est accessible à pied pour une pause baignade. Pour le coucher du soleil, remonter vers Agios Konstantinos / Kastro donne une belle vue sur la baie avant le dîner.",action:"Pas besoin de bus pour remplir l’après-midi : tout ce programme se fait à pied depuis le centre de Parikia."}
  ];

  d.operational.days.j8=[
    {id:"j8-atv-booked",level:"ok",title:"ATV Loukis 450L réservé · 09h00 → 20h00",text:"Mercredi 16 septembre : ATV 450L réservé chez Loukis Rentals à Parikia pour toute la journée. La location est confirmée.",action:"Petit-déjeuner avant 08h30 puis prise en charge à 09h00. Vérifier les 2 casques, photographier le quad et la jauge, confirmer carburant et assistance."},
    {id:"j8-atv-route",level:"info",title:"Boucle ATV · intérieur + côte est + nord",text:"Parikia → Lefkes → Prodromos / Marpissa → Piso Livadi → Golden Beach ou Kalogeros → Kolymbithres → Parikia.",action:"Le déroulé principal de J8 a été remplacé : plus de bus ni de bateau-taxi. Kolymbithres est rejoint directement avec le 450L."},
    {id:"j8-ferry-next-day",level:"critical",title:"Restitution avant 20h00 · ferry jeudi matin",text:"Rendre le quad chez Loukis mercredi avant 20h00. Le ferry Paros → Mykonos part jeudi 17 à 09h40.",action:"Après restitution et dîner, préparer les bagages. Check-out Casa Di Roma à 08h00 jeudi."}
  ];

  d.operational.days.j9=[
    {id:"j9-transfer-confirmed",level:"ok",title:"Arrivée Mykonos : transfert confirmé",text:"Jeudi 17 septembre : SeaJets SUPERRUNNER JET, Paros 09h40 → Mykonos New Port (Tourlos) 10h25. Alkistis Beach Hotel a confirmé le transfert depuis le port.",action:"Tourlos → Alkistis Beach Hotel : 20 € pour deux."},
    {id:"j9-bus-after-hotel",level:"info",title:"Bus vers Chora après la dépose des bagages",text:"Le transfert d’arrivée remplace la marche avec les bagages depuis Tourlos. Le bus Agios Stefanos → Old Port reste utile ensuite pour rejoindre Chora."},
    {id:"j9-dinner",level:"attention",title:"Dernière soirée : choix du dîner à verrouiller",text:"Kastro’s ou M-Eating reste à décider.",action:"Réserver Kastro’s ou garder cocktail + M-Eating comme formule plus souple."}
  ];
  d.operational.days.j10=[
    {id:"j10-airport-transfer-confirmed",level:"ok",title:"Transfert Alkistis → aéroport confirmé",text:"Vendredi 18 septembre : départ de l’Alkistis Beach Hotel à 10h00 pour Mykonos Airport. Prix confirmé : 40 € pour deux.",action:"Vol Transavia à 12h45 : marge confortable."},
    {id:"j10-tgv-buffer",level:"critical",title:"Retour : marge avant le TGV",text:"Atterrissage prévu 15h20 et TGV Gare de l’Est 17h25.",action:"En cas de retard, vérifier immédiatement les trains suivants et les conditions d’échange dans SNCF Connect."}
  ];
})();

(function(){
  var d=window.CYCLADES_ENRICHMENT;
  if(!d||!d.operational||!d.operational.days)return;

  d.operational.days.j3=[
    {id:"j3-walk-old-port",level:"ok",title:"Vieux-Port : descente à pied faisable",text:"Caldera's Boats annonce environ 30 min à pied depuis Fira jusqu’au Vieux-Port. Pour être au bureau Santo Star avant 13h45, pars vers 12h55–13h00 et vise une arrivée vers 13h30.",action:"Le départ des marches se trouve dans le secteur du téléphérique de Fira. Ouvre ce point dans Google Maps puis suis les marches vers le Old Port.",actionLabel:"Google Maps · départ descente",actionUrl:"https://goo.gl/maps/XABQTg3W1A7iHj4dA"},
    {id:"j3-santo-star",level:"ok",title:"Rendez-vous Santo Star · Old Port",text:"Excursion à 14h30. Le prestataire demande d’être au Santo Star office au moins 45 min avant, donc au plus tard à 13h45.",action:"Une fois en bas, rejoins directement le bureau Santo Star au Vieux-Port.",actionLabel:"Google Maps · Santo Star",actionUrl:"https://goo.gl/maps/xTEogneGuvTH38776"},
    {id:"j3-cable-car",level:"info",title:"Téléphérique = plan B confortable",text:"Le téléphérique coûte 10 € par personne et par trajet et part environ toutes les 15 minutes.",action:"Bon compromis : descendre à pied à l’aller, puis remonter en téléphérique après l’excursion si vous êtes fatigués.",actionLabel:"Google Maps · téléphérique",actionUrl:"https://goo.gl/maps/XABQTg3W1A7iHj4dA"},
    {id:"j3-volcano-kit",level:"attention",title:"À prendre sur le bateau",text:"Chaussures confortables pour le volcan, chapeau, eau et maillot foncé pour les sources chaudes sulfureuses.",action:"De l’eau peut aussi être achetée à la cantine du bateau."}
  ];

  d.operational.days.j8=[
    {id:"j8-atv-plan",level:"ok",title:"J8 devient la journée ATV · tour de Paros",text:"Mercredi 16 septembre : remplacer le programme bus + bateau-taxi par une journée en quad. Viser un ATV 400–450 cc automatique, 2 places, autour de 50–60 € la journée. Réserver sur place à Parikia le mardi 15 après l’arrivée du ferry.",action:"09h00 petit-déjeuner · 09h30 prise du quad à Parikia · 10h00 Lefkes · 11h15 Prodromos / Marpissa · 12h15 Piso Livadi · 13h00 déjeuner · 14h15 Golden Beach ou Kalogeros · 16h15 Kolymbithres · 18h15 départ vers Parikia · restitution vers 18h45–19h00 · 19h15 Saint-Constantin pour le coucher du soleil · 20h30 dîner à Parikia."},
    {id:"j8-atv-route",level:"info",title:"Boucle conseillée · sans refaire Naoussa",text:"Parikia → Lefkes → Prodromos / Marpissa → Piso Livadi → Golden Beach ou Kalogeros → Kolymbithres → Parikia. Naoussa est volontairement évitée : vous y passez déjà toute la fin d’après-midi et la soirée du J7.",action:"La boucle permet de voir l’intérieur de l’île, la côte est et Kolymbithres dans la même journée, sans dépendre des bus."},
    {id:"j8-atv-rental",level:"attention",title:"Location ATV · à vérifier avant de payer",text:"Demander une location pour 1 journée uniquement. Pour deux personnes, privilégier 400–450 cc plutôt qu’un 200–300 cc. Vérifier prix final, 2 casques, assurance, caution, heure de restitution et politique carburant.",action:"Budget cible : 50–60 € de location + environ 10–15 € de carburant. Le carburant est généralement rendu au même niveau qu’au départ. Permis physique à emporter."},
    {id:"j8-atv-safety",level:"attention",title:"Conduite du quad",text:"Rester sur les routes autorisées par le contrat de location. Éviter plages, pistes et hors-piste si le loueur les exclut. Casque conducteur et passager. Le 450 cc est surtout utile pour tenir facilement le rythme à deux dans les côtes, pas pour rouler vite.",action:"Prévoir lunettes de soleil, eau, crème solaire et coupe-vent léger. Faire le plein avant la restitution si le contrat impose le plein-à-plein."},
    {id:"j8-ferry-next-day",level:"critical",title:"Retour impératif du quad mercredi soir",text:"Le ferry Paros → Mykonos part jeudi 17 à 09h40. Ne pas prévoir de restitution le jeudi matin.",action:"Préparer les bagages mercredi soir après le dîner ; check-out Casa Di Roma à 08h00 le lendemain."}
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

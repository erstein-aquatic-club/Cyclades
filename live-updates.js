(function(){
  var d=window.CYCLADES_ENRICHMENT;
  if(!d||!d.operational||!d.operational.days)return;

  d.operational.days.j3=[
    {id:"j3-walk-old-port",level:"ok",title:"Vieux-Port : descente à pied faisable",text:"Caldera's Boats annonce environ 30 min à pied depuis Fira jusqu’au Vieux-Port. Pour être au bureau Santo Star avant 13h45, pars vers 12h55–13h00 et vise une arrivée vers 13h30.",action:"Le départ des marches se trouve dans le secteur du téléphérique de Fira. Ouvre ce point dans Google Maps puis suis les marches vers le Old Port.",actionLabel:"Google Maps · départ descente",actionUrl:"https://goo.gl/maps/XABQTg3W1A7iHj4dA"},
    {id:"j3-santo-star",level:"ok",title:"Rendez-vous Santo Star · Old Port",text:"Excursion à 14h30. Le prestataire demande d’être au Santo Star office au moins 45 min avant, donc au plus tard à 13h45.",action:"Une fois en bas, rejoins directement le bureau Santo Star au Vieux-Port.",actionLabel:"Google Maps · Santo Star",actionUrl:"https://goo.gl/maps/xTEogneGuvTH38776"},
    {id:"j3-cable-car",level:"info",title:"Téléphérique = plan B confortable",text:"Le téléphérique coûte 10 € par personne et par trajet et part environ toutes les 15 minutes.",action:"Bon compromis : descendre à pied à l’aller, puis remonter en téléphérique après l’excursion si vous êtes fatigués.",actionLabel:"Google Maps · téléphérique",actionUrl:"https://goo.gl/maps/XABQTg3W1A7iHj4dA"},
    {id:"j3-volcano-kit",level:"attention",title:"À prendre sur le bateau",text:"Chaussures confortables pour le volcan, chapeau, eau et maillot foncé pour les sources chaudes sulfureuses.",action:"De l’eau peut aussi être achetée à la cantine du bateau."}
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

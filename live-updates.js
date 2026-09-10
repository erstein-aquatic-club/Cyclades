(function(){
  var d=window.CYCLADES_ENRICHMENT;
  if(!d||!d.operational||!d.operational.days)return;
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

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
    {id:"j8-atv-booked",level:"ok",title:"ATV Loukis réservé · 09h00 → 20h00",text:"Mercredi 16 septembre : quad réservé chez Loukis Rentals à Parikia pour toute la journée, de 09h00 à 20h00. La location est confirmée : inutile de chercher un autre loueur le matin.",action:"Petit-déjeuner avant 08h30 puis rejoindre Loukis pour la prise en charge à 09h00. Au départ : vérifier les 2 casques, photographier le quad et la jauge de carburant, confirmer assurance/caution et politique carburant."},
    {id:"j8-atv-route",level:"info",title:"Boucle ATV · intérieur + côte est + nord",text:"Parikia → Lefkes → Prodromos / Marpissa → Piso Livadi → Golden Beach ou Kalogeros → Kolymbithres → Parikia. Naoussa n’est pas prioritaire aujourd’hui puisque vous y passez déjà la fin d’après-midi et la soirée du J7.",action:"09h00 prise du quad · ~09h30 départ · ~10h00 Lefkes · ~11h15 Prodromos/Marpissa · ~12h15 Piso Livadi · déjeuner · ~14h15 plage côte est · ~16h15 Kolymbithres · retour progressif vers Parikia."},
    {id:"j8-atv-flex",level:"info",title:"Tu as le quad jusqu’à 20h00 · journée plus souple",text:"La restitution à 20h00 donne davantage de marge que le programme initial. Pas besoin de revenir à 18h45 si vous profitez d’une plage ou d’un village plus longtemps.",action:"Si vous voulez conserver le coucher de soleil à Saint-Constantin vers 19h30, revenez à Parikia vers 19h00, garez le quad puis restituez-le juste après. Sinon, profitez de la boucle jusqu’à ~19h15 et rendez directement le quad avant 20h00."},
    {id:"j8-atv-rental",level:"attention",title:"Loukis · avant de partir",text:"Le site Loukis propose notamment des ATV 450 cc automatiques 2 places et indique un second conducteur sans supplément. Le modèle exact réservé n’est pas enregistré dans l’app : vérifier la cylindrée à la remise des clés.",action:"Permis physique à emporter. Confirmer le niveau de carburant attendu au retour et le numéro d’assistance. Garder le contrat sur soi."},
    {id:"j8-atv-safety",level:"attention",title:"Conduite du quad",text:"Rester sur les routes autorisées par le contrat de location. Casque conducteur et passager. Adapter la vitesse aux routes étroites, au vent et aux virages ; l’intérêt d’un 450 cc est surtout le couple et le confort à deux.",action:"Prévoir lunettes de soleil, eau, crème solaire et coupe-vent léger. Éviter plages, pistes et hors-piste si le contrat les exclut."},
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

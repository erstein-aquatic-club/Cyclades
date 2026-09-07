/* Curated UI enrichment. Raw trip data remains in trip-data.html. */
window.CYCLADES_ENRICHMENT = {
  souvenirs: {
    title:"Souvenirs & cadeaux",
    intro:"Une petite liste à garder en tête pendant les balades, sans transformer le voyage en chasse aux achats.",
    items:[
      { id:"vide-poches", label:"Vide-poches", note:"Chercher une pièce artisanale en céramique, idéalement sobre et typiquement cycladique." }
    ]
  },
  packing: {
    people: 2,
    laundry: {
      day:"J5 · dimanche 13 septembre",
      place:"Mare Naxia",
      deposit:"Le matin avant la plage",
      return:"Lundi 14 septembre",
      strategy:"Laver les vêtements portés J1→J4. Les vêtements gardés propres couvrent J5 et J6 jusqu’au retour du linge."
    },
    summary: {
      outfitMoments:17,
      doubleOutfitDays:[2,3,4,5,7,8,9],
      note:"7 journées demandent un vrai changement de tenue entre activité / plage et soirée. La capsule soirée est réutilisée, pas dupliquée 7 fois."
    },
    wardrobe: [
      { id:"day-tops", label:"Hauts de journée", count:5, unit:"pièces", group:"Vêtements", essential:true, note:"Dont 2 respirants / séchage rapide pour J2 randonnée et J3 volcan. Les 5 couvrent J1→J5 puis repassent à la lessive." },
      { id:"day-bottoms", label:"Bas de journée", count:3, unit:"pièces", group:"Vêtements", essential:true, note:"1 pantalon léger/trek + 2 shorts, jupes ou bas légers. Le pantalon peut être porté dans l’avion." },
      { id:"evening-tops", label:"Hauts un peu habillés", count:2, unit:"pièces", group:"Soirées", essential:true, note:"À alterner pour Strogili, Sigi Ikthios et Mykonos. Suffisant avec la lessive." },
      { id:"evening-bottom", label:"Bas habillé polyvalent", count:1, unit:"pièce", group:"Soirées", essential:true, note:"Ou remplace ce duo par 2 robes/combinaisons légères si c’est plus naturel pour toi." },
      { id:"underwear", label:"Sous-vêtements", count:7, unit:"paires", group:"Vêtements", essential:true, note:"5 jours + 1 jour de retour de lessive + 1 marge. Le but est de ne jamais dépendre d’un retour de linge à l’heure près." },
      { id:"socks", label:"Paires de chaussettes", count:5, unit:"paires", group:"Vêtements", essential:true, note:"Dont 3 adaptées à la marche. Peu utiles les jours plage/sandales, donc 5 suffisent avec la lessive." },
      { id:"swimwear", label:"Maillots de bain", count:2, unit:"pièces", group:"Mer", essential:true, note:"1 foncé dédié aux sources sulfureuses de Palea Kameni + 1 normal pour les plages." },
      { id:"sleepwear", label:"Tenue de nuit", count:1, unit:"tenue", group:"Vêtements", essential:true, note:"Légère et lavable rapidement si nécessaire." },
      { id:"light-layer", label:"Surchemise / gilet léger", count:1, unit:"pièce", group:"Couches", essential:true, note:"Pour les terrasses, ferries climatisés et soirées venteuses." },
      { id:"windbreaker", label:"Coupe-vent fin", count:1, unit:"pièce", group:"Couches", essential:true, note:"À porter sur soi dans l’avion. Très utile sur les ferries et les points de vue au coucher du soleil." },
      { id:"walking-shoes", label:"Chaussures de marche solides", count:1, unit:"paire", group:"Chaussures", essential:true, note:"À porter dans l’avion. Pour Fira→Oia, Nea Kameni et les villages." },
      { id:"sandals", label:"Sandales / chaussures légères propres", count:1, unit:"paire", group:"Chaussures", essential:true, note:"Plage + soirées. Choisir une paire assez propre pour les restaurants afin d’éviter une troisième paire." }
    ],
    dayPlan: [
      { day:1, outfits:1, label:"Voyage + dîner", wear:["pantalon léger","haut confortable","couche légère"], note:"Même tenue pour le dîner si elle reste propre." },
      { day:2, outfits:2, label:"Randonnée + Strogili", wear:["haut technique","bas marche","chaussettes marche","tenue soirée"], note:"Vrai changement nécessaire après 10 km de marche." },
      { day:3, outfits:2, label:"Akrotiri + volcan + dîner", wear:["haut technique","bas marche","maillot foncé","tenue propre soir"], note:"Le soufre justifie un maillot dédié et un changement complet après la douche." },
      { day:4, outfits:2, label:"Ferry + plage + dîner", wear:["tenue voyage","maillot","haut propre soir"], note:"La tenue du soir peut être simple, pas forcément habillée." },
      { day:5, outfits:2, label:"Plages + soirée Naxos", wear:["maillot normal","tenue plage","haut propre soir"], note:"Déposer la lessive le matin avant de partir." },
      { day:6, outfits:1, label:"Villages de montagne", wear:["haut journée","bas marche","couche légère"], note:"Pas besoin de tenue séparée si dîner tranquille." },
      { day:7, outfits:2, label:"Ferry/Parikia + Sigi Ikthios", wear:["tenue voyage","tenue soirée"], note:"Deuxième utilisation de la capsule habillée." },
      { day:8, outfits:2, label:"Kolymbithres + dîner", wear:["maillot","tenue plage","haut propre soir"], note:"Prévoir quelque chose de sec pour le coucher du soleil." },
      { day:9, outfits:2, label:"Mykonos journée + dernière soirée", wear:["tenue journée","maillot","tenue soirée"], note:"Troisième utilisation de la capsule habillée." },
      { day:10, outfits:1, label:"Retour avion + TGV", wear:["pantalon léger","haut confortable","couche légère"], note:"Choisir une tenue propre et confortable la veille." }
    ],
    extras: [
      { id:"daypack", label:"Petit sac à dos 15–20 L", count:1, per:"person", group:"Activités", priority:"high", note:"Plus utile qu’un simple sac de plage pour J2/J3 : eau, coupe-vent, serviette, snacks et batterie." },
      { id:"microfiber-towel", label:"Serviette microfibre foncée", count:1, per:"person", group:"Mer", priority:"high", note:"Demandée pour l’excursion volcan ; séchage rapide et peu de volume." },
      { id:"wet-bag", label:"Pochette étanche / sac pour linge mouillé", count:1, per:"person", group:"Mer", priority:"high", note:"Très pratique après Palea Kameni et les plages pour isoler maillot/serviette humide." },
      { id:"phone-pouch", label:"Pochette téléphone étanche", count:1, per:"couple", group:"Mer", priority:"medium", note:"Excursion bateau, bateau-taxi et plages. Évite de manipuler le téléphone nu près de l’eau." },
      { id:"repellent", label:"Répulsif anti-moustiques", count:1, per:"couple", group:"Santé", priority:"medium", note:"Petit format ; utile surtout le soir et dans les zones moins ventées." },
      { id:"health-kit", label:"Mini trousse santé habituelle", count:1, per:"couple", group:"Santé", priority:"high", note:"Antalgiques habituels, pansements, anti-ampoules, désinfectant, traitements personnels et quelques sachets de réhydratation." },
      { id:"laundry-sheets", label:"2 feuilles de lessive / dose solide", count:2, per:"couple", group:"Lessive", priority:"medium", note:"Évite d’acheter un flacon et ne compte pas dans les liquides cabine." },
      { id:"laundry-bag", label:"Sac léger pour linge sale", count:1, per:"couple", group:"Lessive", priority:"medium", note:"Permet de déposer la lessive du J5 en quelques secondes." },
      { id:"charger", label:"Chargeur USB multiport + câbles courts", count:1, per:"couple", group:"Tech", priority:"high", note:"Un seul chargeur secteur suffit pour deux téléphones + montre/batterie." },
      { id:"powerbank", label:"Batterie externe", count:1, per:"couple", group:"Tech", priority:"high", note:"À garder en cabine ; utile pour cartes, billets et journées longues." },
      { id:"id-card", label:"Carte d’identité", count:1, per:"person", group:"Documents", priority:"high", note:"Une par personne, dans la pochette documents mais accessible aux contrôles." },
      { id:"ehic", label:"Carte européenne d’assurance maladie", count:1, per:"person", group:"Documents", priority:"high", note:"Une par personne ; la version numérique peut compléter la carte physique." },
      { id:"offline-tickets", label:"Billets hors ligne sur les 2 téléphones", count:1, per:"couple", group:"Documents", priority:"high", note:"Transavia, SNCF, trois ferries SeaJets et excursion volcan. Duplique les PDF sur les deux téléphones." },
      { id:"bank-cards", label:"Cartes bancaires séparées", count:2, per:"couple", group:"Documents", priority:"high", note:"Une carte chacun ou deux cartes rangées séparément, pour éviter un point de panne unique." },
      { id:"earplugs", label:"Bouchons d’oreilles / masque de nuit", count:1, per:"person", group:"Confort", priority:"low", note:"Très peu volumineux et utiles si hôtel/port animé ou départ matinal." },
      { id:"zip-pouch", label:"Pochette zippée documents + cash", count:1, per:"couple", group:"Organisation", priority:"high", note:"Regroupe espèces, cartes d’identité et sauvegardes de billets sans chercher dans le sac." },
      { id:"hat", label:"Chapeau / casquette", count:1, per:"person", group:"Soleil", priority:"high", note:"Indispensable J2/J3 où l’ombre est rare." },
      { id:"sunglasses", label:"Lunettes de soleil", count:1, per:"person", group:"Soleil", priority:"high", note:"À garder accessible, pas au fond de la valise." },
      { id:"bottle", label:"Gourde 750 ml env.", count:1, per:"person", group:"Soleil", priority:"high", note:"À remplir après le contrôle aéroport et avant les randonnées." }
    ],
    buyLocally: [
      "Crème solaire si votre flacon cabine de 100 ml ne suffit pas",
      "Gel douche / shampoing grand format",
      "Eau et snacks pour la randonnée / bateau",
      "Produits de plage consommables"
    ],
    skip: [
      "Adaptateur secteur",
      "Troisième paire de chaussures",
      "Serviette de plage épaisse",
      "Tenue habillée différente pour chaque dîner",
      "Gros flacons de toilette",
      "Vêtements « au cas où » sans journée précise"
    ]
  },
  operational: {
    global: [
      {
        id:"flight-checkin",
        level:"info",
        title:"Cartes d’embarquement Transavia",
        text:"L’enregistrement en ligne ouvre 30 h avant le départ. Télécharge les cartes d’embarquement dans le téléphone et garde-les aussi hors ligne.",
        actionLabel:"Transavia",
        actionUrl:"https://www.transavia.com/aide/fr-fr/preparation-et-enregistrement/s-enregistrer"
      },
      {
        id:"ferry-checkin",
        level:"attention",
        title:"Faire les check-ins SeaJets la veille",
        text:"Le web check-in SeaJets est disponible de 48 h à 2 h avant le départ. Garde les trois boarding passes hors ligne et sois au quai au moins 30 min avant.",
        actionLabel:"Check-in SeaJets",
        actionUrl:"https://webcheckin.seajets.com/"
      },
      {
        id:"bus-recheck",
        level:"attention",
        title:"Les horaires de bus restent dynamiques",
        text:"À Santorin, Naxos et Paros, revalide les horaires la veille au soir. L’app signale ci-dessous les horaires du carnet qui divergent déjà des publications 2026.",
        actionLabel:"Voir les liens transport",
        target:"info"
      }
    ],
    days: {
      j1: [
        {
          id:"j1-orly-margin",
          level:"attention",
          title:"Orly : marge plus courte que la recommandation Transavia",
          text:"Le carnet prévoit une arrivée à Orly vers 12h20 pour un vol à 14h15, soit 1h55. Transavia recommande actuellement 2h30 d’avance. Avec seulement des bagages cabine, ça peut passer, mais pour voyager sans stress vise plutôt Orly vers 11h45–11h50.",
          action:"Quitter Gare de l’Est vers 11h00 plutôt que 11h30 si possible.",
          sourceLabel:"Recommandation Transavia",
          sourceUrl:"https://www.transavia.com/aide/fr-fr/preparation-et-enregistrement/aeroport/arriver-aeroport"
        }
      ],
      j2: [
        {
          id:"j2-oia-bus",
          level:"attention",
          title:"Retour Oia → Fira : l’horaire du carnet a changé",
          text:"Le 21h00 indiqué dans le carnet n’apparaît pas dans l’horaire 2026 publié. Les derniers départs affichés sont 20h20 puis 21h40.",
          action:"Après Strogili, vise le bus de 21h40 et sois à l’arrêt 10–15 min avant.",
          sourceLabel:"Horaires Santorin 2026",
          sourceUrl:"https://santorinibus.com/"
        }
      ],
      j3: [
        {
          id:"j3-akrotiri-price",
          level:"attention",
          title:"Akrotiri : le tarif brut de 12 € est ancien",
          text:"Le Ministère grec affiche actuellement 20 € l’entrée adulte pour le site archéologique d’Akrotiri. Pour deux personnes, compte 16 € de plus que dans le carnet.",
          action:"Prévois 40 € pour les deux entrées ou prends les billets officiels en ligne. Le téléphérique (10 € / trajet) et Nea Kameni (5 € / pers.) restent cohérents.",
          sourceLabel:"Ministère grec de la Culture",
          sourceUrl:"https://odysseus.culture.gr/h/3/eh355.jsp?obj_id=2410"
        },
        {
          id:"j3-akrotiri-return",
          level:"critical",
          title:"Akrotiri → Fira : le retour publié est à 12h20, pas 12h00",
          text:"Le carnet enchaîne Red Beach, un bus à 12h00, déjeuner, téléphérique et rendez-vous au vieux port à 13h45. L’horaire 2026 publié donne 12h20 pour Akrotiri → Fira : la marge devient faible.",
          action:"À 11h45, commence le retour. Si le bus prend du retard ou si la file est forte, prends un taxi et sacrifie Red Beach ou le déjeuner plutôt que l’excursion réservée.",
          sourceLabel:"Horaires Santorin 2026",
          sourceUrl:"https://santorinibus.com/"
        },
        {
          id:"j3-cable-car",
          level:"attention",
          title:"Le téléphérique est le deuxième point de friction",
          text:"Le rendez-vous Santo Star est fixe à 13h45. Le trajet Fira → vieux port est court, mais une file au téléphérique suffit à consommer la marge.",
          action:"Dès le retour à Fira, privilégie un déjeuner à emporter et descends sans traîner."
        }
      ],
      j4: [
        {
          id:"j4-athinios-taxi",
          level:"critical",
          title:"Taxi vers Athinios : à considérer comme obligatoire",
          text:"Le carnet prévoit un ferry à 09h50 et mentionne le bus comme repli. Or l’horaire 2026 publié pour Fira → port commence à 11h30 : ce plan B ne permet pas d’attraper le ferry.",
          action:"Fais réserver le taxi/transfert la veille pour 08h10–08h15 et règle l’hôtel la veille si possible. Prévois un second numéro de taxi/transfert comme plan B.",
          sourceLabel:"Fira → Port 2026",
          sourceUrl:"https://santorinibus.com/"
        }
      ],
      j5: [
        {
          id:"j5-naxos-bus",
          level:"info",
          title:"Journée plage : garde-la flexible",
          text:"Les données publiques 2026 ne sont pas parfaitement cohérentes entre elles pour les départs du dimanche. Ce n’est pas bloquant : les plages sont très bien desservies, mais ne construis pas la journée autour d’un unique bus à 10h00.",
          action:"Regarde l’horaire affiché au KTEL le matin et pars sur le prochain bus pour Agios Prokopios / Plaka.",
          sourceLabel:"Bus Naxos",
          sourceUrl:"https://greekislandbuses.com/routes/naxos/naxos-town-plaka"
        }
      ],
      j6: [
        {
          id:"j6-mountain-bus",
          level:"critical",
          title:"Villages de montagne : le 09h00 du carnet ne colle pas aux horaires 2026",
          text:"Les horaires 2026 publiés placent le départ de semaine Naxos → Halki / Filoti / Apeiranthos à 09h30, pas 09h00. Toute la journée dépend ensuite des correspondances entre villages.",
          action:"La veille, reconstruis simplement la journée autour du 09h30 et du dernier retour disponible. Si tu veux zéro contrainte, taxi/voiture pour cette seule journée est l’option la plus fluide.",
          sourceLabel:"Horaires Naxos 2026",
          sourceUrl:"https://greekislandbuses.com/routes/naxos/naxos-town-apeiranthos"
        },
        {
          id:"j6-zeus-choice",
          level:"attention",
          title:"Ne mélange pas Mont Zeus et les trois villages",
          text:"Le carnet le dit déjà : la randonnée Zeus prend 3–4 h. Avec des bus contraints, tenter Zeus + Halki + Filoti + Apeiranthos transforme la journée en course.",
          action:"Choisis dès le matin : villages tranquilles OU randonnée Zeus."
        }
      ],
      j7: [
        {
          id:"j7-paros-timetable",
          level:"attention",
          title:"Paros : l’horaire officiel publié s’arrête actuellement au 10 septembre",
          text:"Ta journée est le 15 septembre. Les 16h30 et 22h30 du carnet sont plausibles, mais ils doivent être revalidés dès que le nouveau tableau KTEL est publié.",
          action:"Le 14 au soir, vérifie Parikia → Naoussa et surtout le dernier retour.",
          sourceLabel:"KTEL Paros",
          sourceUrl:"https://ktelparou.gr/en/bus-schedules.html"
        },
        {
          id:"j7-sigi",
          level:"attention",
          title:"Sigi Ikthios doit être confirmé",
          text:"Dans les données brutes, la réservation est encore indiquée comme demande envoyée, pas confirmée.",
          action:"Si tu n’as pas reçu de confirmation, appelle avant le départ ou bascule vers Marmitta / Safran."
        }
      ],
      j8: [
        {
          id:"j8-kolymbithres",
          level:"info",
          title:"Bateau-taxi : prévoir le plan B avant de partir",
          text:"Le bateau-taxi est simple mais dépend du service du jour et de la mer. Le réseau KTEL dessert aussi Kolymbithres sur les grilles publiées.",
          action:"À Naoussa, vérifie le bateau-taxi ; s’il ne tourne pas, prends le bus/taxi sans attendre.",
          sourceLabel:"KTEL Paros",
          sourceUrl:"https://ktelparou.gr/en/bus-schedules.html"
        }
      ],
      j9: [
        {
          id:"j9-bus-verified",
          level:"ok",
          title:"Mykonos : cet enchaînement est cohérent",
          text:"L’horaire 2026 publié confirme Agios Stefanos → Old Port à 11h10 et les retours Old Port → Agios Stefanos à l’heure pile jusqu’à 00h00.",
          action:"Garde simplement en tête : Old Port pour l’hôtel, Fabrika pour l’aéroport.",
          sourceLabel:"Mykonos Bus 2026",
          sourceUrl:"https://mykonosbus.com/bus-timetables/"
        },
        {
          id:"j9-dinner",
          level:"attention",
          title:"Dernière soirée : choix du dîner à verrouiller",
          text:"Les données brutes indiquent toujours Kastro’s ou M-Eating sans réservation finalisée.",
          action:"Décide avant le départ : réserver Kastro’s, ou garder cocktail + M-Eating comme formule plus souple."
        }
      ],
      j10: [
        {
          id:"j10-tgv-buffer",
          level:"critical",
          title:"Retour : 50 min de marge nominale avant le TGV",
          text:"Le plan suppose atterrissage 15h20, sortie 15h45, Gare de l’Est 16h35 et TGV 17h25. Une petite dérive du vol ou du métro peut consommer rapidement cette marge.",
          action:"Dès qu’un retard de vol apparaît, ouvre SNCF Connect et regarde les trains suivants / conditions d’échange au lieu d’attendre d’être à Paris."
        },
        {
          id:"j10-airport",
          level:"ok",
          title:"Mykonos JMK : marge confortable",
          text:"Départ hôtel 09h30 et vol 12h45 donnent plus de 2h30 à l’aéroport, ce qui est cohérent avec la recommandation Transavia.",
          sourceLabel:"Recommandation Transavia",
          sourceUrl:"https://www.transavia.com/aide/fr-fr/preparation-et-enregistrement/aeroport/arriver-aeroport"
        }
      ]
    }
  },
  resources: {
    sncf: { label: "SNCF Connect", url: "https://www.sncf-connect.com/" },
    transavia: { label: "Transavia", url: "https://www.transavia.com/" },
    ferryhopper: { label: "Ferryhopper", url: "https://www.ferryhopper.com/" },
    santoriniBus: { label: "KTEL Santorin", url: "https://santorinibus.com/" },
    naxosBus: { label: "Bus Naxos", url: "https://greekislandbuses.com/islands/naxos/buses" },
    parosBus: { label: "KTEL Paros", url: "https://ktelparou.gr/en/bus-schedules.html" },
    mykonosBus: { label: "Bus Mykonos", url: "https://greekislandbuses.com/islands/mykonos/buses?lang=fr" },
    kastros: { label: "Kastro's Mykonos", url: "https://www.kastrosmykonos.com/contact/" }
  },

  places: {
    strasbourgStation: {
      name: "Gare de Strasbourg", lat: 48.5851, lng: 7.7346, type: "transport",
      blurb: "Point de départ et d’arrivée du circuit."
    },
    gareEst: {
      name: "Paris Gare de l’Est", lat: 48.8763, lng: 2.3583, type: "transport",
      blurb: "Correspondance TGV ↔ métro vers Orly."
    },
    orly: {
      name: "Paris-Orly", lat: 48.7262, lng: 2.3652, type: "transport",
      blurb: "Terminal 3 pour les vols Transavia du voyage."
    },
    santoriniAirport: {
      name: "Aéroport de Santorin (JTR)", lat: 36.3992, lng: 25.4793, type: "transport",
      blurb: "Arrivée sur Santorin. Bus et taxis vers Fira."
    },
    hotelSantorini: {
      name: "Hotel Santorini", lat: 36.4167, lng: 25.4333, type: "hotel",
      blurb: "Hôtel au cœur de Fira, base des trois premières nuits.",
      phone: "tel:+302286024305",
      site: "https://hotel-santorini.gr/",
      siteLabel: "Site officiel"
    },
    fira: {
      name: "Fira", lat: 36.4167, lng: 25.4333, type: "town",
      blurb: "Base des trois premières nuits, station de bus principale et accès à la caldeira.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Santorini_caldera_panorama.jpg?width=900",
      imageSource: "https://commons.wikimedia.org/wiki/File:Santorini_caldera_panorama.jpg",
      imageCredit: "Wikimedia Commons · Dimitri Raftopoulos · domaine public"
    },
    firostefani: {
      name: "Firostefani", lat: 36.4237, lng: 25.4288, type: "view",
      blurb: "Premier grand balcon sur la caldeira pendant la randonnée Fira → Oia."
    },
    imerovigli: {
      name: "Imerovigli", lat: 36.4310, lng: 25.4213, type: "view",
      blurb: "Le « balcon de Santorin », très beau point de respiration sur le sentier."
    },
    skaros: {
      name: "Rocher de Skaros", lat: 36.4329, lng: 25.4183, type: "view",
      blurb: "Détour facultatif depuis Imerovigli, environ 40 min aller-retour."
    },
    oia: {
      name: "Oia", lat: 36.4618, lng: 25.3753, type: "view",
      blurb: "Ruelles blanches, dômes bleus et coucher de soleil sur la caldeira.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Oia_Santorini_Blue_Domes.jpg?width=900",
      imageSource: "https://commons.wikimedia.org/wiki/File:Oia_Santorini_Blue_Domes.jpg",
      imageCredit: "Wikimedia Commons · Danbu14 · CC BY-SA",
      actions: [
        { label:"Appeler Strogili", href:"tel:+302286072367" }
      ]
    },
    ammoudi: {
      name: "Baie d’Ammoudi", lat: 36.4614, lng: 25.3695, type: "food",
      blurb: "Petit port sous Oia, accessible par environ 300 marches."
    },
    akrotiri: {
      name: "Site archéologique d’Akrotiri", lat: 36.3514, lng: 25.4039, type: "culture",
      blurb: "Ville de l’âge du bronze conservée sous les dépôts volcaniques.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Akrotiri_Archaeological_Site_in_Santorini_by_Joy_of_Museums.jpg?width=900",
      imageSource: "https://commons.wikimedia.org/wiki/File:Akrotiri_Archaeological_Site_in_Santorini_by_Joy_of_Museums.jpg",
      imageCredit: "Wikimedia Commons · Joyofmuseums · CC"
    },
    redBeach: {
      name: "Red Beach", lat: 36.3480, lng: 25.3948, type: "view",
      blurb: "Falaises rouges volcaniques. Le programme prévoit surtout la vue depuis les hauteurs."
    },
    firaOldPort: {
      name: "Vieux port de Fira", lat: 36.4155, lng: 25.4284, type: "transport",
      blurb: "Départ des excursions dans la caldeira. Accès par téléphérique ou marches."
    },
    neaKameni: {
      name: "Nea Kameni", lat: 36.4039, lng: 25.3977, type: "nature",
      blurb: "Îlot volcanique et montée au cratère sur terrain de lave.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Caldera_of_Santorini_-_Nea_Kameni_-_Fira_-_Greece.jpg?width=900",
      imageSource: "https://commons.wikimedia.org/wiki/File:Caldera_of_Santorini_-_Nea_Kameni_-_Fira_-_Greece.jpg",
      imageCredit: "Wikimedia Commons · Norbert Nagel · CC",
      actions: [
        { label:"Caldera's Boats", href:"tel:+306948684886" }
      ]
    },
    paleaKameni: {
      name: "Palea Kameni", lat: 36.3933, lng: 25.3811, type: "nature",
      blurb: "Baignade depuis le bateau vers les sources chaudes sulfureuses."
    },
    athinios: {
      name: "Port d’Athinios", lat: 36.3869, lng: 25.4282, type: "transport",
      blurb: "Port ferry principal de Santorin. La route d’accès peut être congestionnée."
    },
    naxosPort: {
      name: "Port de Naxos", lat: 37.1052, lng: 25.3721, type: "transport",
      blurb: "Arrivée directement à Chora, à pied de l’hôtel et de la Portara."
    },
    mareNaxia: {
      name: "Mare Naxia", lat: 37.1009, lng: 25.3773, type: "hotel",
      blurb: "Base à Naxos, près d’Agios Georgios et de Chora.",
      phone: "tel:+302285023350",
      site: "https://www.marenaxia.com/en/",
      siteLabel: "Site officiel"
    },
    naxosKastro: {
      name: "Kastro de Naxos", lat: 37.1065, lng: 25.3765, type: "culture",
      blurb: "Ruelles et fortifications vénitiennes au-dessus de Chora."
    },
    agiosGeorgios: {
      name: "Agios Georgios", lat: 37.0977, lng: 25.3760, type: "beach",
      blurb: "Plage urbaine très proche du Mare Naxia."
    },
    portara: {
      name: "Portara", lat: 37.1084, lng: 25.3716, type: "view",
      blurb: "La grande porte du temple d’Apollon, spot emblématique au coucher du soleil.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Portara_Naxos.jpg?width=900",
      imageSource: "https://commons.wikimedia.org/wiki/File:Portara_Naxos.jpg",
      imageCredit: "Wikimedia Commons · Herbert wie · CC BY-SA"
    },
    agiosProkopios: {
      name: "Agios Prokopios", lat: 37.0732, lng: 25.3515, type: "beach",
      blurb: "Plage de sable et premier arrêt du bus côtier."
    },
    agiaAnna: {
      name: "Agia Anna", lat: 37.0682, lng: 25.3555, type: "beach",
      blurb: "Petite station balnéaire entre Agios Prokopios et Plaka."
    },
    plaka: {
      name: "Plaka Beach", lat: 37.0553, lng: 25.3522, type: "beach",
      blurb: "Longue plage de sable, plus calme en allant vers le sud."
    },
    mikriVigla: {
      name: "Mikri Vigla", lat: 37.0278, lng: 25.3702, type: "beach",
      blurb: "Spot de kitesurf et option de prolongation de la journée plage."
    },
    halki: {
      name: "Halki", lat: 37.0647, lng: 25.4817, type: "town",
      blurb: "Village de montagne et distillerie de Kitron."
    },
    filoti: {
      name: "Filoti", lat: 37.0516, lng: 25.4973, type: "town",
      blurb: "Grand village au pied du mont Zeus, place ombragée et tavernes."
    },
    apeiranthos: {
      name: "Apeiranthos", lat: 37.0718, lng: 25.5208, type: "view",
      blurb: "Village de marbre, ruelles pavées et ambiance montagnarde."
    },
    parikiaPort: {
      name: "Port de Parikia", lat: 37.0850, lng: 25.1490, type: "transport",
      blurb: "Point d’arrivée et de départ ferry à Paros."
    },
    casaDiRoma: {
      name: "Casa Di Roma", lat: 37.0828, lng: 25.1498, type: "hotel",
      blurb: "Base à Parikia, à quelques minutes à pied du port.",
      phone: "tel:+302284025294",
      site: "https://www.casadiromaparos.gr/",
      siteLabel: "Site / réservation"
    },
    ekatontapyliani: {
      name: "Panagia Ekatontapyliani", lat: 37.0848, lng: 25.1505, type: "culture",
      blurb: "Grande église paléochrétienne au cœur de Parikia."
    },
    livadia: {
      name: "Livadia Beach", lat: 37.0917, lng: 25.1493, type: "beach",
      blurb: "Plage facilement accessible à pied depuis le centre de Parikia."
    },
    naoussa: {
      name: "Naoussa", lat: 37.1237, lng: 25.2398, type: "view",
      blurb: "Port vénitien, ruelles et restaurants autour du vieux bassin.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/GR-paros-naoussa-gasse-2.jpg?width=900",
      imageSource: "https://commons.wikimedia.org/wiki/File:GR-paros-naoussa-gasse-2.jpg",
      imageCredit: "Wikimedia Commons · CC",
      actions: [
        { label:"Appeler Sigi Ikthios", href:"tel:+302284052639" }
      ]
    },
    kolymbithres: {
      name: "Kolymbithres", lat: 37.1272, lng: 25.2131, type: "beach",
      blurb: "Criques turquoise et blocs de granit polis par l’érosion.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Paroskolimpithres.jpg?width=900",
      imageSource: "https://commons.wikimedia.org/wiki/File:Paroskolimpithres.jpg",
      imageCredit: "Wikimedia Commons · Demetria pl · CC BY-SA"
    },
    saintConstantine: {
      name: "Saint-Constantin, Parikia", lat: 37.0845, lng: 25.1459, type: "view",
      blurb: "Petit point haut au-dessus du port pour le coucher du soleil."
    },
    tourlos: {
      name: "Nouveau port de Mykonos (Tourlos)", lat: 37.4634, lng: 25.3274, type: "transport",
      blurb: "Terminal ferry principal de Mykonos."
    },
    alkistis: {
      name: "Alkistis Beach", lat: 37.4703, lng: 25.3183, type: "hotel",
      blurb: "Hôtel à Agios Stefanos, au nord de Chora, face à la mer Égée.",
      phone: "tel:+302289022333",
      site: "https://www.alkistismykonos.gr/en/",
      siteLabel: "Site officiel"
    },
    mykonosOldPort: {
      name: "Old Port / Chora", lat: 37.4503, lng: 25.3283, type: "transport",
      blurb: "Station nord utile pour Agios Stefanos. À ne pas confondre avec Fabrika."
    },
    paraportiani: {
      name: "Panagia Paraportiani", lat: 37.4464, lng: 25.3251, type: "culture",
      blurb: "Ensemble d’églises blanches emblématique de Chora.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Paraportiani_Mykonos.jpeg?width=900",
      imageSource: "https://commons.wikimedia.org/wiki/File:Paraportiani_Mykonos.jpeg",
      imageCredit: "Wikimedia Commons · apollovjmk · CC BY-SA"
    },
    littleVenice: {
      name: "Petite Venise", lat: 37.4457, lng: 25.3262, type: "view",
      blurb: "Façades au bord de l’eau, bars et coucher du soleil face aux moulins.",
      image: "https://commons.wikimedia.org/wiki/Special:FilePath/Little_Venice_-_Mykonos.jpg?width=900",
      imageSource: "https://commons.wikimedia.org/wiki/File:Little_Venice_-_Mykonos.jpg",
      imageCredit: "Wikimedia Commons · Zigomitros Athanasios · CC",
      actions: [
        { label:"Réserver Kastro's", href:"https://www.kastrosmykonos.com/contact/" },
        { label:"Appeler M-Eating", href:"tel:+302289078550" }
      ]
    },
    katoMili: {
      name: "Moulins de Kato Mili", lat: 37.4443, lng: 25.3252, type: "view",
      blurb: "Les moulins dominent Petite Venise et donnent une vue ouverte sur la mer."
    },
    mykonosAirport: {
      name: "Aéroport de Mykonos (JMK)", lat: 37.4351, lng: 25.3481, type: "transport",
      blurb: "Petit aéroport : garder de la marge aux heures de pointe."
    }
  },

  days: {
    j1: {
      points: [
        { id:"A", place:"strasbourgStation" }, { id:"B", place:"gareEst" },
        { id:"C", place:"orly" }, { id:"D", place:"santoriniAirport" }, { id:"E", place:"fira" }
      ],
      legs: [
        { from:"A", to:"B", title:"Strasbourg → Paris", transportIndexes:[0], resources:["sncf"] },
        { from:"B", to:"C", title:"Gare de l’Est → Orly", transportIndexes:[1] },
        { from:"C", to:"D", title:"Orly → Santorin", transportIndexes:[2], resources:["transavia"] },
        { from:"D", to:"E", title:"Aéroport → Fira", transportIndexes:[3,4], resources:["santoriniBus"] }
      ],
      featured:["fira"]
    },
    j2: {
      points: [
        { id:"A", place:"fira" }, { id:"B", place:"firostefani" }, { id:"C", place:"imerovigli" },
        { id:"D", place:"oia" }, { id:"E", place:"ammoudi" }
      ],
      legs: [
        { from:"A", to:"D", via:["B","C"], title:"Sentier de la caldeira", transportIndexes:[0] },
        { from:"D", to:"E", title:"Oia → Ammoudi", options:[{label:"À pied",detail:"~300 marches"},{label:"Taxi",detail:"option confortable"}] },
        { from:"E", to:"D", title:"Retour Ammoudi → Oia", transportIndexes:[1] },
        { from:"D", to:"A", title:"Oia → Fira", transportIndexes:[2], resources:["santoriniBus"] }
      ],
      featured:["oia","fira"]
    },
    j3: {
      points: [
        { id:"A", place:"fira" }, { id:"B", place:"akrotiri" }, { id:"C", place:"redBeach" },
        { id:"D", place:"firaOldPort" }, { id:"E", place:"neaKameni" }, { id:"F", place:"paleaKameni" }
      ],
      legs: [
        { from:"A", to:"B", title:"Fira → Akrotiri", transportIndexes:[0], resources:["santoriniBus"] },
        { from:"B", to:"C", title:"Akrotiri → Red Beach", options:[{label:"À pied",detail:"~15 min"}] },
        { from:"B", to:"A", title:"Akrotiri → Fira", transportIndexes:[1], resources:["santoriniBus"] },
        { from:"A", to:"D", title:"Fira → vieux port", transportIndexes:[2] },
        { from:"D", to:"D", via:["E","F"], title:"Volcan & sources chaudes", transportIndexes:[3,4] },
        { from:"D", to:"A", title:"Vieux port → Fira", transportIndexes:[5] }
      ],
      featured:["akrotiri","neaKameni"]
    },
    j4: {
      points: [
        { id:"A", place:"fira" }, { id:"B", place:"athinios" }, { id:"C", place:"naxosPort" },
        { id:"D", place:"mareNaxia" }, { id:"E", place:"naxosKastro" }, { id:"F", place:"agiosGeorgios" }, { id:"G", place:"portara" }
      ],
      legs: [
        { from:"A", to:"B", title:"Fira → Athinios", transportIndexes:[0,1], resources:["santoriniBus"] },
        { from:"B", to:"C", title:"Santorin → Naxos", transportIndexes:[2], resources:["ferryhopper"] },
        { from:"C", to:"D", title:"Port → hôtel", transportIndexes:[3] },
        { from:"D", to:"E", title:"Hôtel → Kastro", options:[{label:"À pied",detail:"balade dans Chora"}] },
        { from:"D", to:"F", title:"Hôtel → plage", options:[{label:"À pied",detail:"~2 min"}] },
        { from:"D", to:"G", title:"Hôtel → Portara", options:[{label:"À pied",detail:"traversée de Chora"}] }
      ],
      featured:["portara"]
    },
    j5: {
      points: [
        { id:"A", place:"mareNaxia" }, { id:"B", place:"agiosProkopios" }, { id:"C", place:"agiaAnna" },
        { id:"D", place:"plaka" }, { id:"E", place:"mikriVigla" }
      ],
      legs: [
        { from:"A", to:"B", title:"Chora → Agios Prokopios", transportIndexes:[0], resources:["naxosBus"] },
        { from:"B", to:"D", via:["C"], title:"Côte ouest", transportIndexes:[1] },
        { from:"D", to:"A", title:"Plaka → Chora", transportIndexes:[2], resources:["naxosBus"] },
        { from:"D", to:"E", title:"Option Mikri Vigla", options:[{label:"Bus / taxi",detail:"selon l’heure"},{label:"Bateau",detail:"si location sans permis"}] }
      ],
      featured:["agiosProkopios","plaka"]
    },
    j6: {
      points: [
        { id:"A", place:"mareNaxia" }, { id:"B", place:"halki" }, { id:"C", place:"filoti" }, { id:"D", place:"apeiranthos" }
      ],
      legs: [
        { from:"A", to:"B", title:"Chora → Halki", transportIndexes:[0], resources:["naxosBus"] },
        { from:"B", to:"C", title:"Halki → Filoti", transportIndexes:[1], resources:["naxosBus"] },
        { from:"C", to:"D", title:"Filoti → Apeiranthos", transportIndexes:[2], resources:["naxosBus"] },
        { from:"D", to:"A", title:"Apeiranthos → Chora", transportIndexes:[3], resources:["naxosBus"] }
      ],
      featured:["halki","apeiranthos"]
    },
    j7: {
      points: [
        { id:"A", place:"mareNaxia" }, { id:"B", place:"naxosPort" }, { id:"C", place:"parikiaPort" },
        { id:"D", place:"casaDiRoma" }, { id:"E", place:"ekatontapyliani" }, { id:"F", place:"naoussa" }
      ],
      legs: [
        { from:"A", to:"B", title:"Hôtel → port", transportIndexes:[0] },
        { from:"B", to:"C", title:"Naxos → Paros", transportIndexes:[1], resources:["ferryhopper"] },
        { from:"C", to:"D", title:"Port → Casa Di Roma", transportIndexes:[2] },
        { from:"D", to:"E", title:"Parikia à pied", options:[{label:"À pied",detail:"centre historique"}] },
        { from:"D", to:"F", title:"Parikia → Naoussa", transportIndexes:[3], resources:["parosBus"] },
        { from:"F", to:"D", title:"Naoussa → Parikia", transportIndexes:[4], resources:["parosBus"] }
      ],
      featured:["naoussa","ekatontapyliani"]
    },
    j8: {
      points: [
        { id:"A", place:"casaDiRoma" }, { id:"B", place:"naoussa" }, { id:"C", place:"kolymbithres" }, { id:"D", place:"saintConstantine" }
      ],
      legs: [
        { from:"A", to:"B", title:"Parikia → Naoussa", transportIndexes:[0], resources:["parosBus"] },
        { from:"B", to:"C", title:"Naoussa → Kolymbithres", transportIndexes:[1] },
        { from:"C", to:"B", title:"Kolymbithres → Naoussa", transportIndexes:[2] },
        { from:"B", to:"A", title:"Naoussa → Parikia", transportIndexes:[3], resources:["parosBus"] },
        { from:"A", to:"D", title:"Parikia → Saint-Constantin", options:[{label:"À pied",detail:"courte montée pour le coucher de soleil"}] }
      ],
      featured:["kolymbithres","naoussa"]
    },
    j9: {
      points: [
        { id:"A", place:"casaDiRoma" }, { id:"B", place:"parikiaPort" }, { id:"C", place:"tourlos" },
        { id:"D", place:"alkistis" }, { id:"E", place:"mykonosOldPort" }, { id:"F", place:"paraportiani" },
        { id:"G", place:"littleVenice" }, { id:"H", place:"katoMili" }
      ],
      legs: [
        { from:"A", to:"B", title:"Hôtel → port", transportIndexes:[0] },
        { from:"B", to:"C", title:"Paros → Mykonos", transportIndexes:[1], resources:["ferryhopper"] },
        { from:"C", to:"D", title:"Tourlos → Alkistis", transportIndexes:[2] },
        { from:"D", to:"E", title:"Agios Stefanos → Old Port", transportIndexes:[3], resources:["mykonosBus"] },
        { from:"E", to:"H", via:["F","G"], title:"Chora à pied", options:[{label:"À pied",detail:"Paraportiani → Petite Venise → moulins"}] },
        { from:"E", to:"D", title:"Old Port → Agios Stefanos", transportIndexes:[4], resources:["mykonosBus"] }
      ],
      featured:["littleVenice","paraportiani"]
    },
    j10: {
      points: [
        { id:"A", place:"alkistis" }, { id:"B", place:"mykonosAirport" }, { id:"C", place:"orly" },
        { id:"D", place:"gareEst" }, { id:"E", place:"strasbourgStation" }
      ],
      legs: [
        { from:"A", to:"B", title:"Alkistis → aéroport", transportIndexes:[0] },
        { from:"B", to:"C", title:"Mykonos → Orly", transportIndexes:[1], resources:["transavia"] },
        { from:"C", to:"D", title:"Orly → Gare de l’Est", transportIndexes:[2] },
        { from:"D", to:"E", title:"Paris → Strasbourg", transportIndexes:[3], resources:["sncf"] }
      ],
      featured:["littleVenice"]
    }
  }
};

/* Curated UI enrichment. Raw trip data remains in trip-data.html. */
window.CYCLADES_ENRICHMENT = {
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

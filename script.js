// Navigation
function allerAuxEmplois() {
    window.location.href = "emplois.html";
}
function allerPostuler() {
    window.location.href = "candidature.html";
}

// Recherche emploi
function rechercherEmploi() {
    let filtre = document.getElementById("recherche").value.toLowerCase();
    let emplois = document.querySelectorAll("#listeEmplois li");
    emplois.forEach(e => {
        e.style.display = e.textContent.toLowerCase().includes(filtre) ? "" : "none";
    });
    let formOffre = document.getElementById("form-offre");
let listeOffres = document.getElementById("liste-offres");

formOffre.addEventListener("submit", function(e) {
    e.preventDefault();

    // Récupérer les données du formulaire
    let titre = document.getElementById("titre-offre").value;
    let lien = document.getElementById("lien-offre").value;

    // Créer un élément pour l'offre
    let nouvelleOffre = document.createElement("li");
    let lienOffre = document.createElement("a");
    lienOffre.href = lien;
    lienOffre.textContent = titre;
    lienOffre.target = "_blank"; // ouvre le lien dans un nouvel onglet
    nouvelleOffre.appendChild(lienOffre);

    // Ajouter l'offre à la liste
    listeOffres.appendChild(nouvelleOffre);

    // Réinitialiser le formulaire
    formOffre.reset();
});

}

// Lire fichier en base64
function lireFichier(file) {
    return new Promise((resolve) => {
        let reader = new FileReader();
        reader.onload = () => resolve({
            nom: file.name,
            type: file.type,
            data: reader.result
        });
        reader.readAsDataURL(file);
    });
}
// Enregistrement candidature
async function enregistrerCandidat(event) {
    event.preventDefault();

    let nom = document.getElementById("nom");
    let email = document.getElementById("email");
    let poste = document.getElementById("poste");
    let cv = document.getElementById("cv");
    let lettreMotivation = document.getElementById("lettreMotivation");
    let titrescolaire = document.getElementById("titrescolaire");
    let candidat = {
        nom: nom.value,
        email: email.value,
        poste: poste.value,
        cv: await lireFichier(cv.files[0]),
        lettreMotivation: await lireFichier(lettreMotivation.files[0]),
        titrescolaire: await lireFichier(titrescolaire.files[0])
    };
    let candidats = JSON.parse(localStorage.getItem("candidats")) || [];
    candidats.push(candidat);
    localStorage.setItem("candidats", JSON.stringify(candidats));
    alert("Candidature enregistrée !");
    event.target.reset();
}
function afficherCandidats() {
    // Affichage des candidats
    let liste = document.getElementById("listeCandidats");
    let candidats = JSON.parse(localStorage.getItem("candidats")) || [];
    liste.innerHTML = "";

    candidats.forEach((c, index) => {
        let li = document.createElement("li");

        // On vérifie que chaque fichier existe avant de créer le lien
        let cvLink = c.cv ? `<a href="${c.cv.data}" download="${c.cv.nom}">Télécharger CV</a><br>` : '';
        let lettreLink = c.lettreMotivation ? `<a href="${c.lettreMotivation.data}" download="${c.lettreMotivation.nom}">Télécharger Lettre</a><br>` : '';
        let titreLink = c.titrescolaire ? `<a href="${c.titrescolaire.data}" download="${c.titrescolaire.nom}">Télécharger Titre</a><br>` : '';

        li.innerHTML = `
            <strong>${c.nom}</strong> – ${c.poste} <br>
            ${c.email}<br>
            ${cvLink}
            ${lettreLink}
            ${titreLink}
            <button onclick="supprimerCandidat(${index})">Supprimer</button>
            <hr>
        `;
        liste.appendChild(li);
    });
}


// Supprimer un candidat
function supprimerCandidat(index) {
    let candidats = JSON.parse(localStorage.getItem("candidats")) || [];
    if (confirm("Voulez-vous supprimer ce candidat ?")) {
        candidats.splice(index, 1);
        localStorage.setItem("candidats", JSON.stringify(candidats));
        afficherCandidats();
    }
}

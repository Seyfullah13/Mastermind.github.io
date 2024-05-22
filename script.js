document.addEventListener('DOMContentLoaded', function() {
  const submitButton = document.getElementById('submit-btn');
  const feedbackDiv = document.getElementById('feedback');
  const attemptCounter = document.getElementById('attempt-counter'); 
  let message = document.querySelector("#message");

  let attempts = 0; 
  const maxAttempts = 12; 

  const secretCode = generateSecretCode();
  
  submitButton.addEventListener('click', function() {
    if (attempts < maxAttempts) {
      attempts++;

      const selectedColors = [];
      for (const input of document.querySelectorAll('.color-selector')) {
        selectedColors.push(input.value.toLowerCase());
      }

      const feedback = checkGuess(selectedColors, secretCode);
      feedbackDiv.innerHTML = feedback;

      attemptCounter.textContent = `Tentative : ${attempts} sur ${maxAttempts}`;

      if (feedback.includes('Félicitations ! Vous avez gagné !') || attempts === maxAttempts) {
        reloadPage(); 
      }
    }
  });

  function generateSecretCode() {
    let code = "";
    const colors = ['rouge', 'jaune', 'vert', 'bleu'];
    for (let i = 0; i < 4; i++) {
      code += colors[Math.floor(Math.random() * colors.length)];
      // Ajoute un espace après chaque couleur, sauf pour la dernière
      if (i !== 3) {
        code += ' ';
      }
    }
    return code;
  }

  function checkGuess(guess, secret) {
    let correctPosition = 0;
    let correctColor = 0;
    let secretCount = {}; // Utiliser un objet pour stocker les occurrences de chaque couleur dans le code secret

    for (const color of secret.split(' ')) {
      secretCount[color] = (secretCount[color] || 0) + 1; // Incrémenter le compteur pour chaque couleur dans le code secret
    }

    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === secret.split(' ')[i]) {
        correctPosition++;
      } else if (secretCount[guess[i]] && secretCount[guess[i]] > 0) {
        correctColor++;
        secretCount[guess[i]]--; // Décrémenter le compteur pour cette couleur dans le code secret
      }
    }

    const feedbackMessage = generateFeedbackMessage(correctPosition, correctColor);

    if (correctPosition === 4) {
      return '<div class="alert alert-success" role="alert">Félicitations ! Vous avez gagné !</div>';
    } else if (attempts === maxAttempts) {
      return feedbackMessage + `<div class="alert alert-info" role="alert">La combinaison secrète était : ${secret}.</div>`;
    } else {
      return feedbackMessage;
    }
  }

  function generateFeedbackMessage(correctPosition, correctColor) {
    return `<div class="alert alert-info" role="alert">Nombre de pions bien placés : ${correctPosition}, Nombre de pions mal placés : ${correctColor}</div>`;
  }

  function reloadPage() {
    setTimeout(function() {
      location.reload();
    }, 3000); 
  }
});

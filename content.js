const keywords = ['durabilité', 'vert', 'écologique', 'bio', 'images']; // Ajoutez plus de mots-clés ici
const regex = new RegExp('(' + keywords.join('|') + ')', 'gi');

document.body.innerHTML = document.body.innerHTML.replace(regex, match => {
    console.log("J'AI TROUVE", match, regex);
  return `<span style="background-color: yellow;">${match}</span>`;
});

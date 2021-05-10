let bgMusic = new Audio("./sound/BackgroundMusic.mp4");
let imagens = [];
let playingMusic = false;
let classeAtual = "";
let imagemSelecionada = "";

const videoSources = {
  Guerreiro: "https://www.youtube.com/embed/nVReBH3QYD0",
  Bardo: "https://www.youtube.com/embed/qiHXxrCB5yk",
  Druida: "https://www.youtube.com/embed/WMo_gCRMSfA",
  Mago: "https://www.youtube.com/embed/U1Gs8WTddI4",
};

window.onload = function Carregar() {
  // Executa quando a pagina carregar
  let imagensTemp = document.getElementsByName("imgClasse");
  let radSexo = document.getElementsByName("Sexo");

  imagensTemp.forEach((imagem) => {
    imagem.addEventListener("click", selecionarClasse)
    imagens.push(imagem);
  });

  radSexo.forEach((rad) => {
    rad.addEventListener("click", MudarImagem);
  });

  let formulario = document.getElementById("formulario");
  formulario.addEventListener("submit", Confirmar);

  window.addEventListener("click", () =>
    // O audio nao pode ser iniciado junto com o navegador, entao
    {
      // quando o usario interagir com ele, a musica de fundo começará a tocar
      if(playingMusic) return
      console.log("Playing Music");
      playingMusic = true;
      bgMusic.loop = true;
      bgMusic.volume = 0.2;
      bgMusic.play();
    }
  );
};

async function Confirmar(event) {
  event.preventDefault();
  if (!classeAtual) {
    window.alert("Selecione uma classe");
    return
  }
  try {
    const form = new FormData(event.target)
    let body = {};
    form.forEach((value, key) =>{
      body[key] = value;
    })
    body.classe = classeAtual;
  
    console.log(body);
    let response = await fetch("/cadastrar", {
      method: "POST",
      headers: {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify(body)
    })
  
    let data = await response.json();
    console.log(data)
    /*if (response.status === 200) {
      alert("Cadastrado com Sucesso !")
    }*/
  } catch (error) {
    console.log(error)
  }
}


function MudarImagem({target:radio}) { 
  let sexo = radio.id === "radSex01" ? "01" : "02";
  for (let i = 0; i < imagens.length; i++) {
    const foto = imagens[i];

    let rawSrc = foto.src;
    rawSrc = rawSrc.split("_")[0]; //O split separa a string source em uma array, usando o "_" como separador
    // retornar a primeira parte da array

    let newSrc = `${rawSrc}_${sexo}.png`; //Concatena à primeira parte do sexo

    imagens[i].src = newSrc; //Atribui a imagem a nova source
  }
}

function MudarVideo() {
  let video = document.getElementById("video");
  video.src = videoSources[classeAtual];
}

function selecionarClasse({target:imagem}) {
  if (imagemSelecionada === imagem) {
    console.log("Imagem selecionada anteriormente é igual a selecionada atualmente")
    return
  }
  
  if(imagemSelecionada) {
    console.log("Trocar seleção");
    imagemSelecionada.classList.toggle("classe-ativada");
  }

  console.log(imagem)
  imagemSelecionada = imagem;
  imagem.classList.toggle("classe-ativada");
  classeAtual = imagem.title;
  MudarVideo();
}
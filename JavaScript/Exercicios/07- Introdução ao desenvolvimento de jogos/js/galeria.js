let totalDeArquivos = 0, arquivosCarregados = 0;

let Galeria = {
  // As imagens ficarão guardadas aqui
  imagens : {},
  audios : {},

  CarregarImagem : function (chaveDaImagem, source, callback, contexto){
    totalDeArquivos++;
    console.log(`Carregando: ${chaveDaImagem} (${arquivosCarregados} / ${totalDeArquivos})`)

    Galeria.imagens[chaveDaImagem] = new Image();
    Galeria.imagens[chaveDaImagem].addEventListener("load", function(){
      arquivosCarregados++;
      console.log(`Carregado: ${chaveDaImagem} (${arquivosCarregados} / ${totalDeArquivos})`)

      if(arquivosCarregados === totalDeArquivos){
        console.log("Pressione Enter para começar")
        callback.call(contexto)
      }
    })

    Galeria.imagens[chaveDaImagem].src = source;
  },

  CarregarAudio : function (chaveDaImagem, source, callback, contexto){
    totalDeArquivos++;
    Galeria.audios[chaveDaImagem] = new Audio();
    Galeria.audios[chaveDaImagem].addEventListener("canplay", function (){
      arquivosCarregados++;
      console.log(`Carregado: ${chaveDaImagem} (${arquivosCarregados} / ${totalDeArquivos})`)

      if(arquivosCarregados === totalDeArquivos){
        console.log("Pressione Enter para começar")
        callback.call(contexto)
      }
    })
    Galeria.audios[chaveDaImagem].src = source;
  }
}

export default Galeria;

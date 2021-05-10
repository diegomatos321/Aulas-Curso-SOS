gameLoop(tempoAtual){
  window.requestAnimationFrame(this.gameLoop);

  tempoAtual /= 1000;
  this.deltaTime = tempoAtual - tempoAnterior;
  this.tempoAnterior = tempoAtual;    

  this.update();
  this.draw();
}
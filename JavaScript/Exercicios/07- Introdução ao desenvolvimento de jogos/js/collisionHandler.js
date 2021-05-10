export default function CollisionHandler(entidade1, entidade2, callback, contexto){
    if (entidade1.posicao.x + entidade1.largura*entidade1.origin.x >= entidade2.posicao.x - entidade2.largura*entidade2.origin.x &&
        entidade1.posicao.x - entidade1.largura*entidade1.origin.x <= entidade2.posicao.x + entidade2.largura*entidade2.origin.x &&
        entidade1.posicao.y + entidade1.altura*entidade1.origin.y >= entidade2.posicao.y - entidade2.altura*entidade2.origin.y &&
        entidade1.posicao.y - entidade1.altura*entidade1.origin.y <= entidade2.posicao.y + entidade2.altura*entidade2.origin.y) {
        callback.call(contexto)
    }
}
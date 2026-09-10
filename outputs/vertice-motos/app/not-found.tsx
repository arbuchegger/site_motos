import { ArrowLeft } from 'lucide-react';
export default function NotFound() {
  return <main id="conteudo" className="container not-found"><p className="detail-category">Página não encontrada</p><h1>Vamos voltar<br />para o caminho?</h1><p>Essa página não existe. Conheça os modelos da nossa vitrine.</p><a className="button button-primary" href="/#motos"><ArrowLeft size={19} aria-hidden="true" />Ver todas as motos</a></main>;
}

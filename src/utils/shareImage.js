// Geração de imagem do resumo do treino para compartilhamento/download.
//
// Correção de bug: a implementação anterior fazia uma captura manual do DOM
// via <svg><foreignObject> + canvas, que sofre de problemas conhecidos:
//  1) Canvas "tainted" no Safari/iOS ao desenhar SVG com <foreignObject>,
//     mesmo com recursos same-origin (navigator.share/toBlob falha).
//  2) Perda do "user activation" do clique quando há `await` antes de
//     navigator.share() em navegadores mais estritos.
//  3) Fontes customizadas podem não estar carregadas no momento da captura.
//  4) getComputedStyle iterado manualmente não copia custom properties
//     (--tw-*) usadas por vários utilitários do Tailwind.
//
// Correção: usamos `html-to-image` (mantida ativamente) para a rasterização,
// e no componente que consome esta função (ActiveWorkout) a imagem é
// pré-gerada assim que o resumo é exibido, para que o clique no botão de
// compartilhar chame navigator.share() de forma síncrona.
import { toBlob } from 'html-to-image'

export async function elementToPng(element, scale = 2) {
  if (!element) throw new Error('Elemento não encontrado para exportação')

  // Evita exportar com fonte de fallback (FOUT) caso as fontes customizadas
  // ainda estejam carregando no momento da captura.
  if (document.fonts?.ready) {
    await document.fonts.ready
  }

  const blob = await toBlob(element, {
    pixelRatio: scale,
    cacheBust: true,
  })

  if (!blob) {
    throw new Error('Falha ao gerar a imagem do resumo do treino')
  }

  return blob
}

export function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

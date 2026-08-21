/**
 * Grava a marca d'água dentro do arquivo, antes do envio.
 *
 * Uma sobreposição em CSS é contornada abrindo a URL da foto direto, então não
 * protege nada: o que sai do Storage seria a imagem limpa. Queimando no
 * arquivo, qualquer cópia já sai marcada.
 *
 * O redimensionamento para no máximo 2400 px de largura tem efeito colateral
 * bem-vindo: foto de câmera costuma ter 6000 px e 12 MB, tamanho que ninguém
 * precisa numa página.
 */
const LARGURA_MAXIMA = 2400

export async function marcarDagua(arquivo: File, marca: string): Promise<File> {
  const bitmap = await createImageBitmap(arquivo)

  const escala = Math.min(1, LARGURA_MAXIMA / bitmap.width)
  const largura = Math.round(bitmap.width * escala)
  const altura = Math.round(bitmap.height * escala)

  const canvas = document.createElement("canvas")
  canvas.width = largura
  canvas.height = altura

  const ctx = canvas.getContext("2d")
  if (!ctx) return arquivo

  ctx.drawImage(bitmap, 0, 0, largura, altura)
  bitmap.close()

  // Proporcional à foto, para ficar igual em qualquer tamanho.
  const corpo = Math.max(14, Math.round(largura * 0.022))
  const margem = Math.round(largura * 0.028)
  const raio = corpo * 0.85

  ctx.save()
  ctx.textBaseline = "middle"

  // Sombra suave: sobre foto clara, texto branco puro some.
  ctx.shadowColor = "rgba(0,0,0,0.45)"
  ctx.shadowBlur = corpo * 0.6

  const centroY = altura - margem - raio
  const inicioX = margem

  ctx.strokeStyle = "rgba(255,255,255,0.85)"
  ctx.lineWidth = Math.max(1, corpo * 0.06)
  ctx.beginPath()
  ctx.arc(inicioX + raio, centroY, raio, 0, Math.PI * 2)
  ctx.stroke()

  ctx.fillStyle = "rgba(255,255,255,0.92)"
  ctx.textAlign = "center"
  ctx.font = `${Math.round(corpo * 0.95)}px Georgia, "Times New Roman", serif`
  ctx.fillText(marca.charAt(0).toUpperCase(), inicioX + raio, centroY + corpo * 0.04)

  ctx.textAlign = "left"
  ctx.font = `${corpo}px Georgia, "Times New Roman", serif`
  ctx.fillText(marca, inicioX + raio * 2 + corpo * 0.6, centroY)

  ctx.restore()

  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.86))
  if (!blob) return arquivo

  const nome = arquivo.name.replace(/\.[^.]+$/, "") + ".webp"
  return new File([blob], nome, { type: "image/webp" })
}

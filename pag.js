document.addEventListener('DOMContentLoaded', function () {
  const formBusca = document.getElementById('form-busca');
  const campoBusca = document.getElementById('campo-busca');

  if (!formBusca || !campoBusca) return;

  // Variável para controlar o temporizador de remoção automática
  let temporizadorLimpeza = null;

  formBusca.addEventListener('submit', function (e) {
    e.preventDefault();

    const termo = campoBusca.value.trim();

    // 1. Cancela qualquer temporizador pendente e limpa destaques anteriores
    if (temporizadorLimpeza) {
      clearTimeout(temporizadorLimpeza);
    }
    limparDestaques();

    if (!termo) return;

    // Escapa caracteres especiais do termo para evitar erros na RegExp
    const termoEscapado = termo.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    // Seleciona todos os elementos de texto da página
    const todosElementos = document.querySelectorAll('body *:not(script):not(style)');
    let primeiroEncontrado = null;

    todosElementos.forEach(elemento => {
      // Ignora a navbar, o menu, a caixa de busca e elementos com filhos HTML
      if (
        elemento.closest('.navbar') || 
        elemento.closest('nav') || 
        elemento.closest('#form-busca') || 
        elemento.children.length > 0
      ) {
        return;
      }

      const texto = elemento.textContent;
      const regex = new RegExp(`(${termoEscapado})`, 'gi');

      if (regex.test(texto)) {
        // Envolve a palavra pesquisada pela tag <mark> mantendo as maiúsculas/minúsculas originais
        elemento.innerHTML = texto.replace(regex, '<mark class="destaque-marca">$1</mark>');
        
        if (!primeiroEncontrado) {
          primeiroEncontrado = elemento.querySelector('.destaque-marca');
        }
      }
    });

    // 2. Rola até o resultado e agenda a remoção automática
    if (primeiroEncontrado) {
      primeiroEncontrado.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Remove o destaque marca-texto automaticamente após 3.5 segundos (3500ms)
      temporizadorLimpeza = setTimeout(() => {
        limparDestaques();
      }, 3500);
    } else {
      alert('Nenhum resultado encontrado para: "' + termo + '"');
    }
  });

  // Função para remover as tags <mark> e restaurar o texto original sem quebrar o layout
  function limparDestaques() {
    const marcas = document.querySelectorAll('mark.destaque-marca');
    marcas.forEach(marca => {
      const pai = marca.parentNode;
      if (pai) {
        pai.replaceChild(document.createTextNode(marca.textContent), marca);
        pai.normalize(); // Consolida nós de texto adjacentes
      }
    });
  }
});
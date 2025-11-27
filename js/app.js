                                                                                                                                                                          // Variáveis globais para simular o estado da aplicação
let carrinho = [];
let total = 0;

// --- Funções de Controle de Interface ---

function login() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('store-page').style.display = 'block';
}

function fecharPix() {
    document.getElementById('pagamento').style.display = 'none';
}

function fecharNota() {
    document.getElementById('notaFiscal').style.display = 'none';
}

function fecharModalCaixa() {
    document.getElementById('modalCaixa').style.display = 'none';
    fecharNota(); // Fecha a nota fiscal também
}

function selecionarPagamento(metodo) {
    if (metodo === 'dinheiro' || metodo === 'cartao') {
        document.getElementById('modalCaixa').style.display = 'flex';
    }
}

// Função para adicionar produto ao carrinho e iniciar o processo de pagamento/nota
function comprarProduto(nome, preco) {
    // 1. Capturar os dados do cliente
    const nomeCliente = document.getElementById('nomeCliente').value;
    const telefoneCliente = document.getElementById('telefoneCliente').value;
    const idCliente = document.getElementById('idCliente').value; // Opcional

    // 2. Validação dos dados obrigatórios (Nome e Telefone)
    if (!nomeCliente || !telefoneCliente) {
        alert('Por favor, preencha seu Nome Completo e Telefone (com DDD) antes de comprar.');
        return;
    }

    // Validação extra para garantir que o telefone foi preenchido corretamente pela máscara
    if (telefoneCliente.replace(/\D/g, '').length < 10) {
        alert('Por favor, verifique se o Telefone foi preenchido corretamente (mínimo 10 dígitos com DDD).');
        return;
    }

    // Simulação de adição ao carrinho (mantendo a estrutura original)
    carrinho.push({ nome, preco });
    total += preco;

    // 3. Gerar o conteúdo da nota fiscal com os dados do cliente
    // Se o idCliente estiver vazio, exibe "Não informado".
    const idDisplay = idCliente || "Não informado";

    let detalhesNota = `
        <div class="nota-cliente-info">
            <p><strong>Cliente:</strong> ${nomeCliente}</p>
            <p><strong>Telefone:</strong> ${telefoneCliente}</p>
            <p><strong>CPF/CNPJ:</strong> ${idDisplay}</p>
        </div>
        <p><strong>Produto:</strong> ${nome}</p>
        <p><strong>Preço:</strong> R$ ${preco.toFixed(2).replace('.', ',')}</p>
        <p>Obrigado pela sua compra! Escolha a forma de pagamento:</p>
    `;

    // 4. Exibir a nota fiscal
    document.getElementById('notaDetalhes').innerHTML = detalhesNota;
    document.getElementById('notaFiscal').style.display = 'flex';

    // Limpar o carrinho e total após a "compra"
    carrinho = [];
    total = 0;
}

// --- Funções de Máscara e Validação de Entrada ---

document.addEventListener('DOMContentLoaded', () => {
    // Define o ano no rodapé
    document.getElementById('year').textContent = new Date().getFullYear();

    // Simulação de clique no PIX para copiar (mantendo a estrutura original)
    const pixBtn = document.getElementById('pixBtn');
    if (pixBtn) {
        pixBtn.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Chave Pix copiada! (Simulação)');
        });
    }

    // 1. Validação: Nome (apenas letras e espaços)
    const nomeInput = document.getElementById('nomeCliente');

    if (nomeInput) {
        nomeInput.addEventListener('keypress', function (e) {
            // Permite letras (A-Z, a-z), letras com acento e espaço
            const char = String.fromCharCode(e.charCode);
            const regex = /^[A-Za-zÀ-ú\s]$/;
            if (!regex.test(char)) {
                e.preventDefault();
            }
        });
    }

    // 2. Máscara de Telefone (apenas números e formatação)
    const telefoneInput = document.getElementById('telefoneCliente');

    if (telefoneInput) {
        // Garante que só números sejam digitados
        telefoneInput.addEventListener('keypress', function (e) {
            if (e.charCode < 48 || e.charCode > 57) {
                e.preventDefault();
            }
        });

        telefoneInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
            let maskedValue = '';

            if (value.length > 11) {
                value = value.substring(0, 11);
            }

            if (value.length > 0) {
                maskedValue += '(' + value.substring(0, 2);
            }
            if (value.length > 2) {
                maskedValue += ') ';

                const isCelular = value.length > 10;
                const fimNumero = isCelular ? 7 : 6;

                maskedValue += value.substring(2, fimNumero);
            }
            if (value.length > 6) {
                if (value.length > 10) {
                    maskedValue += '-' + value.substring(7, 11);
                }
                else if (value.length > 6) {
                    maskedValue += '-' + value.substring(6, 10);
                }
            }

            e.target.value = maskedValue;
        });
    }

    // 3. Máscara de CPF ou CNPJ (apenas números e formatação)
    const idClienteInput = document.getElementById('idCliente');

    if (idClienteInput) {
        // Garante que só números sejam digitados
        idClienteInput.addEventListener('keypress', function (e) {
            if (e.charCode < 48 || e.charCode > 57) {
                e.preventDefault();
            }
        });

        idClienteInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, ''); // Remove tudo que não é dígito
            let maskedValue = '';

            if (value.length <= 11) { // CPF (000.000.000-00)
                if (value.length > 11) value = value.substring(0, 11);

                maskedValue = value.replace(/(\d{3})(\d)/, '$1.$2')
                    .replace(/(\d{3})(\d)/, '$1.$2')
                    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                e.target.maxLength = 14;

            } else { // CNPJ (00.000.000/0000-00)
                if (value.length > 14) value = value.substring(0, 14);

                maskedValue = value.replace(/^(\d{2})(\d)/, '$1.$2')
                    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
                    .replace(/\.(\d{3})(\d)/, '.$1/$2')
                    .replace(/(\d{4})(\d)/, '$1-$2');
                e.target.maxLength = 18;
            }

            e.target.value = maskedValue;
        });
    }
});
function calcularChurrasco() {
    try {
        console.log("Iniciando cálculo...");

        // Capturar valores dos inputs
        console.log("Capturando valores dos inputs...");
        const adultos = parseInt(document.getElementById('adultos').value) || 0;
        const criancas = parseInt(document.getElementById('criancas').value) || 0;
        const duracao = parseFloat(document.getElementById('duracao').value) || 0;
        const opcaoCarne = document.getElementById('opcao-carne').value;
        let nivelVariacao = document.getElementById('variacao').value;

        console.log(`Valores capturados: adultos=${adultos}, criancas=${criancas}, duracao=${duracao}, opcaoCarne=${opcaoCarne}, nivelVariacao=${nivelVariacao}`);

        // Calcular total de pessoas no início
        const totalPessoas = adultos + criancas;

        // Validação
        if (adultos < 0 || criancas < 0 || duracao <= 0) {
            alert("Valores não podem ser negativos ou zero. Por favor, corrija os campos.");
            console.log("Validação falhou: valores negativos ou zero.");
            return;
        }
        if (totalPessoas === 0) {
            alert("O número total de pessoas não pode ser zero. Adicione adultos ou crianças.");
            console.log("Validação falhou: número total de pessoas é zero.");
            return;
        }

        // Nova regra: Para ≤ 8 pessoas, variação alta é tratada como baixa
        if (totalPessoas <= 8 && nivelVariacao === "alta") {
            nivelVariacao = "baixa";
            console.log("Total de pessoas ≤ 8, ajustando variação alta para baixa.");
        }

        // Consumo por pessoa
        const consumo = {
            "carne_bovina": { adulto: 0.15, crianca: 0.075 },
            "carne_suina": { adulto: 0.075, crianca: 0.0375 },
            "frango": { adulto: 0.075, crianca: 0.0375 },
            "pao_de_alho": { adulto: 0.5, crianca: 0.25 },
            "queijo_coalho": { adulto: 0.3, crianca: 0.15 }
        };

        // Listas de produtos por categoria com preços atualizados
        const produtos = {
            "boi_premium": [
                { nome: "Picanha", preco: 139.90 },
                { nome: "Fraldinha Red", preco: 89.90 },
                { nome: "Maminha", preco: 79.90 }
            ],
            "boi_beneficio": [
                { nome: "Ancho", preco: 59.90 },
                { nome: "Fraldão Uruguay", preco: 69.90 },
                { nome: "Baby Beef", preco: 59.90 }
            ],
            "boi_qualidade_beneficio": [
                { nome: "Prime Steak", preco: 69.90 }
            ],
            "porco_premium": [
                { nome: "Picanha Suína", preco: 39.90 }
            ],
            "porco_beneficio": [
                { nome: "Linguiça Pura", preco: 16.90 },
                { nome: "Linguiça Queijo Coalho", preco: 21.90 },
                { nome: "Linguiça Requeijão", preco: 22.90 },
                { nome: "Ancho Suíno", preco: 17.90 }
            ],
            "porco_qualidade_beneficio": [
                { nome: "Pernil Fatiado", preco: 25.90 }
            ],
            "frango_premium": [
                { nome: "Sobrecoxa Desossada na Mostarda e Mel", preco: 27.90 }
            ],
            "frango_beneficio": [
                { nome: "Tulipa ao Vinho", preco: 17.90 },
                { nome: "Tulipa na Cachaça com Rapadura", preco: 17.90 },
                { nome: "Sobrecoxa Desossada na Cerveja", preco: 24.90 }
            ],
            "pao_de_alho": [
                { nome: "Pão de Alho Tradicional", preco: 16.90 },
                { nome: "Pão de Alho Poró", preco: 17.90 },
                { nome: "Pão de Alho 4 Queijos", preco: 17.90 },
                { nome: "Pão de Alho Frango c/ Requeijão", preco: 17.90 }
            ],
            "queijo_coalho": [
                { nome: "Queijo Coalho", preco: 27.90 }
            ]
        };

        const precosCarvao = {
            "carvao_3kg": 17.90,
            "carvao_10kg": 60.00
        };

        const unidadesPorPacote = {
            "pao_de_alho": 4,
            "queijo_coalho": 7,
            "carne_suina": 0.5,
            "frango": 0.5,
            "carvao_3kg": 3,
            "carvao_10kg": 10
        };

        // Selecionar opções de carne com base nas regras
        console.log("Selecionando opções de carne...");
        let opcoesCarne;
        if (opcaoCarne === "premium") {
            opcoesCarne = {
                "carne_bovina": produtos.boi_premium,
                "carne_suina": [...produtos.porco_premium, ...produtos.porco_beneficio, ...produtos.porco_qualidade_beneficio],
                "frango": [...produtos.frango_premium, ...produtos.frango_beneficio]
            };
        } else if (opcaoCarne === "beneficio") {
            opcoesCarne = {
                "carne_bovina": produtos.boi_beneficio,
                "carne_suina": [...produtos.porco_beneficio, ...produtos.porco_qualidade_beneficio],
                "frango": produtos.frango_beneficio
            };
        }
        console.log("Opções de carne selecionadas:", opcoesCarne);

        // Função para distribuir quantidades com variação e proporções
        function distribuirQuantidade(total, produtosDisponiveis, limiteMaximo = 2.5, minimoPorTipo = 1, isPacote = false) {
            if (total <= 0 || produtosDisponiveis.length === 0) return [];
            
            let distribuicao = [];
            let restante = total;

            if (nivelVariacao === "baixa") {
                for (let produto of produtosDisponiveis) {
                    if (restante <= 0) break;
                    let quantidade = Math.min(restante, limiteMaximo);
                    if (isPacote) {
                        let divisor = isPacote === "carne" ? 0.5 : 4;
                        quantidade = Math.round(quantidade / divisor) * divisor;
                        if (quantidade > restante) quantidade = Math.floor(restante / divisor) * divisor;
                    } else {
                        quantidade = Math.round(quantidade * 10) / 10; // Arredondar para 1 casa decimal
                    }
                    if (quantidade >= minimoPorTipo || (quantidade > 0 && distribuicao.length === 0)) {
                        distribuicao.push({ nome: produto.nome, quantidade: quantidade, preco: produto.preco });
                        restante -= quantidade;
                    }
                }
                if (restante > 0 && distribuicao.length > 0) {
                    let ultimo = distribuicao[distribuicao.length - 1];
                    let ajuste = Math.round(restante * 10) / 10; // Ajuste com 1 casa decimal
                    if (isPacote) {
                        let divisor = isPacote === "carne" ? 0.5 : 4;
                        ajuste = Math.round((ultimo.quantidade + restante) / divisor) * divisor - ultimo.quantidade;
                    }
                    ultimo.quantidade += ajuste;
                }
            } else {
                let numTipos = Math.min(produtosDisponiveis.length, Math.floor(total / minimoPorTipo));
                if (numTipos === 0 && total > 0) numTipos = 1; // Garantir pelo menos 1 tipo se houver quantidade
                let quantidadePorTipo = Math.round(total / numTipos * 10) / 10; // Arredondar para 1 casa decimal
                if (quantidadePorTipo < minimoPorTipo && total >= minimoPorTipo) {
                    quantidadePorTipo = Math.round(minimoPorTipo * 10) / 10;
                    numTipos = Math.floor(total / minimoPorTipo);
                }
                for (let i = 0; i < numTipos; i++) {
                    let quantidade = quantidadePorTipo;
                    if (isPacote) {
                        let divisor = isPacote === "carne" ? 0.5 : 4;
                        quantidade = Math.round(quantidade / divisor) * divisor;
                    } else {
                        quantidade = Math.round(quantidade * 10) / 10; // Arredondar para 1 casa decimal
                    }
                    if (restante >= quantidade || (i === 0 && restante > 0)) { // Forçar pelo menos 1 item se houver quantidade
                        distribuicao.push({ nome: produtosDisponiveis[i % produtosDisponiveis.length].nome, quantidade: Math.min(quantidade, restante), preco: produtosDisponiveis[i % produtosDisponiveis.length].preco });
                        restante -= quantidade;
                    }
                }
                if (restante > 0 && distribuicao.length > 0) {
                    let ultimo = distribuicao[distribuicao.length - 1];
                    let ajuste = Math.round(restante * 10) / 10;
                    if (isPacote) {
                        let divisor = isPacote === "carne" ? 0.5 : 4;
                        ajuste = Math.round((ultimo.quantidade + restante) / divisor) * divisor - ultimo.quantidade;
                    }
                    ultimo.quantidade += ajuste;
                }
            }
            let soma = distribuicao.reduce((sum, item) => sum + item.quantidade, 0);
            if (soma !== total && distribuicao.length > 0) {
                let diferenca = Math.round((total - soma) * 10) / 10;
                distribuicao[0].quantidade += diferenca;
            }
            return distribuicao;
        }

        // Cálculo
        console.log("Calculando consumo total de carne...");
        const resultado = {};
        const custos = {};
        const pacotes = {};
        let custoTotal = 0;
        const multiplicador = duracao > 4 ? 1.2 : 1.0;

        // Calcular consumo total de carne
        let consumoTotalCarne = (adultos * 0.3 + criancas * 0.15) * multiplicador;
        console.log(`Consumo total de carne: ${consumoTotalCarne} kg`);

        // Ajustar proporção de carnes com base no total
        let carneBovina = 0;
        let carneSuina = 0;
        let carneFrango = 0;

        if (consumoTotalCarne >= 2) {
            // Proporção padrão: 50% bovina, 25% suíno, 25% frango
            carneBovina = consumoTotalCarne * 0.5;
            carneSuina = consumoTotalCarne * 0.25;
            carneFrango = consumoTotalCarne * 0.25;

            // Arredondar para valores inteiros ou múltiplos de 0.5
            carneBovina = Math.round(carneBovina * 10) / 10; // Arredondar para 1 casa decimal
            carneSuina = Math.round(carneSuina / 0.5) * 0.5; // Múltiplo de 0.5
            carneFrango = Math.round(carneFrango / 0.5) * 0.5; // Múltiplo de 0.5

            // Ajustar a soma para corresponder ao consumo total
            let somaCarne = carneBovina + carneSuina + carneFrango;
            if (somaCarne !== Math.round(consumoTotalCarne * 10) / 10) {
                let diferenca = (Math.round(consumoTotalCarne * 10) / 10) - somaCarne;
                carneBovina += diferenca; // Ajustar carne bovina para corrigir a diferença
                carneBovina = Math.round(carneBovina * 10) / 10; // Garantir arredondamento
            }

            console.log(`Distribuição para churrasco ≥ 2kg: bovina=${carneBovina}, suína=${carneSuina}, frango=${carneFrango}`);
        } else {
            // Regras para churrascos menores (< 2kg)
            if (consumoTotalCarne >= 1.5) {
                // 1kg bovina + 0.5kg frango
                carneBovina = 1;
                carneFrango = 0.5;
            } else if (consumoTotalCarne >= 1.2) {
                // 0.7kg bovina + 0.5kg frango
                carneBovina = 0.7;
                carneFrango = 0.5;
            } else {
                // Apenas bovina (arredondado para o mais próximo de 100g)
                carneBovina = Math.round(consumoTotalCarne * 10) / 10;
            }
            console.log(`Distribuição para churrasco < 2kg: bovina=${carneBovina}, suína=${carneSuina}, frango=${carneFrango}`);
        }

        // Distribuição das carnes
        console.log("Distribuindo carnes...");
        resultado.carne_bovina = distribuirQuantidade(carneBovina, opcoesCarne.carne_bovina, 2.5, 1);
        resultado.carne_suina = distribuirQuantidade(carneSuina, opcoesCarne.carne_suina, 2.5, 1, "carne");
        resultado.frango = distribuirQuantidade(carneFrango, opcoesCarne.frango, 2.5, 1, "carne");
        console.log("Carne bovina:", resultado.carne_bovina);
        console.log("Carne suína:", resultado.carne_suina);
        console.log("Frango:", resultado.frango);

        // Verificar se a soma das carnes está correta
        let somaCarneDistribuida = (resultado.carne_bovina.reduce((sum, item) => sum + item.quantidade, 0) || 0) +
                                  (resultado.carne_suina.reduce((sum, item) => sum + item.quantidade, 0) || 0) +
                                  (resultado.frango.reduce((sum, item) => sum + item.quantidade, 0) || 0);
        if (somaCarneDistribuida < consumoTotalCarne && resultado.frango.length === 0 && carneFrango > 0) {
            resultado.frango = distribuirQuantidade(carneFrango, opcoesCarne.frango, 0.5, 0.5, "carne");
            console.log("Ajuste: Frango adicionado após verificação:", resultado.frango);
        }

        // Calcular pão de alho com regras específicas
        console.log("Calculando pão de alho...");
        let totalPaoDeAlho = Math.round((adultos * consumo.pao_de_alho.adulto + criancas * consumo.pao_de_alho.crianca) * multiplicador);
        // Garantir pelo menos 1 pacote (4 unidades) se o cálculo for menor
        if (totalPaoDeAlho < 4) {
            totalPaoDeAlho = 4;
        }
        let paoChurrascoGrande = totalPessoas > 20;
        resultado.pao_de_alho = [];
        if (paoChurrascoGrande && totalPaoDeAlho > 8) {
            let qtd60 = Math.round(totalPaoDeAlho * 0.6);
            let qtd40 = totalPaoDeAlho - qtd60;
            let tradicional = distribuirQuantidade(qtd60, produtos.pao_de_alho.slice(0, 1), 4, 4, "pao");
            let poro = distribuirQuantidade(qtd40, produtos.pao_de_alho.slice(1, 2), 4, 4, "pao");
            let queijos = distribuirQuantidade(qtd40 / 2, produtos.pao_de_alho.slice(2, 3), 4, 4, "pao");
            let frango = distribuirQuantidade(qtd40 / 2, produtos.pao_de_alho.slice(3), 4, 4, "pao");
            resultado.pao_de_alho = [
                ...(tradicional.length ? tradicional : [{ nome: "Pão de Alho Tradicional", quantidade: 0, preco: 16.90 }]),
                ...(poro.length ? poro : [{ nome: "Pão de Alho Poró", quantidade: 0, preco: 17.90 }]),
                ...(queijos.length ? queijos : [{ nome: "Pão de Alho 4 Queijos", quantidade: 0, preco: 17.90 }]),
                ...(frango.length ? frango : [{ nome: "Pão de Alho Frango c/ Requeijão", quantidade: 0, preco: 17.90 }])
            ].filter(item => item.quantidade > 0);
        } else {
            // Para churrascos menores, usar apenas 1 sabor por pacote
            let numPacotes = Math.ceil(totalPaoDeAlho / 4);
            let tradicional = distribuirQuantidade(numPacotes * 4, produtos.pao_de_alho.slice(0, 1), numPacotes * 4, 4, "pao");
            resultado.pao_de_alho = tradicional.length ? tradicional : [{ nome: "Pão de Alho Tradicional", quantidade: 0, preco: 16.90 }];
        }
        console.log("Pão de alho:", resultado.pao_de_alho);

        // Calcular queijo coalho (apenas para ≥ 8 pessoas)
        console.log("Calculando queijo coalho...");
        let totalQueijoCoalho = 0;
        if (totalPessoas >= 8) {
            totalQueijoCoalho = Math.round((adultos * consumo.queijo_coalho.adulto + criancas * consumo.queijo_coalho.crianca) * multiplicador);
            let pacotesQueijo = Math.ceil(totalQueijoCoalho / 7);
            if (totalQueijoCoalho % 7 >= 3) pacotesQueijo += 1;
            resultado.queijo_coalho = [{ nome: produtos.queijo_coalho[0].nome, quantidade: pacotesQueijo * 7, preco: produtos.queijo_coalho[0].preco }];
        } else {
            resultado.queijo_coalho = [];
        }
        console.log("Queijo coalho:", resultado.queijo_coalho);

        // Calcular custos
        console.log("Calculando custos...");
        for (let item of ["carne_bovina", "carne_suina", "frango", "pao_de_alho", "queijo_coalho"]) {
            let custoItem = 0;
            if (!resultado[item] || resultado[item].length === 0) continue;
            for (let subitem of resultado[item]) {
                if (item === "carne_suina" && subitem.nome === "Picanha Suína") {
                    custoItem += subitem.quantidade * subitem.preco;
                } else if (item === "carne_suina" || item === "frango") {
                    custoItem += (subitem.quantidade / 0.5) * subitem.preco;
                } else if (item === "pao_de_alho") {
                    custoItem += (subitem.quantidade / 4) * subitem.preco;
                } else if (item === "queijo_coalho") {
                    let pacotesQueijo = Math.ceil(subitem.quantidade / 7);
                    custoItem = pacotesQueijo * produtos.queijo_coalho[0].preco;
                } else {
                    custoItem += subitem.quantidade * subitem.preco;
                }
            }
            custos[item] = Math.round(custoItem * 100) / 100;
            custoTotal += custoItem;
            pacotes[item] = item === "pao_de_alho" ? Math.ceil(resultado[item].reduce((sum, i) => sum + i.quantidade, 0) / 4) :
                           item === "queijo_coalho" ? Math.ceil(totalQueijoCoalho / 7) :
                           item === "carne_suina" || item === "frango" ? resultado[item].reduce((sum, i) => sum + Math.ceil(i.quantidade / 0.5), 0) : 0;
        }

        // Calcular quantidade de carvão com obrigatoriedade de pelo menos 1 saco de 3kg
        console.log("Calculando carvão...");
        const pesoTotalCarne = resultado.carne_bovina.reduce((sum, item) => sum + item.quantidade, 0) +
                              resultado.carne_suina.reduce((sum, item) => sum + item.quantidade, 0) +
                              resultado.frango.reduce((sum, item) => sum + item.quantidade, 0);
        let quantidadeCarvaoKg = Math.max(Math.round(pesoTotalCarne), 3); // Garantir pelo menos 3kg
        let pacotes3kg = 0;
        let pacotes10kg = 0;
        pacotes10kg = Math.floor(quantidadeCarvaoKg / 10);
        let resto = quantidadeCarvaoKg - (pacotes10kg * 10);
        if (resto > 0) {
            pacotes3kg = Math.ceil(resto / 3);
        }
        let totalCarvaoKg = (pacotes10kg * 10) + (pacotes3kg * 3);
        resultado.carvao = totalCarvaoKg;
        pacotes.carvao_3kg = pacotes3kg;
        pacotes.carvao_10kg = pacotes10kg;
        const custoCarvao = (pacotes3kg * precosCarvao.carvao_3kg) + (pacotes10kg * precosCarvao.carvao_10kg);
        custos.carvao = Math.round(custoCarvao * 100) / 100;
        custoTotal += custoCarvao;
        console.log(`Carvão: ${totalCarvaoKg} kg, pacotes 3kg=${pacotes3kg}, pacotes 10kg=${pacotes10kg}`);

        // Calcular valor por pessoa
        const valorPorPessoa = totalPessoas > 0 ? Math.round((custoTotal / totalPessoas) * 100) / 100 : 0;
        console.log(`Custo total: R$${custoTotal}, valor por pessoa: R$${valorPorPessoa}`);

        // Exibir resultados detalhados
        console.log("Gerando HTML de resultados...");
        let resultadoHTML = "<h2>Resultados:</h2><ul>";
        for (let item in resultado) {
            if (item === "carne_bovina" || item === "carne_suina" || item === "frango" || item === "pao_de_alho" || item === "queijo_coalho") {
                if (!resultado[item] || resultado[item].length === 0) continue;
                for (let subitem of resultado[item]) {
                    let unidade = (item === "pao_de_alho" || item === "queijo_coalho") ? "unidades" : "kg";
                    let custoSubitem;
                    if (item === "carne_suina" && subitem.nome === "Picanha Suína") {
                        custoSubitem = subitem.quantidade * subitem.preco;
                    } else if (item === "carne_suina" || item === "frango") {
                        custoSubitem = (subitem.quantidade / 0.5) * subitem.preco;
                    } else if (item === "pao_de_alho") {
                        custoSubitem = (subitem.quantidade / 4) * subitem.preco;
                    } else if (item === "queijo_coalho") {
                        custoSubitem = (Math.ceil(subitem.quantidade / 7)) * subitem.preco;
                    } else {
                        custoSubitem = subitem.quantidade * subitem.preco;
                    }
                    resultadoHTML += `<li>${subitem.nome}: ${subitem.quantidade} ${unidade} (R$${custoSubitem.toFixed(2)})</li>`;
                }
            } else if (item === "carvao") {
                resultadoHTML += `<li>Carvão: ${resultado[item]} kg (R$${custos[item].toFixed(2)})</li>`;
            }
        }
        resultadoHTML += "</ul><h3>Pacotes Necessários:</h3><ul>";
        for (let item in pacotes) {
            if (pacotes[item] > 0) {
                if (item === "carne_suina" || item === "frango") {
                    resultadoHTML += `<li>${item.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}: ${pacotes[item]} pacote(s) 500g (R$${custos[item].toFixed(2)})</li>`;
                } else if (item === "pao_de_alho" || item === "queijo_coalho") {
                    resultadoHTML += `<li>${item.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}: ${pacotes[item]} pacote(s) (R$${custos[item].toFixed(2)})</li>`;
                } else if (item === "carvao_3kg" || item === "carvao_10kg") {
                    let tamanho = item === "carvao_3kg" ? "3kg" : "10kg";
                    let custoPacote = pacotes[item] * precosCarvao[item];
                    resultadoHTML += `<li>${item.replace('carvao_', '').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}: ${pacotes[item]} pacote(s) ${tamanho} (R$${custoPacote.toFixed(2)})</li>`;
                }
            }
        }
        resultadoHTML += `<li><strong>Valor por Pessoa: R$${valorPorPessoa.toFixed(2)}</strong></li>`;
        resultadoHTML += `<li><strong>Custo Total Estimado: R$${custoTotal.toFixed(2)}</strong></li></ul>`;

        // Gerar orçamento com título dinâmico
        console.log("Gerando orçamento...");
        const opcaoCarneTexto = opcaoCarne === "premium" ? "Premium" : "Custo Benefício";
        const variacaoTexto = nivelVariacao === "alta" ? "Alta" : "Baixa";
        let listaCompras = `Orçamento referente a ${adultos} Adultos e ${criancas} Crianças Opção de carne ${opcaoCarneTexto} Taxa de Variedade ${variacaoTexto}\n\nCarne Bovina:\n`;
        for (let subitem of resultado.carne_bovina || []) {
            listaCompras += `- ${subitem.nome}: ${subitem.quantidade} kg\n`;
        }
        listaCompras += "\nCarne Suína:\n";
        for (let subitem of resultado.carne_suina || []) {
            let pacotesTexto = subitem.nome === "Picanha Suína" ? "" : ` (${Math.ceil(subitem.quantidade / 0.5)} pacotes de 500g)`;
            listaCompras += `- ${subitem.nome}: ${subitem.quantidade} kg${pacotesTexto}\n`;
        }
        listaCompras += "\nFrango:\n";
        for (let subitem of resultado.frango || []) {
            listaCompras += `- ${subitem.nome}: ${subitem.quantidade} kg (${Math.ceil(subitem.quantidade / 0.5)} pacotes de 500g)\n`;
        }
        listaCompras += "\nAcompanhamentos:\n";
        for (let subitem of resultado.pao_de_alho || []) {
            listaCompras += `- ${subitem.nome}: ${subitem.quantidade} unidades (${Math.ceil(subitem.quantidade / 4)} pacotes)\n`;
        }
        for (let subitem of resultado.queijo_coalho || []) {
            listaCompras += `- ${subitem.nome}: ${subitem.quantidade} unidades (${Math.ceil(subitem.quantidade / 7)} pacotes)\n`;
        }
        listaCompras += "\nCarvão:\n";
        if (pacotes.carvao_3kg > 0) {
            listaCompras += `- Carvão: ${pacotes.carvao_3kg} pacotes de 3kg\n`;
        }
        if (pacotes.carvao_10kg > 0) {
            listaCompras += `- Carvão: ${pacotes.carvao_10kg} pacotes de 10kg\n`;
        }
        listaCompras += `\nValor por Pessoa: R$${valorPorPessoa.toFixed(2)}\nCusto Total Estimado: R$${custoTotal.toFixed(2)}`;

        // Exibir resultados e orçamento
        console.log("Exibindo resultados...");
        document.getElementById('resultado').innerHTML = resultadoHTML;
        document.getElementById('resultado').classList.add('show');
        document.getElementById('lista-compras').innerHTML = listaCompras;
        document.getElementById('lista-compras').classList.add('show');

        // Mostrar botão de copiar
        document.getElementById('copiar-lista').style.display = 'block';

        // Armazenar lista para copiar
        window.listaComprasTexto = listaCompras;
        console.log("Cálculo concluído com sucesso!");
    } catch (error) {
        alert("Erro ao calcular: " + error.message + "\nPor favor, verifique os dados e tente novamente.");
        console.error("Erro durante o cálculo:", error);
    }
}

function copiarLista() {
    try {
        if (!window.listaComprasTexto) {
            alert("Nenhuma lista disponível para copiar. Calcule primeiro.");
            return;
        }
        navigator.clipboard.writeText(window.listaComprasTexto).then(() => {
            alert("Lista de compras copiada com sucesso!");
        }).catch(err => {
            alert("Erro ao copiar a lista: " + err);
        });
    } catch (error) {
        alert("Erro ao copiar a lista: " + error.message);
        console.error("Erro ao copiar a lista:", error);
    }
}

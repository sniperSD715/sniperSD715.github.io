function calcularChurrasco() {
    // Capturar valores dos inputs
    const adultos = parseInt(document.getElementById('adultos').value) || 0;
    const criancas = parseInt(document.getElementById('criancas').value) || 0;
    const duracao = parseFloat(document.getElementById('duracao').value) || 0;
    const opcaoCarne = document.getElementById('opcao-carne').value;

    // Validação
    if (adultos < 0 || criancas < 0 || duracao <= 0) {
        alert("Valores não podem ser negativos ou zero.");
        return;
    }

    // Consumo por pessoa
    const consumo = {
        "carne_bovina": { adulto: 0.15, crianca: 0.075 },
        "carne_suina": { adulto: 0.075, crianca: 0.0375 },
        "frango": { adulto: 0.075, crianca: 0.0375 },
        "pao_de_alho": { adulto: 0.5, crianca: 0.25 },
        "queijo_coalho": { adulto: 0.5, crianca: 0.25 },
        "carvao": { adulto: 0.02, crianca: 0.01 }
    };

    // Preços (R$/kg ou R$/pacote)
    const precosCarneCara = {
        "carne_bovina": 139.90,  // Picanha
        "carne_suina": 43.80,    // Linguiça Queijo Coalho
        "frango": 49.80          // Sobrecoxa Desossada
    };
    const precosCarneBarata = {
        "carne_bovina": 59.90,   // Ancho
        "carne_suina": 33.80,    // Linguiça Pura
        "frango": 35.80          // Tulipa Cachaça
    };
    const precosOutros = {
        "pao_de_alho": 16.90,    // Pcte 4 pães
        "queijo_coalho": 27.90,  // Pcte 7 espetos
        "carvao": 6.00           // Carvão 10kg
    };
    const unidadesPorPacote = {
        "pao_de_alho": 4,
        "queijo_coalho": 7,
        "carne_suina": 0.5,
        "frango": 0.5,
        "carvao": 10
    };

    // Selecionar preços
    let precos = { ...precosOutros };
    let nomesCarne = {};
    if (opcaoCarne === "cara") {
        precos = { ...precos, ...precosCarneCara };
        nomesCarne = { "carne_bovina": "Picanha", "carne_suina": "Linguiça Queijo Coalho", "frango": "Sobrecoxa Desossada" };
    } else {
        precos = { ...precos, ...precosCarneBarata };
        nomesCarne = { "carne_bovina": "Ancho", "carne_suina": "Linguiça Pura", "frango": "Tulipa Cachaça" };
    }

    // Cálculo
    const resultado = {};
    const custos = {};
    const pacotes = {};
    let custoTotal = 0;
    const multiplicador = duracao > 4 ? 1.2 : 1.0;

    for (let item in consumo) {
        let total = (adultos * consumo[item].adulto + criancas * consumo[item].crianca) * multiplicador;
        resultado[item] = Math.round(total * 100) / 100;

        if (item in unidadesPorPacote) {
            let numPacotes;
            if (item === "carne_suina" || item === "frango") {
                numPacotes = Math.ceil(total / unidadesPorPacote[item]);
                pacotes[item] = numPacotes;
                custo = numPacotes * (precos[item] * unidadesPorPacote[item]) / 2;
            } else if (item === "pao_de_alho" || item === "queijo_coalho") {
                numPacotes = Math.ceil(total / unidadesPorPacote[item]);
                pacotes[item] = numPacotes;
                custo = numPacotes * precos[item];
            } else if (item === "carvao") {
                numPacotes = Math.ceil(total / unidadesPorPacote[item]);
                pacotes[item] = numPacotes;
                custo = numPacotes * precos[item] * unidadesPorPacote[item];
            }
        } else {
            custo = total * precos[item];
        }
        custos[item] = Math.round(custo * 100) / 100;
        custoTotal += custo;
    }

    // Exibir resultados
    let resultadoHTML = "<h2>Resultados:</h2><ul>";
    for (let item in resultado) {
        let unidade = item === "pao_de_alho" || item === "queijo_coalho" ? "unidades" : "kg";
        if (item in nomesCarne) {
            resultadoHTML += `<li>${nomesCarne[item]} (${item.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}): ${resultado[item]} ${unidade} (R$${custos[item].toFixed(2)})</li>`;
        } else {
            resultadoHTML += `<li>${item.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}: ${resultado[item]} ${unidade} (R$${custos[item].toFixed(2)})</li>`;
        }
    }
    resultadoHTML += "</ul><h3>Pacotes Necessários:</h3><ul>";
    for (let item in pacotes) {
        if (item === "carne_suina" || item === "frango") {
            resultadoHTML += `<li>${item.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}: ${pacotes[item]} pacote(s) 500g (R$${custos[item].toFixed(2)})</li>`;
        } else if (item === "carvao") {
            resultadoHTML += `<li>${item.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}: ${pacotes[item]} pacote(s) 10kg (R$${custos[item].toFixed(2)})</li>`;
        } else {
            resultadoHTML += `<li>${item.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}: ${pacotes[item]} pacote(s) (R$${custos[item].toFixed(2)})</li>`;
        }
    }
    resultadoHTML += `<li><strong>Custo Total Estimado: R$${custoTotal.toFixed(2)}</strong></li></ul>`;

    document.getElementById('resultado').innerHTML = resultadoHTML;
    document.getElementById('resultado').classList.add('show');
}
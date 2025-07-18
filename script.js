const tabelaEventos = document.getElementById("tabelaEventos");
const tabelaVoluntariado = document.getElementById("tabelaVoluntariado");
const tabelaExposicoes = document.getElementById("tabelaExposicoes");

const totalEventos = document.getElementById("totalEventos");
const totalVoluntariado = document.getElementById("totalVoluntariado");
const totalExposicoes = document.getElementById("totalExposicoes");

const percentualPorCategoria = {
    eventos: 0.30,       // 30% para eventos e cursos
    voluntariado: 0.50,  // 50% para voluntariado
    exposicoes: 0.40     // 40% para exposições e prêmios
};

const dropEventos = document.getElementById("dropEventos");
const dropVoluntariado = document.getElementById("dropVoluntariado");
const dropExposicoes = document.getElementById("dropExposicoes");

const categorias = {
    eventos: [],
    voluntariado: [],
    exposicoes: []
};

// Função para tratar o arquivo e calcular as horas
function handleFileDrop(e, categoria) {
    e.preventDefault();
    const file = e.dataTransfer.files[0];

    if (file && file.type === "application/pdf") {
        const horas = parseInt(prompt("Quantas horas o certificado vale?"));
        const horasConsideradas = horas * percentualPorCategoria[categoria];

        const certificado = {
            nome: file.name,
            horas: horas,
            horasConsideradas: horasConsideradas
        };

        categorias[categoria].push(certificado);
        updateTable(categoria);
    }
}

// Atualiza a tabela de acordo com a categoria
function updateTable(categoria) {
    let tabela;
    let totalHoras = 0;

    if (categoria === "eventos") {
        tabela = tabelaEventos;
        totalHoras = categorias.eventos.reduce((acc, cert) => acc + cert.horasConsideradas, 0);
        totalEventos.textContent = totalHoras.toFixed(2);
    } else if (categoria === "voluntariado") {
        tabela = tabelaVoluntariado;
        totalHoras = categorias.voluntariado.reduce((acc, cert) => acc + cert.horasConsideradas, 0);
        totalVoluntariado.textContent = totalHoras.toFixed(2);
    } else if (categoria === "exposicoes") {
        tabela = tabelaExposicoes;
        totalHoras = categorias.exposicoes.reduce((acc, cert) => acc + cert.horasConsideradas, 0);
        totalExposicoes.textContent = totalHoras.toFixed(2);
    }

    tabela.innerHTML = "<table><thead><tr><th>Nome do Certificado</th><th>Horas Originais</th><th>Horas Consideradas</th></tr></thead><tbody>";
    categorias[categoria].forEach(cert => {
        tabela.innerHTML += `<tr>
            <td>${cert.nome}</td>
            <td>${cert.horas}</td>
            <td>${cert.horasConsideradas.toFixed(2)}</td>
        </tr>`;
    });
    tabela.innerHTML += "</tbody></table>";
}

// Funções de arrastar e soltar
dropEventos.addEventListener("dragover", (e) => e.preventDefault());
dropEventos.addEventListener("drop", (e) => handleFileDrop(e, "eventos"));

dropVoluntariado.addEventListener("dragover", (e) => e.preventDefault());
dropVoluntariado.addEventListener("drop", (e) => handleFileDrop(e, "voluntariado"));

dropExposicoes.addEventListener("dragover", (e) => e.preventDefault());
dropExposicoes.addEventListener("drop", (e) => handleFileDrop(e, "exposicoes"));

// Função de download
document.getElementById("baixarCertificados").addEventListener("click", () => {
    const zip = new JSZip();

    Object.keys(categorias).forEach(categoria => {
        const categoriaDir = zip.folder(categoria);

        categorias[categoria].forEach(cert => {
            categoriaDir.file(cert.nome, "Conteúdo do Certificado: " + cert.nome); // Aqui você pode incluir o PDF real
        });
    });

    zip.generateAsync({type: "blob"}).then(function(content) {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(content);
        link.download = "certificados_complementares.zip";
        link.click();
    });
});

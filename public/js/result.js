document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3002/dados')
        .then(response => response.json())
        .then(data => {
            const dadosContainer = document.getElementById('dados');

            // Função para filtrar os dados conforme o input de pesquisa
            function filterData(searchTerm) {
                if (!searchTerm) return data.pessoal;

                return data.pessoal.filter(pessoal => {
                    const contato = data.contato_pessoal.find(c => c.doador_id === pessoal.id);
                    const identidade = data.identidade.find(i => i.doador_id === pessoal.id);

                    // Verifica se o termo de pesquisa está presente nos dados pessoais, no contato ou na identidade
                    return (
                        pessoal.first_name.toLowerCase().includes(searchTerm) ||
                        pessoal.last_name.toLowerCase().includes(searchTerm) ||
                        identidade.cpf.includes(searchTerm) ||
                        identidade.rg.includes(searchTerm) ||
                        contato.phone.includes(searchTerm) ||
                        contato.email.toLowerCase().includes(searchTerm) ||
                        pessoal.tipo_sangue.toLowerCase().includes(searchTerm)
                    );
                });
            }

            // Função para atualizar os dados exibidos com base no termo de pesquisa
            function updateDisplayedData(searchTerm) {
                const filteredData = filterData(searchTerm.toLowerCase());
                let html = '';

                filteredData.forEach(pessoal => {
                    const contato = data.contato_pessoal.find(c => c.doador_id === pessoal.id);
                    const identidade = data.identidade.find(i => i.doador_id === pessoal.id);

                    html += `
                        <div class="card mb-3">
                            <div class="card-body">
                                <h5 class="card-title">${pessoal.first_name} ${pessoal.last_name}</h5>
                                <p class="card-text"><strong>Data de Nascimento:</strong> ${pessoal.data_nascimento}</p>
                                <p class="card-text"><strong>Sexo:</strong> ${pessoal.sexo}</p>
                                <p class="card-text"><strong>Tipo Sanguíneo:</strong> ${pessoal.tipo_sangue}</p>
                                <p class="card-text"><strong>Telefone:</strong> ${contato.phone}</p>
                                <p class="card-text"><strong>Email:</strong> ${contato.email}</p>
                                <p class="card-text"><strong>RG:</strong> ${identidade.rg}</p>
                                <p class="card-text"><strong>CPF:</strong> ${identidade.cpf}</p>
                            </div>
                        </div>
                    `;
                });

                dadosContainer.innerHTML = html;
            }

            // Inicializa os dados exibidos
            updateDisplayedData('');

            // Evento de input para o campo de pesquisa
            document.getElementById('searchInput').addEventListener('input', function() {
                updateDisplayedData(this.value);
            });
        })
        .catch(error => console.error('Erro ao buscar dados:', error));
});

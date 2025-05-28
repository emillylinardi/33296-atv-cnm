const ENDPOINTS = {
    create: 'http://cnms-parking-api.net.uztec.com.br/api/v1/entry',
    stayTime: 'http://cnms-parking-api.net.uztec.com.br/api/v1/time/',
    exit: 'http://cnms-parking-api.net.uztec.com.br/api/v1/exit/',
    verify: 'http://cnms-parking-api.net.uztec.com.br/api/v1/check/',
    update: 'http://cnms-parking-api.net.uztec.com.br/api/v1/update/',
    cancel: 'http://cnms-parking-api.net.uztec.com.br/api/v1/cancel/'
};

function sendRequest(url, method = 'GET', payload = null) {
    return fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: payload ? JSON.stringify(payload) : null
    }).then(res => {
        if (!res.ok) throw new Error('Requisição falhou.');
        return res.json();
    });
}

document.getElementById('entryForm').addEventListener('submit', e => {
    e.preventDefault();

    const modelo = document.getElementById('entryModel').value;
    const placa = document.getElementById('entryPlate').value;

    sendRequest(ENDPOINTS.create, 'POST', { model: modelo, plate: placa })
        .then(() => {
            document.getElementById('entryResult').textContent = 'Entrada registrada com sucesso!';
        })
        .catch(err => {
            document.getElementById('entryResult').textContent = 'Erro ao registrar entrada.';
            console.error(err);
        });
});

document.getElementById('timeForm').addEventListener('submit', e => {
    e.preventDefault();

    const placa = document.getElementById('timePlate').value;

    fetch(ENDPOINTS.stayTime + placa)
        .then(res => {
            if (!res.ok) throw new Error('Erro ao buscar tempo.');
            return res.json();
        })
        .then(data => {
            document.getElementById('timeResult').textContent = `Tempo estacionado: ${data.parkedTime.toFixed(2)} minutos`;
        })
        .catch(err => {
            document.getElementById('timeResult').textContent = 'Falha ao consultar tempo.';
            console.error(err);
        });
});

document.getElementById('exitForm').addEventListener('submit', e => {
    e.preventDefault();

    const placa = document.getElementById('exitPlate').value;

    sendRequest(ENDPOINTS.exit + placa, 'PATCH')
        .then(() => {
            document.getElementById('exitResult').textContent = 'Saída registrada com sucesso!';
        })
        .catch(err => {
            document.getElementById('exitResult').textContent = 'Erro ao registrar saída.';
            console.error(err);
        });
});

document.getElementById('checkForm').addEventListener('submit', e => {
    e.preventDefault();

    const placa = document.getElementById('checkPlate').value;

    fetch(ENDPOINTS.verify + placa)
        .then(res => {
            if (!res.ok) throw new Error('Erro na verificação.');
            return res.json();
        })
        .then(data => {
            const status = data.entryTime ? 'SIM' : 'NÃO';
            document.getElementById('checkResult').textContent = `Veículo está no estacionamento? ${status}`;
        })
        .catch(err => {
            document.getElementById('checkResult').textContent = 'Erro ao verificar.';
            console.error(err);
        });
});

document.getElementById('updateForm').addEventListener('submit', e => {
    e.preventDefault();

    const placa = document.getElementById('updatePlate').value;
    const modelo = document.getElementById('updateModel').value;

    sendRequest(ENDPOINTS.update + placa, 'PUT', { plate: placa, model: modelo })
        .then(() => {
            document.getElementById('updateResult').textContent = 'Dados atualizados!';
        })
        .catch(err => {
            document.getElementById('updateResult').textContent = 'Erro ao atualizar.';
            console.error(err);
        });
});

document.getElementById('cancelForm').addEventListener('submit', e => {
    e.preventDefault();

    const placa = document.getElementById('cancelPlate').value;

    sendRequest(ENDPOINTS.cancel + placa, 'DELETE')
        .then(() => {
            document.getElementById('cancelResult').textContent = 'Registro removido.';
        })
        .catch(err => {
            document.getElementById('cancelResult').textContent = 'Erro ao remover.';
            console.error(err);
        });
});

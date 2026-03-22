document.getElementById('test-success').onclick = () => showToast('Dados salvos com sucesso', 'success');
document.getElementById('test-error').onclick   = () => showToast('Erro ao salvar dados', 'error');
document.getElementById('test-warning').onclick = () => showToast('Preencha todos os campos', 'warning');
document.getElementById('test-info').onclick    = () => showToast('Dica: use o LinkedIn completo', 'info');
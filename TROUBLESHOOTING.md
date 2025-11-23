# Teste de Conexão com Backend

Para testar se o backend está acessível, abra o console do navegador (F12) e execute:

```javascript
fetch('http://localhost:8080/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'teste@email.com',
    senha: 'senha123'
  })
})
.then(response => {
  console.log('Status:', response.status);
  return response.json();
})
.then(data => console.log('Data:', data))
.catch(error => console.error('Error:', error));
```

## Checklist de Troubleshooting:

### 1. Backend está rodando?
```bash
# No terminal do backend, verifique se está rodando na porta 8080
# Deve mostrar algo como: "Tomcat started on port(s): 8080"
```

### 2. URL está correta?
- Backend: `http://localhost:8080`
- Endpoint: `/api/admin/dashboard/usuarios`
- URL completa: `http://localhost:8080/api/admin/dashboard/usuarios`

### 3. CORS está configurado no backend?
O backend precisa permitir requisições do frontend (porta 5173):

```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
            .allowedOrigins("http://localhost:5173")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true);
    }
}
```

### 4. Verifique os logs do navegador
- Abra o Console (F12)
- Na aba Network, veja se a requisição está sendo feita
- Verifique o status code da resposta

### 5. Teste direto no backend
```bash
curl -X POST http://localhost:8080/api/admin/dashboard/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "tipo": "ALUNO",
    "nomeCompleto": "Teste Usuario",
    "email": "teste@email.com",
    "senha": "senha123",
    "confirmarSenha": "senha123",
    "dataNascimento": "2010-01-01",
    "idTurma": 1
  }'
```

## Erros Comuns:

### NetworkError / Failed to fetch
**Causa**: Backend não está rodando ou CORS não configurado
**Solução**: 
1. Inicie o backend
2. Configure CORS no backend
3. Verifique firewall/antivírus

### 404 Not Found
**Causa**: Endpoint não existe ou URL errada
**Solução**: Verifique a URL no backend

### 401 Unauthorized
**Causa**: Endpoint requer autenticação
**Solução**: Faça login primeiro ou remova necessidade de auth para cadastro

### 500 Internal Server Error
**Causa**: Erro no backend
**Solução**: Verifique os logs do backend

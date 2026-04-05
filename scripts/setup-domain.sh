#!/bin/bash

# 🚀 ForteTrain - Cloudflare Domain Setup Script
# Versão: 1.0
# Criado: 2026-04-05
# Projeto: ForteTrain v8.0.1 Omni-Sport

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="fortetrain"
DOMAIN="fortetrain.com"
WWW_DOMAIN="www.fortetrain.com"
PAGES_URL="fortetrain.pages.dev"

# Functions
print_header() {
    echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

check_prerequisites() {
    print_header "Verificando Pré-requisitos"
    
    # Check Node.js
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node -v)
        print_success "Node.js instalado: $NODE_VERSION"
    else
        print_error "Node.js não encontrado. Instale: https://nodejs.org"
        exit 1
    fi
    
    # Check npm
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm -v)
        print_success "npm instalado: $NPM_VERSION"
    else
        print_error "npm não encontrado"
        exit 1
    fi
    
    # Check Wrangler
    if npm list -g wrangler &> /dev/null; then
        print_success "Wrangler instalado"
    else
        print_warning "Wrangler não encontrado globalmente"
        echo -e "   ${YELLOW}Instalando wrangler globalmente...${NC}"
        npm install -g wrangler
        print_success "Wrangler instalado com sucesso"
    fi
    
    # Check if logged in to Wrangler
    if npx wrangler whoami &> /dev/null; then
        WRANGLER_USER=$(npx wrangler whoami 2>&1 | grep "You are logged in" || echo "Not logged in")
        print_success "Wrangler autenticado"
    else
        print_error "Wrangler não autenticado"
        echo -e "   ${YELLOW}Execute: npx wrangler login${NC}"
        exit 1
    fi
}

check_domain_dns() {
    print_header "Verificando Configuração DNS"
    
    print_info "Verificando domínio root: $DOMAIN"
    if nslookup $DOMAIN &> /dev/null; then
        DNS_RESULT=$(nslookup $DOMAIN 2>&1 | grep "Name:" || echo "No DNS record")
        print_success "DNS resolvendo para $DOMAIN"
        echo "$DNS_RESULT"
    else
        print_warning "DNS não configurado para $DOMAIN"
        echo -e "   ${YELLOW}Configure os nameservers do Cloudflare no seu registrador${NC}"
    fi
    
    print_info "Verificando www: $WWW_DOMAIN"
    if nslookup $WWW_DOMAIN &> /dev/null; then
        print_success "DNS resolvendo para $WWW_DOMAIN"
    else
        print_warning "DNS não configurado para $WWW_DOMAIN"
    fi
}

list_current_domains() {
    print_header "Domínios Atuais do Projeto"
    
    print_info "Listando domínios do projeto: $PROJECT_NAME"
    npx wrangler pages domain list --project-name $PROJECT_NAME || {
        print_error "Falha ao listar domínios"
        return 1
    }
}

add_custom_domain() {
    print_header "Adicionando Custom Domains"
    
    # Add root domain
    print_info "Adicionando domínio root: $DOMAIN"
    if npx wrangler pages domain add $DOMAIN --project-name $PROJECT_NAME; then
        print_success "Domínio $DOMAIN adicionado com sucesso"
    else
        print_error "Falha ao adicionar $DOMAIN"
        return 1
    fi
    
    # Add www domain
    print_info "Adicionando www: $WWW_DOMAIN"
    if npx wrangler pages domain add $WWW_DOMAIN --project-name $PROJECT_NAME; then
        print_success "Domínio $WWW_DOMAIN adicionado com sucesso"
    else
        print_error "Falha ao adicionar $WWW_DOMAIN"
        return 1
    fi
    
    print_info "Aguardando ativação dos domínios (isso pode levar 2-5 minutos)..."
    sleep 5
    
    list_current_domains
}

test_ssl() {
    print_header "Testando Certificado SSL"
    
    print_info "Testando SSL para $DOMAIN"
    if curl -I https://$DOMAIN &> /dev/null; then
        print_success "SSL válido para $DOMAIN"
    else
        print_warning "SSL ainda não disponível para $DOMAIN (aguarde 5 minutos)"
    fi
    
    print_info "Testando SSL para $WWW_DOMAIN"
    if curl -I https://$WWW_DOMAIN &> /dev/null; then
        print_success "SSL válido para $WWW_DOMAIN"
    else
        print_warning "SSL ainda não disponível para $WWW_DOMAIN"
    fi
}

test_redirects() {
    print_header "Testando Redirecionamentos"
    
    print_info "Testando www → root redirect"
    REDIRECT_RESULT=$(curl -sI https://$WWW_DOMAIN | grep -i "location:" || echo "No redirect")
    if [[ $REDIRECT_RESULT == *"$DOMAIN"* ]]; then
        print_success "Redirect www → root configurado"
    else
        print_warning "Redirect www → root não configurado"
        echo -e "   ${YELLOW}Configure Page Rule no Cloudflare Dashboard${NC}"
        echo -e "   ${YELLOW}URL pattern: www.${DOMAIN}/*${NC}"
        echo -e "   ${YELLOW}Forwarding URL: 301 → https://${DOMAIN}/\$1${NC}"
    fi
    
    print_info "Testando HTTP → HTTPS redirect"
    HTTP_REDIRECT=$(curl -sI http://$DOMAIN | grep -i "location:" || echo "No redirect")
    if [[ $HTTP_REDIRECT == *"https"* ]]; then
        print_success "Redirect HTTP → HTTPS ativo"
    else
        print_warning "Redirect HTTP → HTTPS não ativo"
        echo -e "   ${YELLOW}Ative 'Always Use HTTPS' no Cloudflare Dashboard${NC}"
    fi
}

test_application() {
    print_header "Testando Aplicação"
    
    print_info "Testando landing page"
    if curl -sI https://$DOMAIN | grep -q "200"; then
        print_success "Landing page acessível"
    else
        print_error "Landing page não acessível"
    fi
    
    print_info "Testando login page"
    if curl -sI https://$DOMAIN/auth/login | grep -q "200"; then
        print_success "Login page acessível"
    else
        print_error "Login page não acessível"
    fi
    
    print_info "Testando API health"
    if curl -sI https://$DOMAIN/api/health | grep -q "200"; then
        print_success "API respondendo"
    else
        print_warning "API não configurada ou não respondendo"
    fi
}

show_dns_instructions() {
    print_header "Instruções de Configuração DNS"
    
    echo ""
    echo -e "${YELLOW}Para configurar DNS no Cloudflare Dashboard:${NC}"
    echo ""
    echo "1. Login: https://dash.cloudflare.com"
    echo "2. Selecione: $DOMAIN"
    echo "3. Navegue: DNS → Records"
    echo ""
    echo -e "${GREEN}Record 1: Root domain${NC}"
    echo "   Type: CNAME"
    echo "   Name: @ (ou $DOMAIN)"
    echo "   Target: $PAGES_URL"
    echo "   Proxy: ON (nuvem laranja ✅)"
    echo ""
    echo -e "${GREEN}Record 2: www subdomain${NC}"
    echo "   Type: CNAME"
    echo "   Name: www"
    echo "   Target: $PAGES_URL"
    echo "   Proxy: ON (nuvem laranja ✅)"
    echo ""
    echo -e "${GREEN}Record 3: Wildcard (OPCIONAL - multi-tenant)${NC}"
    echo "   Type: CNAME"
    echo "   Name: *"
    echo "   Target: $PAGES_URL"
    echo "   Proxy: ON (nuvem laranja ✅)"
    echo ""
}

show_ssl_instructions() {
    print_header "Instruções de Configuração SSL"
    
    echo ""
    echo -e "${YELLOW}Para configurar SSL no Cloudflare Dashboard:${NC}"
    echo ""
    echo "1. Navegue: SSL/TLS → Overview"
    echo "   SSL Mode: Full (strict) ✅"
    echo ""
    echo "2. Navegue: SSL/TLS → Edge Certificates"
    echo "   Always Use HTTPS: ON ✅"
    echo "   Automatic HTTPS Rewrites: ON ✅"
    echo "   Minimum TLS Version: 1.2 ✅"
    echo ""
}

show_redirect_instructions() {
    print_header "Instruções de Configuração de Redirect"
    
    echo ""
    echo -e "${YELLOW}Para configurar redirect www → root no Cloudflare Dashboard:${NC}"
    echo ""
    echo "1. Navegue: Rules → Page Rules → Create Page Rule"
    echo ""
    echo "2. Configuração:"
    echo "   URL pattern: www.$DOMAIN/*"
    echo "   Setting: Forwarding URL"
    echo "   Type: 301 - Permanent Redirect"
    echo "   Destination: https://$DOMAIN/\$1"
    echo ""
    echo "3. Clique: Save and Deploy"
    echo ""
}

generate_report() {
    print_header "Relatório de Status Final"
    
    echo ""
    echo -e "${BLUE}📊 Status da Configuração${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    # DNS Status
    if nslookup $DOMAIN &> /dev/null; then
        echo -e "DNS ($DOMAIN):         ${GREEN}✅ Configurado${NC}"
    else
        echo -e "DNS ($DOMAIN):         ${RED}❌ Não configurado${NC}"
    fi
    
    if nslookup $WWW_DOMAIN &> /dev/null; then
        echo -e "DNS ($WWW_DOMAIN): ${GREEN}✅ Configurado${NC}"
    else
        echo -e "DNS ($WWW_DOMAIN): ${RED}❌ Não configurado${NC}"
    fi
    
    # SSL Status
    if curl -sI https://$DOMAIN | grep -q "200"; then
        echo -e "SSL ($DOMAIN):         ${GREEN}✅ Válido${NC}"
    else
        echo -e "SSL ($DOMAIN):         ${YELLOW}⏳ Pendente${NC}"
    fi
    
    # Application Status
    if curl -sI https://$DOMAIN | grep -q "200"; then
        echo -e "Aplicação:                ${GREEN}✅ Online${NC}"
    else
        echo -e "Aplicação:                ${RED}❌ Offline${NC}"
    fi
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    echo -e "${BLUE}🌐 URLs Disponíveis${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "Landing:    ${GREEN}https://$DOMAIN${NC}"
    echo -e "Login:      ${GREEN}https://$DOMAIN/auth/login${NC}"
    echo -e "Dashboard:  ${GREEN}https://$DOMAIN/dashboard${NC}"
    echo -e "Student:    ${GREEN}https://$DOMAIN/student/app${NC}"
    echo -e "Omni-Sport: ${GREEN}https://$DOMAIN/omni-sport${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    echo -e "${BLUE}🔐 Credenciais de Demo${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Personal Trainer:"
    echo "  Email: andre@fortetrain.app"
    echo "  Senha: demo123"
    echo ""
    echo "Aluno:"
    echo "  Email: joao.santos@email.com"
    echo "  Senha: aluno123"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
}

# Main Menu
show_menu() {
    echo ""
    print_header "ForteTrain - Cloudflare Domain Setup"
    echo ""
    echo "Escolha uma opção:"
    echo ""
    echo "1) ✅ Verificar pré-requisitos"
    echo "2) 🔍 Verificar status DNS"
    echo "3) 📋 Listar domínios atuais"
    echo "4) ➕ Adicionar custom domains"
    echo "5) 🔒 Testar SSL"
    echo "6) 🔄 Testar redirects"
    echo "7) 🌐 Testar aplicação"
    echo "8) 📚 Mostrar instruções DNS"
    echo "9) 🔐 Mostrar instruções SSL"
    echo "10) 🔄 Mostrar instruções Redirect"
    echo "11) 📊 Gerar relatório completo"
    echo "12) 🚀 Setup completo (automático)"
    echo "0) ❌ Sair"
    echo ""
    read -p "Opção: " choice
    echo ""
    
    case $choice in
        1) check_prerequisites ;;
        2) check_domain_dns ;;
        3) list_current_domains ;;
        4) add_custom_domain ;;
        5) test_ssl ;;
        6) test_redirects ;;
        7) test_application ;;
        8) show_dns_instructions ;;
        9) show_ssl_instructions ;;
        10) show_redirect_instructions ;;
        11) generate_report ;;
        12)
            check_prerequisites
            check_domain_dns
            add_custom_domain
            sleep 5
            test_ssl
            test_redirects
            test_application
            generate_report
            ;;
        0)
            print_info "Saindo..."
            exit 0
            ;;
        *)
            print_error "Opção inválida"
            ;;
    esac
    
    # Show menu again
    read -p "Pressione Enter para continuar..."
    show_menu
}

# Start script
clear
show_menu

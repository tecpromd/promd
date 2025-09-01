import React, { useState } from 'react';
import { Check, Crown, Star, Zap, Shield, Users, CreditCard, Gift } from 'lucide-react';

const Monetizacao = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: 'free',
      name: 'Gratuito',
      price: { monthly: 0, yearly: 0 },
      description: 'Perfeito para começar',
      icon: Gift,
      color: 'slate',
      features: [
        '5 questões por dia',
        '1 simulado por semana',
        'Flashcards básicos',
        'Suporte por email',
        'Acesso a 2 disciplinas'
      ],
      limitations: [
        'Sem IA personalizada',
        'Sem analytics avançados',
        'Sem certificados'
      ]
    },
    {
      id: 'student',
      name: 'Estudante',
      price: { monthly: 99, yearly: 990 },
      description: 'Ideal para estudantes de medicina',
      icon: Star,
      color: 'blue',
      popular: true,
      features: [
        'Questões ilimitadas',
        'Simulados ilimitados',
        'Todas as disciplinas',
        'IA personalizada',
        'Analytics detalhados',
        'Flashcards 3D',
        'Suporte prioritário',
        'Certificados de conclusão'
      ]
    },
    {
      id: 'professional',
      name: 'Profissional',
      price: { monthly: 199, yearly: 1990 },
      description: 'Para residentes e especialistas',
      icon: Crown,
      color: 'purple',
      features: [
        'Tudo do plano Estudante',
        'Questões exclusivas',
        'Simulados personalizados',
        'Mentoria com especialistas',
        'Grupos de estudo privados',
        'API para integração',
        'Relatórios avançados',
        'Suporte 24/7'
      ]
    },
    {
      id: 'institution',
      name: 'Institucional',
      price: { monthly: 499, yearly: 4990 },
      description: 'Para escolas e hospitais',
      icon: Users,
      color: 'green',
      features: [
        'Até 100 usuários',
        'Dashboard administrativo',
        'Relatórios institucionais',
        'Customização de marca',
        'Integração LMS',
        'Treinamento da equipe',
        'Suporte dedicado',
        'SLA garantido'
      ]
    }
  ];

  const getColorClasses = (color, variant = 'primary') => {
    const colors = {
      slate: {
        primary: 'bg-slate-500',
        light: 'bg-slate-50 border-slate-200',
        text: 'text-slate-600',
        button: 'bg-slate-500 hover:bg-slate-600'
      },
      blue: {
        primary: 'bg-blue-500',
        light: 'bg-blue-50 border-blue-200',
        text: 'text-blue-600',
        button: 'bg-blue-500 hover:bg-blue-600'
      },
      purple: {
        primary: 'bg-purple-500',
        light: 'bg-purple-50 border-purple-200',
        text: 'text-purple-600',
        button: 'bg-purple-500 hover:bg-purple-600'
      },
      green: {
        primary: 'bg-green-500',
        light: 'bg-green-50 border-green-200',
        text: 'text-green-600',
        button: 'bg-green-500 hover:bg-green-600'
      }
    };
    return colors[color]?.[variant] || colors.slate[variant];
  };

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId);
    // Aqui integraria com Stripe
    console.log('Selecionado plano:', planId, 'Ciclo:', billingCycle);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-promd-navy dark:text-white mb-4">
            Escolha seu Plano
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
            Acelere seus estudos médicos com o ProMD
          </p>
          
          {/* Toggle de ciclo de cobrança */}
          <div className="inline-flex items-center bg-white dark:bg-slate-800 rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-promd-navy text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-all relative ${
                billingCycle === 'yearly'
                  ? 'bg-promd-navy text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Anual
              <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                -17%
              </span>
            </button>
          </div>
        </div>

        {/* Comparação com concorrentes */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-12">
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Compare com os Concorrentes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="font-semibold text-red-700 dark:text-red-300">UWorld</div>
              <div className="text-red-600 dark:text-red-400">R$ 1.600-2.400/mês</div>
            </div>
            <div>
              <div className="font-semibold text-red-700 dark:text-red-300">USMLE-Rx</div>
              <div className="text-red-600 dark:text-red-400">R$ 1.250/ano</div>
            </div>
            <div>
              <div className="font-semibold text-red-700 dark:text-red-300">Kaplan</div>
              <div className="text-red-600 dark:text-red-400">R$ 1.000-2.000/mês</div>
            </div>
            <div>
              <div className="font-semibold text-green-700 dark:text-green-300">ProMD</div>
              <div className="text-green-600 dark:text-green-400">R$ 99-199/mês</div>
            </div>
          </div>
        </div>

        {/* Planos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            const isPopular = plan.popular;
            const price = plan.price[billingCycle];
            
            return (
              <div
                key={plan.id}
                className={`relative bg-white dark:bg-slate-800 rounded-xl shadow-lg border-2 transition-all hover:shadow-xl ${
                  isPopular 
                    ? 'border-promd-navy scale-105' 
                    : 'border-slate-200 dark:border-slate-700 hover:border-promd-sky'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-promd-navy text-white px-4 py-1 rounded-full text-sm font-medium">
                      Mais Popular
                    </span>
                  </div>
                )}
                
                <div className="p-6">
                  {/* Header do plano */}
                  <div className="text-center mb-6">
                    <div className={`w-12 h-12 ${getColorClasses(plan.color)} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                      {plan.name}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      {plan.description}
                    </p>
                  </div>

                  {/* Preço */}
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-slate-900 dark:text-white">
                      {formatPrice(price)}
                    </div>
                    <div className="text-slate-600 dark:text-slate-400 text-sm">
                      {price > 0 ? `por ${billingCycle === 'monthly' ? 'mês' : 'ano'}` : 'para sempre'}
                    </div>
                    {billingCycle === 'yearly' && price > 0 && (
                      <div className="text-green-600 dark:text-green-400 text-xs mt-1">
                        Economize {formatPrice(plan.price.monthly * 12 - plan.price.yearly)} por ano
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700 dark:text-slate-300 text-sm">
                          {feature}
                        </span>
                      </div>
                    ))}
                    {plan.limitations?.map((limitation, index) => (
                      <div key={index} className="flex items-start gap-3 opacity-60">
                        <div className="w-5 h-5 flex-shrink-0 mt-0.5 flex items-center justify-center">
                          <div className="w-3 h-3 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                        </div>
                        <span className="text-slate-600 dark:text-slate-400 text-sm line-through">
                          {limitation}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Botão */}
                  <button
                    onClick={() => handleSelectPlan(plan.id)}
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
                      isPopular
                        ? 'bg-promd-navy text-white hover:bg-promd-navy/90'
                        : plan.id === 'free'
                        ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                        : `${getColorClasses(plan.color, 'button')} text-white`
                    }`}
                  >
                    {plan.id === 'free' ? 'Começar Grátis' : 'Assinar Agora'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Trial gratuito */}
        <div className="bg-gradient-to-r from-promd-navy to-promd-sky rounded-xl p-8 text-white text-center mb-12">
          <h3 className="text-2xl font-bold mb-4">
            Teste Grátis por 15 Dias
          </h3>
          <p className="text-lg mb-6 opacity-90">
            Experimente todos os recursos premium sem compromisso
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-white text-promd-navy px-8 py-3 rounded-lg font-medium hover:bg-slate-100 transition-colors">
              Iniciar Trial Gratuito
            </button>
            <span className="text-sm opacity-75">
              Sem cartão de crédito necessário
            </span>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-8 text-center">
            Perguntas Frequentes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                Posso cancelar a qualquer momento?
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Sim, você pode cancelar sua assinatura a qualquer momento. Não há taxas de cancelamento.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                O que acontece após o trial?
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Após 15 dias, você será automaticamente direcionado para o plano gratuito, a menos que escolha um plano pago.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                Há desconto para estudantes?
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Sim, oferecemos 50% de desconto para estudantes com comprovação acadêmica válida.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                Quais formas de pagamento aceitas?
              </h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Aceitamos cartões de crédito, débito, PIX e boleto bancário através do Stripe.
              </p>
            </div>
          </div>
        </div>

        {/* Garantia */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-6 py-3 rounded-full">
            <Shield className="w-5 h-5" />
            <span className="font-medium">Garantia de 30 dias ou seu dinheiro de volta</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Monetizacao;


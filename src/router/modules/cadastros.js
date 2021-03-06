/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/views/layout/Layout'

const CadastrosRouter = {
  path: '/cadastros',
  component: Layout,
  redirect: 'noredirect',
  name: 'Cadastros',
  meta: {
    title: 'Cadastros',
    icon: 'form'
  },
  children: [
    {
      path: 'index/:tipo',
      component: () => import('@/views/cadastros/index'),
      name: 'Espécies',
      props: true,
      meta: { title: 'Listar' },
      hidden: true
    },
    {
      path: 'add/:tipo',
      component: () => import('@/views/cadastros/add'),
      // name: 'Espécies',
      // props: {'tipoCadastro': 'especies'},
      meta: { title: 'Novo Cadastro' },
      hidden: true
    },
    {
      path: 'index/especies',
      component: () => import('@/views/cadastros/index'),
      name: 'Espécies',
      props: { 'tipoCadastro': 'especies' },
      meta: { title: 'Espécies' }
    },
    {
      path: 'index/racas',
      component: () => import('@/views/cadastros/index'),
      name: 'Raças',
      meta: { title: 'Raças' }
    },
    /*
    {
      path: 'index/pelagens',
      component: () => import('@/views/components-demo/dragKanban'),
      name: 'Pelagens',
      meta: { title: 'Pelagens' }
    },
    {
      path: 'index/patologias',
      component: () => import('@/views/components-demo/dragKanban'),
      name: 'Patologias',
      meta: { title: 'Patologias' }
    },
    */
    // {
    //   path: 'index/tipos-atendimento',
    //   component: () => import('@/views/components-demo/dragKanban'),
    //   name: 'Tipos de Atendimento',
    //   meta: { title: 'Tipos de Atendimento' }
    // },
    {
      path: 'index/exames',
      component: () => import('@/views/cadastros/index'),
      name: 'Exames',
      meta: { title: 'Exames' }
    },

    {
      path: 'exames/atributos',
      component: () => import('@/views/cadastros/exames-atributos'),
      name: 'Atributos',
      hidden: true,
      meta: { title: 'Atributos Exames' }
    },
    {
      path: 'exames/referencias',
      component: () => import('@/views/cadastros/exames-referencia'),
      name: 'Referências',
      hidden: true,
      meta: { title: 'Referências Exames' }
    },
    {
      path: 'index/exames/modelo',
      component: () => import('@/views/components-demo/dragKanban'),
      name: 'Modelos Documento',
      meta: { title: 'Modelos Documento' }
    }
  ]
}

export default CadastrosRouter
